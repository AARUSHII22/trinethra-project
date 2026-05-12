# Trinethra AI - Local Intelligence Portal

Trinethra (Sanskrit: *Three Eyes*) is a premium, AI-powered assessment platform designed for organizational psychologists and talent supervisors. It synthesizes complex interview transcripts into structured, diagnostic behavioral assessments using **Local Ollama Inference**.

---

## 🏛️ Project Architecture
Trinethra is built with a **Human-in-the-Loop** design philosophy, now fully migrated to local LLMs for data privacy and speed.

### Tech Stack
- **Frontend**: React 19 + Vite 8 + Tailwind CSS + Framer Motion.
- **Backend**: Node.js + Express.js (Beginner-friendly).
- **AI Engine**: Local Ollama running **llama3.2**.

---

## 🚀 How It Works (End-to-End)
1. **User Input**: A supervisor pastes an interview transcript into the portal.
2. **Analysis Trigger**: The frontend sends the transcript to the local Express backend.
3. **Local Inference**: The backend sends a highly structured prompt to **Ollama** (`localhost:11434`).
4. **Synthesis**: Llama 3.2 extracts scores, justification, evidence, KPIs, and gaps.
5. **Human Calibration**: The supervisor reviews and modifies the AI's findings before final submission.

---

## 🛠️ Setup & Installation

### 1. Prerequisites
- **Node.js**: Installed on your machine.
- **Ollama**: Download and install from [ollama.com](https://ollama.com).
- **Model**: Pull the required model:
  ```bash
  ollama pull llama3.2
  ```

### 2. Backend Setup
1. Open a terminal in the `/backend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (see `.env.example`).
4. Start the backend:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Open a terminal in the root folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm run client
   ```

---

## 🛡️ Key Features
- **Privacy First**: All analysis happens locally on your machine. No data is sent to external clouds.
- **Strict JSON Output**: The backend forces the AI to return data in a specific format for UI reliability.
- **Interactive UI**: Real-time feedback, smooth transitions, and editable results.
- **Structured Synthesis**: Extracts diagnostic depth, not just summaries.

---

## 📁 Folder Structure
- `/src`: React frontend (Screens, Components, Context).
- `/backend`: Node.js server.
  - `/prompts`: AI logic & instructions.
  - `/services`: Ollama API communication layer.
- `package.json`: Project dependencies and scripts.
