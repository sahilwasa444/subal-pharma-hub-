from pymongo import MongoClient

MONGO_URI = "mongodb+srv://sahil:shruti@cluster0.pikz6bf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(MONGO_URI)
db = client["pharmahub"]
medicine_collection = db["medicine_vectors"]


if __name__ == "__main__":
    print(db.list_collection_names())
