import requests
import json

data = {
    "code": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello\");\n    }\n}",
    "language": "java"
}

try:
    response = requests.post("http://localhost:8000/api/execute", json=data)
    print("Status:", response.status_code)
    print("Response:", response.text)
except Exception as e:
    print("Error:", e)
