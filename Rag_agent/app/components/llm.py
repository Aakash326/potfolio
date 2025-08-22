import os
import sys
import importlib.util

# Import config module from the correct location
config_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'config', 'config.py')
spec = importlib.util.spec_from_file_location("config", config_path)
if spec and spec.loader:
    config = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(config)
    GEMINI_API_KEY = config.GEMINI_API_KEY
    GEMINI_MODEL_NAME = config.GEMINI_MODEL_NAME
else:
    # Fallback if import fails
    GEMINI_API_KEY = None
    GEMINI_MODEL_NAME = "gemini-2.0-flash-exp"

# Add the project root to Python path for other imports
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from langchain_google_genai import ChatGoogleGenerativeAI
from app.common.logger import get_logger
from app.common.custom_exception import CustomException

logger = get_logger(__name__)

def load_llm(model_name=GEMINI_MODEL_NAME, api_key=GEMINI_API_KEY):
    try:
        logger.info(f"Initializing Gemini LLM with model: {model_name}")
        llm_instance = ChatGoogleGenerativeAI(
            model=model_name,
            google_api_key=api_key,
            temperature=0.7,
            convert_system_message_to_human=True
        )
        logger.info("Gemini LLM initialized successfully.")
        return llm_instance
    except Exception as e:
        logger.error(f"Error initializing Gemini LLM: {e}")
        raise CustomException(f"Error initializing Gemini LLM: {e}")
