import openai
import os
from typing import Dict, Any
import time

class OpenAIModel:
    def __init__(self):
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            print("⚠️  Warning: OPENAI_API_KEY not found in environment variables")
            self.api_key = None
        else:
            openai.api_key = api_key
            self.api_key = api_key
        
    def summarize(self, text: str, model_name: str = "gpt-3.5-turbo") -> Dict[str, Any]:
        """
        Summarize text using OpenAI GPT models
        """
        start_time = time.time()
        
        if not self.api_key:
            return {
                "summary": "Error: OpenAI API key not configured. Please check your API key.",
                "model_name": f"OpenAI {model_name}",
                "processing_time": time.time() - start_time,
                "success": False,
                "error": "API key not configured"
            }
        
        try:
            # Create summarization prompt
            prompt = f"""Please provide a concise summary of the following text. 
            Focus on the main points and key information while maintaining clarity and accuracy.
            
            Text to summarize:
            {text}
            
            Summary:"""
            
            response = openai.ChatCompletion.create(
                model=model_name,
                messages=[
                    {
                        "role": "system", 
                        "content": "You are a professional summarizer. Provide clear, concise, and accurate summaries."
                    },
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.3
            )
            
            processing_time = time.time() - start_time
            summary = response.choices[0].message.content.strip()
            
            return {
                "summary": summary,
                "model_name": f"OpenAI {model_name}",
                "processing_time": round(processing_time, 2),
                "success": True
            }
            
        except Exception as e:
            return {
                "summary": f"Error: {str(e)}",
                "model_name": f"OpenAI {model_name}",
                "processing_time": time.time() - start_time,
                "success": False,
                "error": str(e)
            }
    
    def get_available_models(self):
        """Return list of available OpenAI models"""
        return [
            {"id": "gpt-3.5-turbo", "name": "GPT-3.5 Turbo"},
            {"id": "gpt-4", "name": "GPT-4"}
        ] 