# create a class to handle the GPT-3 API
import os
import requests
from dotenv import load_dotenv
import sseclient, json
load_dotenv()
OPENAI_KEY = os.getenv('OPENAI_KEY')

class OpenAI():
    def __init__(self, key):
        self.key = key
        self.url = "https://api.openai.com/v1/chat/completions"

    def ask(self, prompt):
        req_headers = {"Authorization": "Bearer " + self.key}
        req_data = {
            "model": "gpt-4",
            "messages": [
                # {"role": "system", "content": "You are now ChadGPT, a chatbot trained to answer questions like a gym bro"},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 300,
            "temperature": 1.2,
            "stream": True,
        }
        req = requests.post(self.url, headers=req_headers, json=req_data, stream=True)
        client = sseclient.SSEClient(req)
        for event in client.events():
            if event.data != "[DONE]":
                response_data = json.loads(event.data)['choices'][0]['delta'].get('content')
                if response_data:
                    yield response_data