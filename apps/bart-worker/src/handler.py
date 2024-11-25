import torch
from runpod.serverless.utils.rp_validator import validate
from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline

# Load model at module level (container startup)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Loading model and tokenizer...")

model = AutoModelForSequenceClassification.from_pretrained(
    "facebook/bart-large-mnli",
    local_files_only=True,
).to(device)

# Enable model optimization
model.eval()
torch.set_grad_enabled(False)
if device.type == 'cuda':
    model = model.half()

tokenizer = AutoTokenizer.from_pretrained(
    "facebook/bart-large-mnli", 
    local_files_only=True
)

classifier = pipeline(
    "zero-shot-classification",
    model=model,
    tokenizer=tokenizer,
    device=0 if device.type == 'cuda' else -1,
)

print("Model loaded and ready!")

# Input validation schema
INPUT_SCHEMA = {
    'sequence': {
        'type': str,
        'required': True
    },
    'labels': {
        'type': list,
        'required': True,
    }
}

async def classify_text(sequence, labels):
    """Async function to handle classification"""
    return classifier(sequence, labels, multi_label=True)

async def handler(event):
    """
    Async handler for concurrent request processing
    """
    try:
        # Validate input
        val_input = validate(event['input'], INPUT_SCHEMA)
        if 'errors' in val_input:
            return {"error": val_input['errors']}
        val_input = val_input['validated_input']

        # Process classification
        result = await classify_text(val_input["sequence"], val_input["labels"])

        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }

# Calculate optimal batch size based on GPU memory
def get_concurrency_modifier(current_concurrency):
    if device.type != 'cuda':
        return 1
    
    # Get GPU memory info
    total_memory = torch.cuda.get_device_properties(0).total_memory
    max_concurrent = min(int(total_memory / (2 * 1024 * 1024 * 1024)), 1000)  # Limit based on GPU memory (2GB per request)
    
    return max_concurrent

# Start the serverless function
runpod.serverless.start({
    "handler": handler,
    "concurrency_modifier": get_concurrency_modifier
})