import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Load environment variables
load_dotenv()

def create_aakash_vectorstore():
    try:
        print("🔄 Creating Aakash's personal knowledge base...")
        
        # Initialize embeddings
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        print("✅ Embeddings model loaded")
        
        # Load Aakash's resume PDF
        pdf_path = "data/Rag_pdf-2.pdf"
        if not os.path.exists(pdf_path):
            print(f"❌ PDF file not found: {pdf_path}")
            return False
        
        loader = PyPDFLoader(pdf_path)
        documents = loader.load()
        print(f"✅ Loaded {len(documents)} pages from Aakash's resume")
        
        # Split the documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            length_function=len
        )
        
        # Process each document to add metadata about Aakash
        processed_docs = []
        for i, doc in enumerate(documents):
            # Add metadata to identify this is about Aakash
            doc.metadata.update({
                "source": "Aakash_Resume",
                "page": i + 1,
                "type": "personal_information",
                "person": "Sai Aakash"
            })
            processed_docs.append(doc)
        
        # Split documents
        split_docs = text_splitter.split_documents(processed_docs)
        print(f"✅ Split into {len(split_docs)} chunks")
        
        # Create vector store
        vectorstore = FAISS.from_documents(split_docs, embeddings)
        print("✅ Vector store created")
        
        # Save vector store
        vectorstore_path = "vectorstore/db_faiss"
        
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(vectorstore_path), exist_ok=True)
        
        vectorstore.save_local(vectorstore_path)
        print(f"✅ Vector store saved to {vectorstore_path}")
        
        # Test the vector store
        test_query = "What are Aakash's skills?"
        results = vectorstore.similarity_search(test_query, k=2)
        print(f"\n🧪 Test query: '{test_query}'")
        print(f"📋 Found {len(results)} relevant chunks")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating vector store: {e}")
        return False

if __name__ == "__main__":
    success = create_aakash_vectorstore()
    if success:
        print("\n🎉 Aakash's personal knowledge base created successfully!")
        print("💡 The RAG agent can now answer questions about Aakash's experience, projects, and skills.")
    else:
        print("\n💥 Failed to create vector store. Please check the errors above.")