from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import asyncio
import concurrent.futures
from threading import Thread
import time

# Load environment variables
load_dotenv()

# Import model handlers
from models.openai_model import OpenAIModel
from models.gemini_model import GeminiModel
from models.huggingface_models import HuggingFaceModels
from sample_texts import get_sample_texts, get_sample_by_id

app = Flask(__name__)
CORS(app)

# Initialize model handlers
openai_model = OpenAIModel()
gemini_model = GeminiModel()
hf_models = HuggingFaceModels()

def get_model_handler(model_id):
    """Get the appropriate model handler based on model ID"""
    if model_id.startswith("gpt"):
        return openai_model
    elif model_id.startswith("gemini"):
        return gemini_model
    elif model_id.startswith("facebook/") or model_id.startswith("google/"):
        return hf_models
    else:
        raise ValueError(f"Unknown model: {model_id}")

def summarize_with_model(text, model_id):
    """Helper function to summarize text with a specific model"""
    try:
        handler = get_model_handler(model_id)
        return handler.summarize(text, model_id)
    except Exception as e:
        return {
            "summary": f"Error: {str(e)}",
            "model_name": model_id,
            "processing_time": 0,
            "success": False,
            "error": str(e)
        }

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "LLM Battle API is running"})

@app.route('/api/models', methods=['GET'])
def get_available_models():
    """Get all available models organized by type"""
    try:
        models = {
            "closed_source": [],
            "open_source": []
        }
        
        # Add OpenAI models
        models["closed_source"].extend(openai_model.get_available_models())
        
        # Add Gemini models
        models["closed_source"].extend(gemini_model.get_available_models())
        
        # Add HuggingFace models
        models["open_source"].extend(hf_models.get_available_models())
        
        return jsonify(models)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sample-texts', methods=['GET'])
def get_sample_texts_endpoint():
    """Get all sample texts"""
    try:
        return jsonify(get_sample_texts())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sample-texts/<int:text_id>', methods=['GET'])
def get_sample_text_by_id(text_id):
    """Get a specific sample text by ID"""
    try:
        sample = get_sample_by_id(text_id)
        if sample:
            return jsonify(sample)
        else:
            return jsonify({"error": "Sample text not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/summarize', methods=['POST'])
def summarize_text():
    """Main endpoint to summarize text with two models"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'text' not in data or 'model1' not in data or 'model2' not in data:
            return jsonify({
                "error": "Missing required fields: text, model1, model2"
            }), 400
        
        text = data['text'].strip()
        model1_id = data['model1']
        model2_id = data['model2']
        
        # Validate text length
        if len(text) < 50:
            return jsonify({
                "error": "Text is too short. Please provide at least 50 characters."
            }), 400
        
        if len(text) > 10000:
            return jsonify({
                "error": "Text is too long. Please limit to 10,000 characters."
            }), 400
        
        # Use ThreadPoolExecutor to run both models in parallel
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
            # Submit both summarization tasks
            future1 = executor.submit(summarize_with_model, text, model1_id)
            future2 = executor.submit(summarize_with_model, text, model2_id)
            
            # Get results
            result1 = future1.result()
            result2 = future2.result()
        
        # Prepare response
        response = {
            "model1": result1,
            "model2": result2,
            "text_length": len(text),
            "word_count": len(text.split()),
            "timestamp": int(time.time())
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({
            "error": f"Summarization failed: {str(e)}"
        }), 500

@app.route('/api/clear-cache', methods=['POST'])
def clear_model_cache():
    """Clear HuggingFace model cache to free memory"""
    try:
        hf_models.clear_model_cache()
        return jsonify({"message": "Model cache cleared successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    # Check environment variables
    if not os.getenv('OPENAI_API_KEY'):
        print("⚠️  Warning: OPENAI_API_KEY not found in environment variables")
    
    if not os.getenv('GEMINI_API_KEY'):
        print("⚠️  Warning: GEMINI_API_KEY not found in environment variables")
    
    print("🚀 Starting LLM Battle API...")
    print("📚 Available endpoints:")
    print("   GET  /api/health - Health check")
    print("   GET  /api/models - Get available models")
    print("   GET  /api/sample-texts - Get sample texts")
    print("   POST /api/summarize - Compare summaries")
    print("   POST /api/clear-cache - Clear model cache")
    print()
    
    app.run(debug=True, host='0.0.0.0', port=5001) 