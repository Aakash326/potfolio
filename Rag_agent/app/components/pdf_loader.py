import os
import sys
import importlib.util
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

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

logger = get_logger(__name__)

def load_pdf_files():
    try:
        logger.info("Loading PDF files...")
        loader = DirectoryLoader(DATA_PATH, glob="*.pdf", loader_cls=PyPDFLoader)
        documents = loader.load()
        logger.info("PDF files loaded successfully.")
        return documents
    except Exception as e:
        logger.error(f"Error loading PDF files: {e}")
        raise CustomException(f"Error loading PDF files: {e}")

def split_docs(documents):
    try:
        logger.info("Splitting documents into chunks...")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE,
            chunk_overlap=CHUNK_OVERLAP,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
        chunks = text_splitter.split_documents(documents)
        logger.info(f"Documents split into {len(chunks)} chunks.")
        return chunks
    except Exception as e:
        logger.error(f"Error splitting documents: {e}")
        raise CustomException(f"Error splitting documents: {e}")

if __name__ == "__main__":
    try:
        documents = load_pdf_files()
        if documents:
            chunks = split_docs(documents)
            logger.info(f"Successfully processed {len(documents)} documents into {len(chunks)} chunks.")
        else:
            logger.warning("No PDF documents found.")
    except CustomException as ce:
        logger.error(f"Custom exception occurred: {ce}")
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")
        raise CustomException(f"An unexpected error occurred: {e}")
