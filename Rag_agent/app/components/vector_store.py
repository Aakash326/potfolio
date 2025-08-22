from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import os
import sys
import importlib.util

# Import config module from the correct location
config_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'config', 'config.py')
spec = importlib.util.spec_from_file_location("config", config_path)
if spec and spec.loader:
    config = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(config)
    DB_FAISS_PATH = config.DB_FAISS_PATH
else:
    # Fallback if import fails
    DB_FAISS_PATH = "vectorstore/db_faiss"

# Add the project root to Python path for other imports
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from app.common.logger import get_logger
from app.common.custom_exception import CustomException

logger = get_logger(__name__)

def huggingface_embedding():
    try:
        logger.info("Loading HuggingFace embeddings...")
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={"device": "cpu"}  # Use "cuda" for GPU
        )
        logger.info("HuggingFace embeddings loaded successfully.")
        return embeddings
    except Exception as e:
        logger.error(f"Error loading HuggingFace embeddings: {e}")
        raise CustomException(f"Error loading HuggingFace embeddings: {e}")
    
def load_db_faiss():
    try:
        logger.info("Loading FAISS database...")
        embedding_model = huggingface_embedding()
        if os.path.exists(DB_FAISS_PATH):
            logger.info("Loading existing vectorstore...")
            return FAISS.load_local(
                DB_FAISS_PATH,
                embedding_model,
                allow_dangerous_deserialization=True
            )
        else:
            logger.info("FAISS database not found, returning None.")
            return None
    except Exception as e:
        logger.error(f"Error loading FAISS database: {e}")
        raise CustomException(f"Error loading FAISS database: {e}")
    
def save_db_faiss(text_chunks):
    """
    Save the FAISS database.
    """
    try:
        logger.info("Saving FAISS database...")
        embedding_model = huggingface_embedding()
        db=FAISS.from_documents(text_chunks,embedding_model)
        db.save_local(DB_FAISS_PATH)
        logger.info("FAISS database saved successfully.")
        return db
    except Exception as e:
        logger.error(f"Error saving FAISS database: {e}")
        raise CustomException(f"Error saving FAISS database: {e}")