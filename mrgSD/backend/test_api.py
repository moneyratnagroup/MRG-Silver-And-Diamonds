import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

response = client.get("/api/v1/products/?include_inactive=true")
print("Status code:", response.status_code)
print("Response text:", response.text)
