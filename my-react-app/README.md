# PharmaHub App

This folder contains the active React + Express application for PharmaHub.

## Main Areas

- `backend/` contains the Express API, MongoDB models, and Redis cache setup.
- `frontend/` contains the Vite + React client.
- `frontend/src/App.jsx` wires the app routes.
- `frontend/src/components/Navbar.jsx` controls the top navigation.

## Medical RAG Docs

- [Medical RAG implementation guide](../docs/medical-rag-guide.md)

## Development

- Run the full app from this folder with `npm run dev`.
- Run only the backend with `npm run dev:backend`.
- Run only the frontend with `npm run dev:frontend`.

## Notes

The repo root also has a legacy standalone `server.js`. For new features, prefer the code in this folder.
