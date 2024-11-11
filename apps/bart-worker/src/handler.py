import torch
import runpod
from runpod.serverless.utils.rp_validator import validate
from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline

print(torch.cuda.is_available())
print(torch.cuda.device_count())
print(torch.cuda.memory_allocated())
print(torch.cuda.memory_reserved())
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

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


def classify_text(sequence, labels):
    model = AutoModelForSequenceClassification.from_pretrained(
        "facebook/bart-large-mnli",
        local_files_only=True,
    ).to(device)
    tokenizer = AutoTokenizer.from_pretrained(
        "facebook/bart-large-mnli", local_files_only=True)

    classifier = pipeline(
        "zero-shot-classification",
        model=model,
        tokenizer=tokenizer,
        device=0,
    )

    return classifier(sequence, labels, multi_label=True)


def handler(event):
    """
    This is the handler function that will be called by RunPod.
    """
    try:
        val_input = validate(event['input'], INPUT_SCHEMA)
        if 'errors' in val_input:
            return {"error": val_input['errors']}
        val_input = val_input['validated_input']

        result = classify_text(val_input["sequence"], val_input["labels"])

        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }


runpod.serverless.start({"handler": handler, "concurrency_modifier": lambda x: 1000})