import google.generativeai as genai
import os
from typing import Dict, Any
import time

class GeminiModel:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            print("⚠️  Warning: GEMINI_API_KEY not found in environment variables")
            self.model = None
            self.available_models = []
        else:
            try:
                genai.configure(api_key=api_key)
                
                # Try different model names that are currently available
                model_names = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']
                self.model = None
                
                for model_name in model_names:
                    try:
                        self.model = genai.GenerativeModel(model_name)
                        self.model_name = model_name
                        print(f"✅ Successfully initialized Gemini model: {model_name}")
                        break
                    except Exception as e:
                        print(f"⚠️  Model {model_name} not available: {e}")
                        continue
                
                if not self.model:
                    print("⚠️  Warning: No available Gemini models found")
                    
            except Exception as e:
                print(f"⚠️  Warning: Failed to initialize Gemini client: {e}")
                self.model = None
        
    def summarize(self, text: str, model_name: str = "gemini-1.5-flash") -> Dict[str, Any]:
        """
        Summarize text using Google Gemini
        """
        start_time = time.time()
        
        if not self.model:
            return {
                "summary": "Error: Gemini client not initialized. Please check your API key or model availability.",
                "model_name": "Google Gemini",
                "processing_time": time.time() - start_time,
                "success": False,
                "error": "Client not initialized"
            }
        
        try:
            # Create summarization prompt
            prompt = f"""Please provide a concise and clear summary of the following text. 
            Focus on extracting the main points and key information while maintaining accuracy.
            Keep the summary informative but concise.
            
            Text to summarize:
            {text}
            
            Provide a summary:"""
            
            response = self.model.generate_content(prompt)
            processing_time = time.time() - start_time
            
            summary = response.text.strip()
            
            return {
                "summary": summary,
                "model_name": f"Google {self.model_name}",
                "processing_time": round(processing_time, 2),
                "success": True
            }
            
        except Exception as e:
            return {
                "summary": f"Error: {str(e)}",
                "model_name": f"Google {getattr(self, 'model_name', 'Gemini')}",
                "processing_time": time.time() - start_time,
                "success": False,
                "error": str(e)
            }
    
    def get_available_models(self):
        """Return list of available Gemini models"""
        if hasattr(self, 'model_name') and self.model_name:
            return [
                {"id": self.model_name, "name": f"Gemini {self.model_name.replace('gemini-', '').title()}"}
            ]
        else:
            return [
                {"id": "gemini-1.5-flash", "name": "Gemini 1.5 Flash"}
            ] 