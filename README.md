# GrowEasy AI-Powered CSV Import Pipeline

An AI-powered CRM CSV import pipeline that uploads customer data, validates and enriches it using Google's Gemini AI, and displays CRM-ready records.

## Live Demo

### Frontend
https://groweasy-ai-csv-importer-theta.vercel.app

### Backend API
https://groweasy-ai-csv-importer-backend-7a81.onrender.com

### Health Check
https://groweasy-ai-csv-importer-backend-7a81.onrender.com/health

---

## GitHub Repository

https://github.com/Alanatk/groweasy-ai-csv-importer

---

# Features

- Upload CSV files
- AI-powered data enrichment using Google Gemini
- CRM data validation
- Skip invalid records
- Display imported CRM records
- Import statistics
- Responsive user interface
- REST API backend
- Cloud deployment using Render and Vercel

---

# Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Backend

- Node.js
- Express.js
- TypeScript
- Axios
- Multer
- CSV Parser

## AI

- Google Gemini API

## Deployment

- Vercel (Frontend)
- Render (Backend)

---

# Project Structure

```
groweasy-ai-csv-importer
│
├── frontend
│   ├── app
│   ├── components
│   ├── lib
│   └── public
│
├── backend
│   ├── src
│   ├── storage
│   ├── package.json
│   └── tsconfig.json
│
└── docker-compose.yml
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Alanatk/groweasy-ai-csv-importer.git

cd groweasy-ai-csv-importer
```

---

# Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file.

Example:

```env
GEMINI_API_KEY=YOUR_API_KEY
PORT=5000
CLIENT_URL=http://localhost:3000
GEMINI_MODEL=gemini-2.5-flash
BATCH_SIZE=10
```

Run backend

```bash
npm run dev
```

---

# Frontend Setup

```bash
cd frontend

npm install
```

Create `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run frontend

```bash
npm run dev
```

---

# Build

Backend

```bash
npm run build
npm start
```

Frontend

```bash
npm run build
npm start
```

---

# API Endpoints

## Health Check

```
GET /health
```

Response

```json
{
  "ok": true
}
```

---

## Upload CSV

```
POST /upload
```

---

## Process CSV

```
POST /process
```

Returns

```json
{
  "importedCount": 10,
  "skippedCount": 0,
  "records": []
}
```

---

# Sample Output

```
Imported Count : 10

Skipped Count : 0

Final Records : 10
```

The processed CRM records are displayed in a responsive table.

---

# Deployment

## Frontend

Hosted on Vercel

## Backend

Hosted on Render

---

# Environment Variables

Backend

```env
GEMINI_API_KEY=
PORT=
CLIENT_URL=
GEMINI_MODEL=
BATCH_SIZE=
```

Frontend

```env
NEXT_PUBLIC_API_URL=
```

---

# Author

**Alan Thomas**

GitHub

https://github.com/Alanatk

---

# License

This project is developed as part of the GrowEasy AI CSV Import Assignment.
