import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# API Keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL_NAME = "gpt-4o-mini"

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL_NAME = "gemini-2.0-flash"
# HuggingFace Configuration
HUGGINGFACE_REPO_ID = "mistralai/Mistral-7B-Instruct-v0.3"
HF_TOKEN = os.getenv("HF_TOKEN")

# Groq Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Database and Storage Paths
DB_FAISS_PATH = "vectorstore/db_faiss"
DATA_PATH = "data/"

# Text Processing Configuration
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50

# Model Configuration
EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
DEVICE = "cpu"  # Change to "cuda" if you have GPU support

# Logging Configuration
LOG_LEVEL = "INFO"
LOG_FORMAT = "%(asctime)s - %(levelname)s - %(message)s"
LOG_FILE_PATH = "logs/"
