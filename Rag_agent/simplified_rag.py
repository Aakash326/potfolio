import os
import sys
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate

# Load environment variables
load_dotenv()

class SimpleRAG:
    def __init__(self):
        self.embeddings = None
        self.vector_store = None
        self.llm = None
        self.qa_chain = None
        self.setup()
    
    def setup(self):
        try:
            # Initialize embeddings
            self.embeddings = HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            )
            
            # Load vector store if exists
            vectorstore_path = os.path.join(os.path.dirname(__file__), "vectorstore", "db_faiss")
            if os.path.exists(vectorstore_path):
                self.vector_store = FAISS.load_local(
                    vectorstore_path, 
                    self.embeddings,
                    allow_dangerous_deserialization=True
                )
                print("✅ Vector store loaded successfully")
            else:
                print("❌ Vector store not found. Please create it first.")
                return
            
            # Initialize LLM - try Gemini first, then Groq
            gemini_api_key = os.getenv("GEMINI_API_KEY")
            groq_api_key = os.getenv("GROQ_API_KEY")
            
            if gemini_api_key and gemini_api_key != "your_gemini_api_key_here":
                from langchain_google_genai import ChatGoogleGenerativeAI
                self.llm = ChatGoogleGenerativeAI(
                    model="gemini-1.5-flash",
                    google_api_key=gemini_api_key,
                    temperature=0.7
                )
                print("✅ Gemini LLM initialized successfully")
            elif groq_api_key and groq_api_key != "your_groq_api_key_here":
                self.llm = ChatGroq(
                    api_key=groq_api_key,
                    model="llama-3.1-70b-versatile",
                    temperature=0.7
                )
                print("✅ Groq LLM initialized successfully")
            else:
                print("❌ No valid API key found for LLM")
                return
            
            # Create custom prompt for Aakash's personal assistant
            custom_prompt = """You are Aakash's personal AI assistant. You have comprehensive knowledge about Sai Aakash - his experience, projects, skills, education, and achievements.

Your role:
- Answer questions about Aakash's professional background, projects, skills, education, work experience, and achievements
- Provide detailed information about his AI/ML projects, especially RAG agents, LLMOps, and Agentic AI work
- Share his contact information and links when relevant
- Highlight his expertise in Python, AI/ML, LangChain, RAG systems, and MLOps

Important guidelines:
- ONLY answer questions about Aakash/Sai Aakash
- If asked about other people or unrelated topics, politely redirect: "I can only provide information about Aakash. Please ask me about his projects, skills, experience, or achievements."
- Be enthusiastic and professional when describing his work
- Always base your answers on the provided context

Context: {context}
Question: {question}

Answer:"""
            
            # Create QA chain
            self.qa_chain = RetrievalQA.from_chain_type(
                llm=self.llm,
                chain_type="stuff",
                retriever=self.vector_store.as_retriever(search_kwargs={"k": 3}),
                return_source_documents=True,
                chain_type_kwargs={
                    "prompt": PromptTemplate.from_template(custom_prompt)
                }
            )
            print("✅ QA chain created successfully")
            
        except Exception as e:
            print(f"❌ Error setting up RAG: {e}")
            raise
    
    def get_response(self, question: str) -> str:
        if not self.qa_chain:
            return "RAG system not initialized properly. Please check your configuration."
        
        try:
            result = self.qa_chain.invoke({"query": question})
            return result["result"]
        except Exception as e:
            print(f"Error getting response: {e}")
            return f"Sorry, I encountered an error processing your question: {str(e)}"

# For backward compatibility
class Retriver:
    def __init__(self, vector_store=None, llm_model=None, config=None):
        self.rag = SimpleRAG()
    
    def load_vector_store(self):
        # Already handled in SimpleRAG setup
        pass
    
    def get_response(self, question: str) -> str:
        return self.rag.get_response(question)

class VectorStore:
    def __init__(self, config=None):
        pass

class LLMModel:
    def __init__(self, config=None):
        pass