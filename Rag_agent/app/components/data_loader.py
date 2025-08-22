import os
import sys
import importlib.util

# Import config module from the correct location
config_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'config', 'config.py')
spec = importlib.util.spec_from_file_location("config", config_path)
if spec and spec.loader:
    config = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(config)
    DATA_PATH = config.DATA_PATH
    CHUNK_SIZE = config.CHUNK_SIZE
    CHUNK_OVERLAP = config.CHUNK_OVERLAP
else:
    # Fallback if import fails
    DATA_PATH = "data/"
    CHUNK_SIZE = 500
    CHUNK_OVERLAP = 50

# Add the project root to Python path for other imports
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from app.common.logger import get_logger
from app.common.custom_exception import CustomException    
from pdf_loader import load_pdf_files, split_docs
from vector_store import save_db_faiss, load_db_faiss, huggingface_embedding

logger = get_logger(__name__)

def load_and_save_pdf_data():
    try:
        logger.info("Loading and saving PDF data...")
        documents = load_pdf_files()
        if not documents:
            logger.warning("No PDF documents found to process.")
            return None
        text_chunks = split_docs(documents)
        if not text_chunks:
            logger.warning("No text chunks created from the documents.")
            return None
        embedding_model = huggingface_embedding()
        if not embedding_model:
            logger.error("Embedding model could not be loaded.")
            return None
        save_db_faiss(text_chunks)
        logger.info("PDF data loaded and saved successfully.")
        return True
    except Exception as e:
        logger.error(f"Error loading and saving PDF data: {e}")
        raise CustomException(f"Error loading and saving PDF data: {e}")    
    
if __name__ == "__main__":
    load_and_save_pdf_data()
