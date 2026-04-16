from pymongo import MongoClient

MONGO_URI = "mongodb+srv://court:court%40123@atlascluster.xazjxy4.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)

# Database name
db = client["court_ai"]

# Collection (like table)
collection = db["cases"]