"""
MongoDB connection and CRUD operations.
Uses PyMongo. Connects to local MongoDB at mongodb://localhost:27017
"""
from typing import List, Optional
import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

MONGO_URI = "mongodb+srv://court:court%40123@atlascluster.xazjxy4.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster"
DB_NAME = "court_case_db"
COLLECTION_NAME = "cases"

_client: Optional[MongoClient] = None
_db = None
_collection = None


def get_db():
    global _client, _db, _collection
    if _client is None:
        _client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        _db = _client[DB_NAME]
        _collection = _db[COLLECTION_NAME]
    return _collection


def insert_case(case_dict: dict) -> str:
    """Insert a case document and return inserted id."""
    col = get_db()
    result = col.insert_one(case_dict)
    return str(result.inserted_id)


def get_all_cases() -> List[dict]:
    """Fetch all cases, removing MongoDB _id."""
    col = get_db()
    docs = list(col.find({}, {"_id": 0}))
    return docs


def get_cases_sorted() -> List[dict]:
    """Fetch all cases sorted by priority_score descending."""
    col = get_db()
    docs = list(col.find({}, {"_id": 0}).sort("priority_score", -1))
    return docs


def case_exists(case_id: str) -> bool:
    """Check if a case with given case_id already exists."""
    col = get_db()
    return col.count_documents({"case_id": case_id}, limit=1) > 0


def delete_case(case_id: str) -> bool:
    col = get_db()
    result = col.delete_one({"case_id": case_id})
    return result.deleted_count > 0
