"""
RunPod | Transformer | Model Fetcher
"""

from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline


def get_pipeline(model, tokenizer):
    pipe = pipeline(
        "zero-shot-classification",
        model=model,
        tokenizer=tokenizer
    )
    return pipe


def get_model():
    model = AutoModelForSequenceClassification.from_pretrained('facebook/bart-large-mnli')
    tokenizer = AutoTokenizer.from_pretrained('facebook/bart-large-mnli')
    get_pipeline(model, tokenizer)
    return model, tokenizer


if __name__ == "__main__":
    get_model()
