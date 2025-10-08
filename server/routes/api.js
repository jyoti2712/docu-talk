import express from 'express';
import multer from 'multer';
import PDFParser from "pdf2json";
import { pool, getEmbedding, generateText } from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js';
import pgvector from 'pgvector/pg';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Function to chunk text
const chunkText = (text, chunkSize = 300, overlap = 50) => {
  const words = text.split(/\s+/);
  const chunks = [];
  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    chunks.push(chunk);
    i += chunkSize - overlap;
  }
  return chunks;
};

// Document Upload Route
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  try {
    const { originalname, buffer, mimetype } = req.file;
    let text;

    if (mimetype === 'application/pdf') {
      // FIX: Use pdf2json to reliably parse the PDF buffer
      const pdfParser = new PDFParser(this, 1);
      
      // Promise to handle the asynchronous parsing
      const pdfText = await new Promise((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", () => {
          resolve(pdfParser.getRawTextContent());
        });
        pdfParser.parseBuffer(buffer);
      });
      text = pdfText;
    } else {
      text = buffer.toString('utf8');
    }
    
    // Sanitize text to prevent database errors
    const sanitizedText = text.replace(/\x00/g, '');

    // Insert document record
    const docResult = await pool.query(
      'INSERT INTO documents (user_id, filename, content) VALUES ($1, $2, $3) RETURNING id',
      [req.user.id, originalname, sanitizedText]
    );
    const documentId = docResult.rows[0].id;

    // Chunk, embed, and store
    const chunks = chunkText(sanitizedText);
    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk);
      await pool.query(
        'INSERT INTO document_chunks (document_id, chunk_text, embedding) VALUES ($1, $2, $3)',
        [documentId, chunk, pgvector.toSql(embedding)]
      );
    }
    res.status(201).json({ message: 'Document processed successfully!', documentId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing document.');
  }
});

// Chat Route
router.post('/chat', authMiddleware, async (req, res) => {
  const { question, documentId } = req.body;
  try {
    const questionEmbedding = await getEmbedding(question);

    const { rows: chunks } = await pool.query(
      `SELECT chunk_text FROM document_chunks WHERE document_id = $1 ORDER BY embedding <=> $2 LIMIT 5`,
      [documentId, pgvector.toSql(questionEmbedding)]
    );

    const context = chunks.map(c => c.chunk_text).join('\n---\n');
    const prompt = `Based on the following context, please answer the question. If the context doesn't provide the answer, say "I cannot find the answer in the document."\n\nContext:\n${context}\n\nQuestion: ${question}\n\nAnswer:`;

    const answer = await generateText(prompt);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating answer.');
  }
});

// Summarize Route
router.post('/summarize', authMiddleware, async (req, res) => {
    const { documentId } = req.body;
    try {
        const docResult = await pool.query('SELECT content FROM documents WHERE id = $1 AND user_id = $2', [documentId, req.user.id]);
        if (docResult.rows.length === 0) {
            return res.status(404).send('Document not found.');
        }
        const documentText = docResult.rows[0].content;
        const prompt = `Please provide a concise summary of the following document:\n\n${documentText}`;
        const summary = await generateText(prompt);
        res.json({ summary });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating summary.');
    }
});

export default router;