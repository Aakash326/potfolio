from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import uvicorn
from typing import Optional

from simplified_rag import Retriver, VectorStore, LLMModel
from app.config.config_class import Config

load_dotenv()

app = FastAPI(
    title="Aakash Portfolio Chatbot API",
    description="A FastAPI backend for RAG-based portfolio chatbot",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    prompt: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    session_id: str
    sources: list = []

class HealthResponse(BaseModel):
    status: str
    message: str

# Initialize components
config = Config()
try:
    vector_store = VectorStore(config)
    llm_model = LLMModel(config)
    retriever = Retriver(vector_store, llm_model, config)
    
    # Load or create vector store
    retriever.load_vector_store()
    
    print("✅ RAG components initialized successfully")
except Exception as e:
    print(f"❌ Error initializing RAG components: {e}")
    retriever = None

@app.get("/", response_model=HealthResponse)
async def root():
    return HealthResponse(
        status="success",
        message="RAG Medical Chatbot API is running"
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    if retriever is None:
        raise HTTPException(status_code=503, detail="RAG components not initialized")
    
    return HealthResponse(
        status="healthy",
        message="All systems operational"
    )

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if retriever is None:
        raise HTTPException(
            status_code=503, 
            detail="RAG system not initialized. Please check your configuration."
        )
    
    try:
        # Get response from RAG system
        answer = retriever.get_response(request.prompt)
        
        # Generate or use provided session ID
        session_id = request.session_id or "default_session"
        
        return ChatResponse(
            answer=answer,
            session_id=session_id,
            sources=[]  # You can extend this to return source documents
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )

@app.get("/api/status")
async def get_status():
    return {
        "api_status": "running",
        "rag_initialized": retriever is not None and hasattr(retriever, 'rag') and retriever.rag is not None,
        "model_loaded": retriever is not None and hasattr(retriever, 'rag') and hasattr(retriever.rag, 'llm') and retriever.rag.llm is not None,
        "vector_store_loaded": retriever is not None and hasattr(retriever, 'rag') and hasattr(retriever.rag, 'vector_store') and retriever.rag.vector_store is not None
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    print(f"🚀 Starting FastAPI server on {host}:{port}")
    print(f"📚 API documentation available at http://{host}:{port}/docs")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )