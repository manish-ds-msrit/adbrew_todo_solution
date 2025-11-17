from bson.objectid import ObjectId
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, logging, os
from pymongo import MongoClient

mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = MongoClient(mongo_uri)['test_db']

# class TodoListView(APIView):

#     def get(self, request):
#         # Implement this method - return all todo items from db instance above.
#         return Response({}, status=status.HTTP_200_OK)
        
#     def post(self, request):
#         # Implement this method - accept a todo item in a mongo collection, persist it using db instance above.
#         return Response({}, status=status.HTTP_200_OK)

class TodoListView(APIView):

    def get(self, request):
        """
        Handle GET /todos
        - Read all todo documents from MongoDB
        - Convert _id from ObjectId to string
        - Return them as JSON list
        """
        # db is the MongoClient('...')['test_db'] defined above
        todos_collection = db["todos"]

        # Fetch all documents
        items = list(todos_collection.find())

        # ObjectId is not JSON-serializable, convert to string
        for item in items:
            item["_id"] = str(item["_id"])

        return Response(items, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Handle POST /todos
        - Expect JSON body: { "description": "something" }
        - Validate description
        - Insert into MongoDB
        - Return created document
        """
        # DRF already parses JSON into request.data
        data = request.data

        description = data.get("description")
        if not description or not description.strip():
            return Response(
                {"error": "Description is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        todos_collection = db["todos"]

        # Insert one document
        result = todos_collection.insert_one(
            {"description": description.strip()}
        )

        # Fetch the inserted document to return it
        created = todos_collection.find_one({"_id": result.inserted_id})
        created["_id"] = str(created["_id"])

        return Response(created, status=status.HTTP_201_CREATED)


