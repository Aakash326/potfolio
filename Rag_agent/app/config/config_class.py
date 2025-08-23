import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    def __init__(self):
        # API Keys
        self.OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
        self.OPENAI_MODEL_NAME = "gpt-4o-mini"
        
        self.GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
        self.GEMINI_MODEL_NAME = "gemini-2.0-flash"
        
        # HuggingFace Configuration
        self.HUGGINGFACE_REPO_ID = "mistralai/Mistral-7B-Instruct-v0.3"
        self.HF_TOKEN = os.getenv("HF_TOKEN")
        
        # Groq Configuration
        self.GROQ_API_KEY = os.getenv("GROQ_API_KEY")
        
        # Database and Storage Paths
        self.DB_FAISS_PATH = "vectorstore/db_faiss"
        self.DATA_PATH = "data/"
        
        # Text Processing Configuration
        self.CHUNK_SIZE = 500
        self.CHUNK_OVERLAP = 50
        
        # Model Configuration
        self.EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
        self.DEVICE = "cpu"
        
        # Logging Configuration
        self.LOG_LEVEL = "INFO"
        self.LOG_FORMAT = "%(asctime)s - %(levelname)s - %(message)s"
        self.LOG_FILE_PATH = "logs/"