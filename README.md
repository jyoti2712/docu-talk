Docu-Talk AI

Docu-Talk AI is a web application that allows users to upload documents and either chat with an AI about the content or generate a summary of the document. Built with a modern React frontend, Node.js backend, and Supabase for database and embeddings storage, it leverages AI to provide interactive and summarized insights from uploaded files.

Features

Document Upload: Users can upload PDFs or text documents.

Chat with AI: Ask questions about your document and get context-aware answers.

Summarize Document: Generate concise summaries of uploaded documents.

Persistent State: Chat and summaries remember previous interactions even when switching between tabs.

Secure Access: JWT-based authentication for user sessions.

Tech Stack

Frontend: React.js, Tailwind CSS, React Markdown

Backend: Node.js, Express.js, Axios

Database & Embeddings: Supabase (PostgreSQL + pgvector)

Authentication: JWT tokens

AI/ML: OpenAI API (or other embeddings/chat models)

Why Supabase?

I initially tried to use PostgreSQL on PGAdmin and add the pgvector extension for storing vector embeddings. However, I couldn’t get the option to enable pgvector on my local PGAdmin instance. To simplify development and get vector embeddings working out of the box, I chose Supabase, which provides built-in support for pgvector and makes it easy to manage embeddings and documents in a cloud-hosted PostgreSQL database.

Installation

Clone the repository:

git clone https://github.com/jyoti2712/docu-talk.git
cd docu-talk-ai


Install frontend dependencies:

cd client
npm install


Install backend dependencies:

cd ../server
npm install


Create a .env file in both frontend and backend with:

Frontend .env

VITE_API_BASE_URL=http://localhost:3001


Backend .env

PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_key
COHERE_API_KEY=your_api_key

Running the App

Start the backend:

cd server
npm run dev


Start the frontend:

cd client
npm run dev


Open http://localhost:5173 in your browser.

Usage

Sign up or log in.

Upload a document.

Switch between Chat and Summarize tabs to interact with your document.

Ask questions or generate a summary — previous interactions are remembered across tabs.

Folder Structure
docu-talk-ai/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.jsx
│   │   │   ├── Summarizer.jsx
│   │   │   └── Auth.jsx
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── middleware/
|   |── db.js
│   ├── index.js
│   └── package.json
│
└── README.md

Notes

The frontend uses React Markdown v8+, which requires styling to be applied to a wrapper <div> instead of using className directly on <ReactMarkdown>.

Supabase was chosen over a local PostgreSQL setup because pgvector is natively supported in Supabase, while adding the extension manually on PGAdmin failed.

Future Improvements

Add support for multiple file types (DOCX, CSV, etc.).

Implement pagination for chat history.

Improve AI summarization using fine-tuned models.

Add user profile and document management.