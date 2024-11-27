from modal import Image, App, Volume, method, enter, web_endpoint
import logging
from typing import List, Dict
from pathlib import PurePosixPath

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define Modal-specific components
app = App("bart-classifier")
volume = Volume.from_name("bart-volume", create_if_missing=True)

# Create Modal image with dependencies
image = (
    Image.debian_slim()
    .apt_install(
        "curl",
        "build-essential",
        "pkg-config",
        "libssl-dev",
        "git",
    )
    .pip_install(
        "setuptools-rust",
        "wheel",
        "numpy<2.0",
        "torch==2.2.0",
        "accelerate==0.26.1",
        "transformers==4.36.2",
        "tokenizers==0.15.2",
        "fastapi[standard]"
    )
)

@app.cls(
    image=image,
    gpu=('A100'),  # Just specify the GPU type
    memory=8192,      # Memory goes as a separate parameter to @app.cls
    volumes={PurePosixPath("/model"): volume}
)
class BartClassifier:
    MODEL_ID = "facebook/bart-large-mnli"

    @enter()
    def initialize(self):
        """Initialize model when container starts"""
        import torch
        from transformers import (
            AutoModelForSequenceClassification, 
            AutoTokenizer, 
            pipeline
        )
        
        logger.info("Starting model loading process...")
        
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.MODEL_ID,
            cache_dir="/model_cache",
            local_files_only=False
        )
        
        self.model = AutoModelForSequenceClassification.from_pretrained(
            self.MODEL_ID,
            cache_dir="/model_cache",
            local_files_only=False,
            torch_dtype=torch.float16,
            low_cpu_mem_usage=True
        ).to("cuda" if torch.cuda.is_available() else "cpu")
        
        self.classifier = pipeline(
            "zero-shot-classification",
            model=self.model,
            tokenizer=self.tokenizer,
            device=0 if torch.cuda.is_available() else -1,
        )
        
        logger.info("Model loaded successfully")

    @web_endpoint(method="POST")
    async def classify_single(self, request_data: dict) -> dict:
        """Single text classification"""
        try:
            sequence = request_data.get("sequence")
            labels = request_data.get("labels")
            
            if not sequence or not labels:
                return {"status": "error", "error": "Missing sequence or labels"}
                
            result = self.classifier(sequence, labels, multi_label=True)
            return {"status": "success", "data": result}
        except Exception as e:
            return {"status": "error", "error": str(e)}

    def classify_batch(self, inputs: List[Dict[str, any]]) -> List[dict]:
        """Batch classification for multiple texts"""
        results = []
        for input_item in inputs:
            sequence = input_item.get("sequence")
            labels = input_item.get("labels")
            results.append(self.classify_single(sequence, labels))
        return results

# Modal-specific local testing entrypoint
@app.local_entrypoint()
def main():
    classifier = BartClassifier()
    
    # Single classification
    result = classifier.classify_single(
        "I love programming in Python",
        ["technology", "sports", "food"]
    )
    print("Single result:", result)
    
    # Batch classification example
    batch_inputs = [
        {"sequence": "I love programming", "labels": ["tech", "sports"]},
        {"sequence": "The weather is nice", "labels": ["weather", "mood"]},
        {"sequence": "This food tastes great", "labels": ["food", "opinion"]}
    ]
    
    # Process batch in parallel
    results = classifier.classify_batch(batch_inputs)