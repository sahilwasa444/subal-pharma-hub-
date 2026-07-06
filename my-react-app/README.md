# PharmaHub Medical RAG Implementation

This folder contains the active React + Express app and the migration path for the medical assistant.
The goal is to keep one retrieval path in the final project:

React UI -> Node controller -> safety layer -> Redis cache -> Python RAG service -> response

The current app still has a temporary Node keyword retriever, but the Python service in `rag-service/` is the
better long-term source of truth.

## What The RAG Flow Should Do

1. Accept a medical question from the React UI.
2. Validate the message in the Express controller.
3. Run emergency keyword triage before any retrieval.
4. Check Redis for a cached answer.
5. Send the question to the Python FastAPI RAG service on a cache miss.
6. Retrieve the most relevant chunks from MongoDB Atlas Vector Search.
7. Build a grounded prompt from the retrieved context.
8. Generate an answer with citations and confidence.
9. Return the response to React.
10. Render the answer, sources, confidence, and urgent-care warnings.

## FastAPI Service Layer

The Python service should be the single retrieval and generation path in the final version.

| File | Work It Does | Status |
| --- | --- | --- |
| `rag-service/app.py` | FastAPI entrypoint that exposes the chat API and health check endpoint. | Target to add |
| `rag-service/retrieval.py` | Vector search and fallback ranking over the stored medical chunks. | Keep |
| `rag-service/prompt_builder.py` | Builds the grounded prompt from the question and retrieved chunks. | Keep |
| `rag-service/embed.py` | Converts text into embeddings. | Keep |
| `rag-service/ingest.py` | Ingestion job that loads PDFs, chunks them, embeds them, and writes them to MongoDB. | Keep |
| `rag-service/config.py` | Reads MongoDB connection settings from the environment and exposes the collection. | Keep |
| `rag-service/requirements.txt` | Python dependency list for the FastAPI service and ingestion scripts. | Keep and extend with FastAPI deps |

Recommended FastAPI endpoints:

1. `POST /chat`
   - Input: `message`, optional `conversationId`, optional `locale`.
   - Output: `answer`, `citations`, `confidence`, `riskLevel`, `needsUrgentCare`, `requestId`.
2. `GET /health`
   - Returns service readiness for deployment checks and load balancers.

Recommended FastAPI request path:

1. Receive the message from Node.
2. Run retrieval against MongoDB Atlas Vector Search.
3. Rank and filter the chunks.
4. Build a grounded prompt.
5. Generate the answer.
6. Return citations and confidence metadata.

## File Map

### Frontend Files

| File | Work It Does | Status |
| --- | --- | --- |
| `frontend/src/pages/MedicalAssistant.jsx` | Chat UI for asking medical questions and showing the assistant reply. | Active |
| `frontend/src/services/api.js` | Axios client that points to the backend API base URL. | Active |
| `frontend/src/App.jsx` | Registers the `/medical-assistant` route. | Active |
| `frontend/src/components/Navbar.jsx` | Adds the Medical Assistant link to the navigation bar. | Active |

### Node Backend Files

| File | Work It Does | Status |
| --- | --- | --- |
| `backend/server.js` | Boots Express, connects MongoDB and Redis, and mounts the routes. | Active |
| `backend/routes/medicalAssistantRoutes.js` | Exposes `POST /api/medical-assistant/chat`. | Active |
| `backend/controllers/medicalAssistantController.js` | Validates input, runs safety triage, checks Redis, and returns the response payload. | Active, temporary retrieval path |
| `backend/config/redis.js` | Creates the Redis client and connection helper. | Active |
| `backend/services/rag/safety.js` | Checks urgent keywords like chest pain, stroke, seizure, and suicidal thoughts. | Active |
| `backend/services/rag/retrieval.js` | Temporary keyword-based retrieval and response composition over local medicine data. | Active, should be retired after Python wiring |
| `backend/services/rag/medicineKnowledge.js` | Small static medicine list used by the temporary retriever. | Active, should be retired after Python wiring |

### Python RAG Service Files

