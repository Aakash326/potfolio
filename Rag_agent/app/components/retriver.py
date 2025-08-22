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
else:
    # Fallback if import fails
    GEMINI_API_KEY = None

# Add the project root to Python path for other imports
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from langchain.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate

from llm import load_llm
from vector_store import load_db_faiss

from app.common.logger import get_logger
from app.common.custom_exception import CustomException
from langchain.memory import (
    ConversationBufferWindowMemory
)
logger= get_logger(__name__)

custom_prompt = """You are a helpful assistant. Answer the question based on the context provided below.
If the question is not related to the context, respond with "I don't know".
Context: {context}
Question: {question}
Answer:"""
def load_memory():
    try:
        logger.info("Loading LLM and vector store...")
        memory=ConversationBufferWindowMemory(
            memory_key="chat_history",
            k=5,
            return_messages=True
        )
        return memory
    except Exception as e:
        logger.error(f"Error loading memory: {e}")
        raise CustomException(f"Error loading memory: {e}")
def qa_chain():
    try:
        logger.info("loading LLM and vector store...")
        llm=load_llm()
        vector_store=load_db_faiss()
        if not vector_store:
            logger.error("Vector store not found. Please load the PDF data first.")
            raise CustomException("Vector store not found. Please load the PDF data first.")
        logger.info("LLM and vector store loaded successfully.")
        qa_chain=RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vector_store.as_retriever(),
            return_source_documents=True,
            chain_type_kwargs={
                "prompt": PromptTemplate.from_template(custom_prompt)
            },
            memory=load_memory()
        )
        logger.info("QA chain created successfully.")
        return qa_chain 
    except Exception as e:
        logger.error(f"Error creating QA chain: {e}")
        raise CustomException(f"Error creating QA chain: {e}")
if __name__ == "__main__":
    try:
        qa_chain_instance = qa_chain()
        logger.info("QA chain instance created successfully.")
    except CustomException as ce:
        logger.error(f"Custom exception occurred: {ce}")
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")
        raise CustomException(f"An unexpected error occurred: {e}")