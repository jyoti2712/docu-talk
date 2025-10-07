import pg from 'pg';
import pgvector from 'pgvector/pg';
import { CohereClient } from "cohere-ai";

const { Pool } = pg;
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export async function getEmbedding(text) {
  const sanitizedText = text.replace(/\x00/g, '');
  const response = await cohere.embed({
    texts: [sanitizedText],
    model: "embed-english-v3.0",
    inputType: "search_document",
  });
  return response.embeddings[0];
}

export async function generateText(prompt) {
    const response = await cohere.chat({
        message: prompt,
    });
    return response.text;
}

pool.on('connect', async (client) => {
    await pgvector.registerType(client);
});