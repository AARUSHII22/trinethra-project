# Supervisor Feedback Analyzer — Trinethra (DeepThought assignment)

Web app for **psychology interns**: paste a **supervisor feedback call transcript**, run analysis against a **local Ollama** model, and get a **structured draft** (evidence, rubric score, eight KPI rows, absence-based gaps, follow-up questions). The human reviews and edits before finalizing — the AI does not replace judgment.

Assignment artifacts live at the **repository root**:

| File | Purpose |
|------|---------|
| `context.md` | Fellow model, eight KPI definitions, supervisor bias notes |
| `rubric.json` | 1–10 rubric bands, level text, **assessment dimensions** (used for gap detection) |
| `sample-transcripts.json` | Three labeled supervisor transcripts for testing |

The backend **loads `rubric.json` and `context.md` into the LLM prompt** on every request (see `backend/prompts/transcriptPrompt.js`). The UI loads samples via `GET /api/sample-transcripts`.

---

## Setup (from zero)

**Prerequisites:** Node.js 18+, [Ollama](https://ollama.com) installed.

1. **Pull a small local model** (assignment allows any Ollama model):

   ```bash
   ollama pull llama3.2
   ```

2. **Install dependencies** (frontend + backend):

   ```bash
   npm run install-all
   ```

3. **Backend environment** (optional — defaults work for local dev):

   ```bash
   cd backend
   cp .env.example .env
   ```

4. **Start Ollama** (app or `ollama serve`). Confirm:

   ```bash
   curl http://localhost:11434/api/tags
   ```

5. **Run the app** (Express on `:5000`, Vite on `:5173`):

   ```bash
   cd ..   # repo root
   npm run dev
   ```

6. Open **http://localhost:5173** → paste a transcript (or load a sample) → **Run Analysis**.

**Health checks**

```bash
curl http://localhost:5000/api/health
curl http://localhost:11434/api/tags
```

---

## Ollama model choice

**Default: `llama3.2` (3B-class).** Rationale: runs on typical 8GB laptops, supports `format: "json"` in Ollama for structured output, and is strong enough for evidence extraction and absence-style gap instructions. Override with `OLLAMA_MODEL` in `backend/.env` (e.g. `mistral`, `phi3`).

---

## Architecture (one paragraph)

**React (Vite)** is the browser UI. It calls **Express** on port 5000 through the Vite dev proxy (`/api/*`). The **analyze** routes forward the transcript to **Ollama** at `http://localhost:11434/api/generate` with JSON mode and parse/retry logic (`backend/services/ollamaService.js`, `backend/utils/parseJson.js`). **No cloud LLM** is used in this path. Optional **lowdb** (`backend/db.json`) appends anonymous analysis rows for local history only.

---

## Design challenges (assignment “pick your battles”)

**1. One prompt vs many**  
We use **one orchestrated prompt** per transcript: rubric JSON + full `context.md` + strict output schema (evidence, score, all eight KPI rows, dimension-tagged gaps, 3–5 follow-ups). **Tradeoff:** a single call is simpler to operate and keeps latency predictable for a ~10–15 minute transcript; quality depends on JSON mode + retries. **Mitigation:** controller retries up to 3 times on parse failure; `num_predict` is raised so long JSON is not truncated.

**2. Structured output reliability**  
Ollama is called with **`format: "json"`** plus a single-object schema in the prompt. **`parseJson`** strips accidental fences and slices the outermost `{...}`. If parsing still fails, the controller **retries** the generation.

**3. Gap detection (absence reasoning)**  
Gaps are defined in the prompt as **dimensions or KPIs not substantiated** in the transcript (using `rubric.json` → `assessmentDimensions` ids), not generic “to improve” lists unless tied to missing coverage.

**4. Evidence + uncertainty in the UI**  
Copy and layout stress **draft** status (header, results banner, AICallout). **Edit & Finalize** is the explicit human step before treating output as final.

---

## What we would improve with more time

- **Clickable evidence → rubric:** link each quote to the rubric level or dimension it supports (Challenge 3 in the brief).  
- **Side-by-side diff:** locked transcript pane next to editable fields to reduce context switching.  
- **Tests:** golden-file prompts against the three `sample-transcripts.json` entries to catch schema drift.

---

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Server + configured model name |
| `GET` | `/api/sample-transcripts` | Assignment sample JSON |
| `POST` | `/api/analyze` | Body `{ "transcript": "..." }` — blocking JSON |
| `POST` | `/api/analyze/stream` | Same body — SSE stream then final `done` event |

---

## Submission reminder (assignment Part B)

Record **two videos**: (1) app demo with Ollama running, (2) code walkthrough including prompt design — and send them in the Internshala chat as required.
