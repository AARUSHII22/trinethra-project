# Trinethra — Supervisor Feedback Analyzer

Web app for **DeepThought-style supervisor transcripts**: paste a call transcript, run analysis with **local [Ollama](https://ollama.com)** only (no OpenAI / Anthropic / Groq). The backend injects **`rubric.json`** and **`context.txt`** into the prompt and returns structured JSON (evidence, 1–10 score, eight KPI rows, gap dimensions, follow-up questions).

## Prerequisites

- **Node.js** 18+
- **Ollama** installed and running ([download](https://ollama.com))
- At least **~8 GB RAM** for small models

## Quick start

1. **Pull a model** (pick one; must match `OLLAMA_MODEL` in `backend/.env`):

   ```bash
   ollama pull llama3.2
   ```

   For slower machines: `ollama pull llama3.2:1b`

2. **Install dependencies**:

   ```bash
   npm run install-all
   ```

3. **Backend env** (optional — defaults work):

   ```bash
   cd backend
   cp .env.example .env
   ```

   Edit `OLLAMA_MODEL` to match `ollama list` (e.g. `llama3.2`, `llama3.2:latest`, `llama3.2:1b`).

4. **Optional frontend label** — repo root `.env`:

   ```env
   VITE_OLLAMA_MODEL=llama3.2
   ```

   Used only for UI copy on the loading screen.

5. **Run** (starts Express `:5000` + Vite `:5173`):

   ```bash
   npm run dev
   ```

6. Open **http://localhost:5173** — load a sample from the sidebar or paste a transcript → **Run analysis**.

## Verify Ollama

```bash
curl http://localhost:11434/api/tags
curl http://localhost:5000/api/health
```

`/api/health` checks that Ollama is reachable and that `OLLAMA_MODEL` exists in `ollama list`.

## Architecture

**React (Vite)** talks to **Express** on port 5000 via the dev proxy (`/api/*`). The analyze route calls **Ollama** at `OLLAMA_URL` (default `http://localhost:11434/api/generate`) with `format: "json"`, then parses the response (`backend/utils/parseJson.js`). Assignment text lives at the repo root: **`rubric.json`**, **`context.txt`**, **`sample-transcripts.json`**. Optional history is appended to **`backend/db.json`** (lowdb).

## Which model and why

Default **`llama3.2`** (or **`llama3.2:1b`** on weak CPUs): small enough for laptops, supports JSON mode in Ollama, and fits the assignment’s “local only” rule. Override with `OLLAMA_MODEL` in `backend/.env`.

## Design choices (assignment brief)

1. **One prompt vs many** — One orchestrated prompt (rubric + context + strict JSON schema) per transcript for predictable latency; controller retries on JSON parse failure.
2. **Structured output** — Ollama `format: "json"` plus `parseJson` fence-stripping and `{…}` extraction.

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Backend + Ollama model probe |
| `GET` | `/api/sample-transcripts` | Three bundled sample transcripts |
| `POST` | `/api/analyze` | Body `{ "transcript": "..." }` — blocking JSON |
| `POST` | `/api/analyze/stream` | SSE stream (optional; UI uses blocking analyze) |

## Troubleshooting

- **ECONNREFUSED** — Start Ollama (app or `ollama serve`).
- **404 / unknown model** — `ollama pull <OLLAMA_MODEL>` and match `ollama list` exactly.
- **Slow first run** — Model load can take 1–2 minutes; later requests are faster.

## License / use

Built for internship / assignment demonstration. Adjust as needed for your org.
