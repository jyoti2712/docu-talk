import pg from 'pg';
import pgvector from 'pgvector/pg';
import { CohereClient } from "cohere-ai";
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const dbUrl = new URL(process.env.DATABASE_URL);

export const pool = new Pool({
  user: dbUrl.username,
  password: decodeURIComponent(dbUrl.password),
  host: dbUrl.hostname,
  port: Number(dbUrl.port),
  database: dbUrl.pathname.slice(1),
  ssl: false,
});

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

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
  const response = await cohere.chat({ message: prompt });
  return response.text;
}

pool.on('connect', async (client) => {
  await pgvector.registerType(client);
});