| File | Work It Does | Status |
| --- | --- | --- |
| `rag-service/app.py` | FastAPI API that exposes the final chat contract. | Target to add |
| `rag-service/pdf_loader.py` | Extracts text from PDF files. | Keep |
| `rag-service/chunker.py` | Splits long text into overlapping chunks. | Keep |
| `rag-service/embed.py` | Converts text into embeddings. | Keep |
| `rag-service/config.py` | Connects to MongoDB and exposes the vector collection. | Keep, but move secrets to env vars |
| `rag-service/ingest.py` | Loads PDFs, chunks them, embeds them, and stores them in MongoDB. | Keep |
| `rag-service/retrieval.py` | Performs vector search and keyword fallback ranking. | Keep |
| `rag-service/prompt_builder.py` | Builds a grounded prompt from the question and retrieved chunks. | Keep |
| `rag-service/generate_product_pdf.py` | Optional sample-data generator for the demo PDF. | Optional helper |
| `rag-service/data/product_catalog.pdf` | Sample corpus used by the current demo ingestion flow. | Keep for local testing |

### Removed As Unnecessary

| File | Why It Was Removed |
| --- | --- |
| `backend/services/safetyService.js` | Duplicate safety module; the real one is `backend/services/rag/safety.js`. |
| `rag-service/embed_basic.py` | Toy embedding prototype that is not part of the final pipeline. |
| `rag-service/data/medicines.json` | Duplicate sample medicine dataset that is not referenced by the pipeline. |
| `generate_rag_report.py` | Report-only helper used to generate an old progress report. |
| `rag-progress-report.html` | Generated report artifact, not part of the app or RAG flow. |
| `RAG_FLOW_DOCUMENTATION.md` | Superseded by this README and the medical RAG guide. |

## Current Runtime Behavior

The live assistant currently behaves like this:

1. User asks a question in `MedicalAssistant.jsx`.
2. The frontend posts to `/api/medical-assistant/chat`.
3. `medicalAssistantController.js` validates the text.
4. `safety.js` stops urgent cases immediately.
5. Redis is checked for a cached response.
6. If the cache misses, the controller calls the temporary keyword retriever in `backend/services/rag/retrieval.js`.
7. The retriever compares the question against the local medicine list in `medicineKnowledge.js`.
8. The controller returns `answer`, `citations`, `riskLevel`, and `needsUrgentCare`.

That is safe for a small demo, but it is not the final RAG architecture.

## Final Target Behavior

When the Python service is wired in, the assistant should work like this:

1. Node still handles validation, safety, Redis, and HTTP.
2. Python owns ingestion, embeddings, vector search, and prompt building.
3. The model answers only from retrieved medical context.
4. The response includes citations and a confidence score.
5. Low-confidence questions return a safe fallback instead of guessing.

## What Should Be Built Next

1. Add a Node-to-Python client, for example `backend/services/ragClient.js`.
2. Expose a Python FastAPI entrypoint, for example `rag-service/app.py`.
3. Return rich metadata from the RAG service, including sources, page numbers, and confidence.
4. Update `MedicalAssistant.jsx` to show citations, confidence, and urgent-care banners.
5. Retire `backend/services/rag/retrieval.js` and `medicineKnowledge.js` after the Python path is live.

## Deployment Flow

This is the end-to-end deployment order for the final version:

1. Prepare the medical corpus.
2. Run `rag-service/ingest.py` to chunk and embed the trusted sources.
3. Start the FastAPI service with `uvicorn`.
4. Start the Node backend, which handles safety and Redis cache.
5. Start the React frontend.
6. Verify the health endpoints and a few known medical test prompts.
7. Deploy the FastAPI service and Node backend together behind your chosen hosting setup.
8. Keep the ingestion job separate so document updates do not require a full app redeploy.

Production readiness checklist:

- `MONGO_URI` is set for both Node and Python.
- `REDIS_URL` is set for Node.
- FastAPI exposes `/health` for readiness checks.
- The UI shows citations and urgent-care warnings.
- Low-confidence questions fall back safely instead of guessing.

## Environment Notes

The current app expects these environment values:

- `MONGO_URI` for MongoDB
- `REDIS_URL` for Redis
- `PORT` for the backend

The Python RAG service should also read its database and model settings from environment variables instead of hard-coding secrets in `rag-service/config.py`.

## Development Commands

- Run the full app from `my-react-app/` with `npm run dev`.
- Run only the backend with `npm run dev:backend`.
- Run only the frontend with `npm run dev:frontend`.

## Reference Docs

- `../docs/medical-rag-guide.md` explains the intended medical RAG design.
- The root `README.md` explains how the repository is organized.
