FROM python:3.10-slim

# Install system dependencies (Java, C++, Node.js) needed for Code Execution
RUN apt-get update && apt-get install -y \
    g++ \
    default-jdk \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy python requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend files
COPY . .

# Expose the port (Render will inject the PORT environment variable)
EXPOSE 8000

# Run FastAPI using uvicorn. We use the shell form so ${PORT} expands correctly.
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
