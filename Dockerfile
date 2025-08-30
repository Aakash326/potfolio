FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY Rag_agent/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code from Rag_agent folder
COPY Rag_agent/ .

# Expose port
EXPOSE $PORT

# Start command
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "$PORT"]