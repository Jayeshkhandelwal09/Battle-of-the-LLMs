from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
import torch
from typing import Dict, Any
import time
import gc

class HuggingFaceModels:
    def __init__(self):
        self.loaded_models = {}
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
    def load_model(self, model_name: str):
        """Load a model if not already loaded"""
        if model_name not in self.loaded_models:
            print(f"Loading {model_name}...")
            try:
                if model_name == "facebook/bart-large-cnn":
                    self.loaded_models[model_name] = pipeline(
                        "summarization",
                        model=model_name,
                        device=0 if self.device == "cuda" else -1,
                        torch_dtype=torch.float16 if self.device == "cuda" else torch.float32
                    )
                elif model_name == "google/pegasus-xsum":
                    self.loaded_models[model_name] = pipeline(
                        "summarization",
                        model=model_name,
                        device=0 if self.device == "cuda" else -1,
                        torch_dtype=torch.float16 if self.device == "cuda" else torch.float32
                    )
                print(f"✅ {model_name} loaded successfully")
            except Exception as e:
                print(f"❌ Error loading {model_name}: {str(e)}")
                raise e
                
    def summarize(self, text: str, model_name: str) -> Dict[str, Any]:
        """
        Summarize text using HuggingFace models
        """
        start_time = time.time()
        
        try:
            # Load model if needed
            self.load_model(model_name)
            
            # Get the pipeline
            summarizer = self.loaded_models[model_name]
            
            # Set parameters based on model
            if "bart" in model_name.lower():
                max_length = 150
                min_length = 50
                length_penalty = 2.0
            elif "pegasus" in model_name.lower():
                max_length = 128
                min_length = 32
                length_penalty = 0.8
            else:
                max_length = 150
                min_length = 50
                length_penalty = 2.0
            
            # Truncate text if too long (models have token limits)
            if len(text.split()) > 800:  # Rough word count check
                text = ' '.join(text.split()[:800])
            
            # Generate summary
            result = summarizer(
                text,
                max_length=max_length,
                min_length=min_length,
                length_penalty=length_penalty,
                num_beams=4,
                early_stopping=True
            )
            
            processing_time = time.time() - start_time
            summary = result[0]['summary_text'].strip()
            
            # Get readable model name
            readable_name = self.get_readable_name(model_name)
            
            return {
                "summary": summary,
                "model_name": readable_name,
                "processing_time": round(processing_time, 2),
                "success": True
            }
            
        except Exception as e:
            return {
                "summary": f"Error: {str(e)}",
                "model_name": self.get_readable_name(model_name),
                "processing_time": time.time() - start_time,
                "success": False,
                "error": str(e)
            }
    
    def get_readable_name(self, model_name: str) -> str:
        """Convert model ID to readable name"""
        name_mapping = {
            "facebook/bart-large-cnn": "BART Large CNN",
            "google/pegasus-xsum": "Pegasus XSum",
        }
        return name_mapping.get(model_name, model_name)
    
    def get_available_models(self):
        """Return list of available HuggingFace models"""
        return [
            {"id": "facebook/bart-large-cnn", "name": "BART Large CNN"},
            {"id": "google/pegasus-xsum", "name": "Pegasus XSum"}
        ]
    
    def clear_model_cache(self):
        """Clear loaded models to free memory"""
        for model_name in list(self.loaded_models.keys()):
            del self.loaded_models[model_name]
        self.loaded_models = {}
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        print("Model cache cleared") 