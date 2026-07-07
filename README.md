# PharmaHub

PharmaHub is a pharmacy storefront and admin dashboard built with a React frontend, an Express backend, MongoDB, and Redis.

## Main App

The actively maintained app lives in `my-react-app/`.

- `my-react-app/backend` contains the Express API
- `my-react-app/frontend` contains the React client
- `my-react-app/docker-compose.yml` wires the backend, Redis, FastAPI RAG service, and frontend for local development

## Documentation

- [Medical RAG implementation guide](docs/medical-rag-guide.md)
- [Detailed app RAG implementation map](my-react-app/README.md)

## Docker

- Start the containerized stack from `my-react-app/` with `docker compose up --build`.
- The compose file includes Redis, the slim Node backend, the FastAPI RAG service, and the static React frontend.
- See `my-react-app/README.md` for the exact service ports and environment variables.

## Notes

The root `server.js` is a legacy standalone backend. If you are adding the medical assistant, extend the code under `my-react-app/backend` instead.
