const axios = require('axios');
const { ChromaClient } = require('chromadb');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const readline = require('readline');
require('dotenv').config({ quiet: true });

const OLLAMA_URL = process.env.OLLAMA_URL;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const MODEL = process.env.MODEL;

async function getEmbedding(text) {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (AUTH_TOKEN) {
      headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
    }
    const response = await axios.post(OLLAMA_URL, {
      model: MODEL,
      input: text
    }, {
      headers
    });
    return response.data.embeddings[0];
  } catch (error) {
    console.error('Error getting embedding:', error.message);
    return null;
  }
}

async function embedFiles() {
  const client = new ChromaClient({ path: process.env.CHROMA_URL });
  const collection = await client.getOrCreateCollection({ name: 'documents' });

  const files = glob.sync('./data/**/*.txt');
  console.log(`Found ${files.length} files to embed.`);

  for (const file of files) {
    console.log(`Processing ${file}...`);
    const content = fs.readFileSync(file, 'utf8');
    const embedding = await getEmbedding(content);
    if (embedding) {
      await collection.add({
        ids: [path.basename(file, '.txt')],
        embeddings: [embedding],
        metadatas: [{ filename: file }],
        documents: [content]
      });
      console.log(`Embedded and stored ${file}`);
    } else {
      console.log(`Failed to embed ${file}`);
    }
  }
  console.log('All files processed.');
}

async function search(query) {
  const client = new ChromaClient({ path: process.env.CHROMA_URL });
  const collection = await client.getOrCreateCollection({ name: 'documents' });

  const queryEmbedding = await getEmbedding(query);
  if (!queryEmbedding) {
    console.log('Failed to get embedding for query.');
    return;
  }

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: 5
  });

  console.log('Search results:');
  results.ids[0].forEach((id, index) => {
    console.log(`- ${id}: ${results.documents[0][index].substring(0, 100)}...`);
  });
}

async function main() {
  const args = process.argv.slice(2);
  if (args[0] === 'embed') {
    await embedFiles();
  } else if (args[0] === 'search') {
    const query = args.slice(1).join(' ');
    if (!query) {
      console.log('Please provide a search query.');
      return;
    }
    await search(query);
  } else {
    console.log('Usage: node index.js embed  or  node index.js search <query>');
  }
}

main();