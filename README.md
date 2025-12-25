# Ollama ChromaDB Experiment

This repository contains an experimental Node.js application that demonstrates the integration of Ollama's local language model embeddings with ChromaDB, a vector database, to perform semantic search on text documents.

## Features

- **Document Embedding**: Automatically embeds text files from the `data/` directory using Ollama's embedding models.
- **Vector Storage**: Stores embeddings in ChromaDB for efficient retrieval.
- **Semantic Search**: Allows querying the embedded documents with natural language to find semantically similar content.

## Prerequisites

- Node.js
- [Ollama](https://ollama.ai/) running locally (with an embedding model like `embeddinggemma:latest`)
- Docker (for running ChromaDB)

## Ollama Setup

1. **Install Ollama**: Follow the installation instructions at [ollama.ai](https://ollama.ai/download).
2. **Pull the embedding model**:
   ```bash
   ollama pull embeddinggemma:latest
   ```
3. **Start Ollama** (if not running automatically):
   ```bash
   ollama serve
   ```

## Setup

1. **Start ChromaDB**:
   ```bash
   docker-compose -f chromadb-docker-compose.yml up -d
   ```
   This will create a local `chroma_db/` folder in your project directory to persist the database data.

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file with:
   ```
   OLLAMA_URL=http://localhost:11434/api/embeddings
   CHROMA_URL=http://localhost:8000
   MODEL=embeddinggemma:latest
   AUTH_TOKEN=  # optional, if your Ollama instance requires auth
   ```

4. **Run Ollama**:
   Ensure Ollama is running with the specified embedding model.

## Usage

- **Embed documents**:
  ```bash
  npm start embed
  ```

- **Search documents**:
  ```bash
  npm start search "your query here"
  ```

## Project Structure

- `index.js`: Main application script
- `data/`: Directory containing sample text files for embedding
- `chroma_db/`: Local directory created by Docker to persist ChromaDB data (gitignored)
- `chromadb-docker-compose.yml`: Docker Compose configuration for ChromaDB
- `curl-example.text`: Example curl command for Ollama API

This is an experimental project to explore the capabilities of combining local LLMs with vector databases for document retrieval tasks.
