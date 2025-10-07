import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';

const app = express();
const port = process.env.PORT || 3001;

console.log('Loaded DATABASE_URL:', process.env.DATABASE_URL);

app.use(cors({
  origin: "https://docu-talk-5cgk.vercel.app",
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});