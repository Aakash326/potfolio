#!/usr/bin/env python3

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import logging
from dotenv import load_dotenv

# Add the Rag_agent directory to Python path to import modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'Rag_agent'))

try:
    from simplified_rag import Retriver, VectorStore, LLMModel
    from app.config.config_class import Config
except ImportError as e:
    print(f"Warning: Could not import RAG components: {e}")
    print("RAG functionality will not be available")

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:8080", "http://localhost:3000"])

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global RAG components
retriever = None

def initialize_rag():
    """Initialize RAG components"""
    global retriever
    try:
        logger.info("Initializing RAG components...")
        config = Config()
        vector_store = VectorStore(config)
        llm_model = LLMModel(config)
        retriever = Retriver(vector_store, llm_model, config)
        
        # Load or create vector store
        retriever.load_vector_store()
        
        logger.info("✅ RAG components initialized successfully")
        return True
    except Exception as e:
        logger.error(f"❌ Error initializing RAG components: {e}")
        return False

@app.route('/', methods=['GET'])
def root():
    """Health check endpoint"""
    return jsonify({
        "status": "success",
        "message": "Sai Aakash Portfolio RAG API is running",
        "rag_initialized": retriever is not None
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """Chat endpoint for RAG queries"""
    try:
        data = request.get_json()
        
        if not data or 'prompt' not in data:
            return jsonify({
                "error": "Missing 'prompt' field in request"
            }), 400
        
        prompt = data['prompt']
        session_id = data.get('session_id', 'default')
        
        if retriever is None:
            return jsonify({
                "answer": "I'm sorry, but the RAG system is not initialized. Please check the server logs and ensure all dependencies are installed.",
                "session_id": session_id,
                "sources": []
            }), 503
        
        # Get response from RAG system
        try:
            answer = retriever.get_response(prompt)
        except Exception as e:
            logger.error(f"Error getting RAG response: {e}")
            answer = f"I apologize, but I encountered an error while processing your question: {str(e)}. Please try asking something else."
        
        return jsonify({
            "answer": answer,
            "session_id": session_id,
            "sources": []  # You can extend this to return source documents
        })
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({
            "error": f"Internal server error: {str(e)}"
        }), 500

@app.route('/api/status', methods=['GET'])
def status():
    """Get detailed status of the RAG system"""
    rag_status = {
        "api_running": True,
        "rag_initialized": retriever is not None,
        "model_loaded": False,
        "vector_store_loaded": False
    }
    
    if retriever:
        try:
            rag_status["model_loaded"] = hasattr(retriever, 'rag') and retriever.rag is not None and hasattr(retriever.rag, 'llm')
            rag_status["vector_store_loaded"] = hasattr(retriever, 'rag') and retriever.rag is not None and hasattr(retriever.rag, 'vector_store')
        except:
            pass
    
    return jsonify(rag_status)

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    # Initialize RAG system
    initialize_rag()
    
    # Get port from environment or default to 5001
    port = int(os.environ.get('PORT', 5001))
    host = os.environ.get('HOST', '127.0.0.1')
    
    print(f"🚀 Starting Flask server on {host}:{port}")
    print(f"📚 RAG system initialized: {retriever is not None}")
    print(f"🌐 CORS enabled for frontend on port 8080")
    
    # Run Flask app
    app.run(
        host=host,
        port=port,
        debug=True,
        use_reloader=False  # Avoid double initialization in debug mode
    )