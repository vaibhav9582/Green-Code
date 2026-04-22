# EcoCode: Sustainable Coding Platform

## Overview
EcoCode is a comprehensive platform designed to empower developers to write more energy-efficient, "green" code. The platform measures the carbon footprint of your Python scripts using CodeCarbon and provides AI-driven optimizations alongside chat support using the Mistral LLM to help reduce your code's environmental impact.

## Features
- **Real-time Carbon Profiling:** Execute Python code and measure its energy consumption and carbon emissions (gCO2eq) in real-time using `codecarbon`.
- **AI-Powered Code Optimization:** Submit your code to be refactored into a more energy-efficient version using the Mistral API (`mistral-small-2506`).
- **Green Code Chat Assistant:** Talk to an AI assistant that provides actionable insights, best practices, and guidance on sustainable computing.
- **Modern, Premium UI:** A beautiful frontend built with React, Vite, Tailwind CSS, and Framer Motion for smooth animations and a dynamic user experience.

## Tech Stack

### Frontend
- **React 19**
- **Vite**
- **Tailwind CSS v4**
- **Framer Motion** (for animations)
- **React Router DOM**
- **Axios**
- **Lucide React** (for icons)
- **React Syntax Highlighter**

### Backend
- **FastAPI**
- **Uvicorn**
- **CodeCarbon** (for emissions tracking)
- **MistralAI** (for AI LLM support)
- **Pydantic**
- **Python-dotenv**

## Project Structure
```text
Green Code/
├── backend/                  # FastAPI Python Server
│   ├── main.py               # Main API application 
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables (MISTRAL_API_KEY)
└── frontend/                 # React Web Application
    ├── src/                  # React source code components and pages
    ├── package.json          # Node dependencies
    └── vite.config.js        # Vite configuration
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.8+)
- Mistral API Key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   
   # Windows
   .\venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your environment variables by creating a `.env` file in the `backend` directory:
   ```env
   MISTRAL_API_KEY=your_mistral_api_key_here
   ```
5. Run the FastAPI server:
   ```bash
   python -m uvicorn main:app --reload
   ```
   The backend will be available at `http://127.0.0.1:8000`. API documentation is automatically generated and accessible at `http://127.0.0.1:8000/docs`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

## Usage
1. Open the frontend application in your browser (`http://localhost:5173`).
2. Write or paste your Python code into the editor.
3. Click **"Run Code"** to execute it on the backend and view the actual carbon emissions and standard output.
4. Click **"Optimize Code"** to have the AI suggest a greener, more CPU/memory-efficient version of your code.
5. Use the **Chat feature** to ask questions about sustainable software engineering and green coding practices.

## Deployment

The platform is designed to be deployed with the **Frontend on Vercel** and the **Backend on Render**.

### Backend (Render)
1. Push your code to a GitHub repository.
2. Go to [Render](https://render.com) and create a new **Web Service**.
3. Connect your repository. Render will automatically detect the `render.yaml` blueprint.
4. If not using the blueprint, select `Docker` as the environment and set the root directory to `backend`.
5. Add your `MISTRAL_API_KEY` as an environment variable in the Render dashboard.
6. Once deployed, copy your Render Web Service URL (e.g., `https://ecocode-backend.onrender.com`).

### Frontend (Vercel)
1. Go to [Vercel](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository. Vercel will automatically use the `vercel.json` configuration.
3. In the **Environment Variables** section, add:
   - `VITE_API_URL`: Set this to your Render backend URL (e.g., `https://ecocode-backend.onrender.com`).
   - If using Clerk for auth, add `VITE_CLERK_PUBLISHABLE_KEY`.
4. Click **Deploy**.
