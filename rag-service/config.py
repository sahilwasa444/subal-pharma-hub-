import os

from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise RuntimeError("Set MONGO_URI before running the rag-service scripts.")

client = MongoClient(MONGO_URI)
db = client["pharmahub"]
medicine_collection = db["medicine_vectors"]


if __name__ == "__main__":
    print(db.list_collection_names())
