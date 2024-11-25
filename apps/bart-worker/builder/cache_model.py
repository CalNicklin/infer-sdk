"""
RunPod | Transformer | Model Fetcher
"""

from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

def cache_model():
    print("Downloading and caching model...")
    
    # Download and cache the model
    model = AutoModelForSequenceClassification.from_pretrained(
        'facebook/bart-large-mnli',
        torch_dtype=torch.float16  # Cache in FP16 to save space
    )
    model.save_pretrained('/root/.cache/huggingface/hub/facebook/bart-large-mnli')
    
    # Download and cache the tokenizer
    tokenizer = AutoTokenizer.from_pretrained('facebook/bart-large-mnli')
    tokenizer.save_pretrained('/root/.cache/huggingface/hub/facebook/bart-large-mnli')
    
    print("Model and tokenizer cached successfully!")

if __name__ == "__main__":
    cache_model()
