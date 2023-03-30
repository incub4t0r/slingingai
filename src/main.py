import uvicorn
from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.responses import HTMLResponse, FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import os
from pathlib import Path

from dotenv import load_dotenv

import requests

load_dotenv()

ROOT = os.path.dirname(os.path.abspath(__file__))
BASE_PATH = Path(__file__).resolve().parent
OPENAI_KEY = os.getenv('OPENAI_KEY')

app = FastAPI()
app.mount("/static", StaticFiles(directory=str(os.path.join(ROOT, "static"))), name="static")
app.mount("/javascript", StaticFiles(directory=str(os.path.join(ROOT, "javascript"))), name="javascript")
templates = Jinja2Templates(directory="templates")

class User_Prompt(BaseModel):
    prompt: str


def openai_api_request(user_prompt):
    # create a post request
    data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": user_prompt}],
        "max_tokens": 1000,
        "temperature": 1.2,
        }
    headers = {
        "Authorization": "Bearer " + OPENAI_KEY,
        "Content-Type": "application/json"
    }
    completion = requests.post(
        "https://api.openai.com/v1/chat/completions",
        json=data,
        headers=headers
    )
    # print(completion.text)
    try:
        openai_response = completion.json()['choices'][0]['message']['content']
        # print(openai_response)
    except Exception as e:
        openai_response = f"Something went wrong. Please try again. {e}"
    return openai_response

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("main.html", {"request": request})

@app.post("/api/prompt")
async def prompt(user_prompt: User_Prompt):
    request_prompt = user_prompt.prompt.rstrip()
    # print(request_prompt)
    # openai_response = openai_api_request(request_prompt)
    # return {"openai_response": openai_response}
    req_url = "https://api.openai.com/v1/chat/completions"
    req_headers = {
        "Accept": "text/event-stream",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPENAI_KEY,
    }

    req_data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": request_prompt}],
        "max_tokens": 1000,
        "temperature": 1.2,
        "stream": True,
    }
    req = requests.post(req_url, headers=req_headers, json=req_data, stream=True)
    client = sseclient.SSEClient(req)

    def stream_response():
        for event in client.events():
            if event.data != "[DONE]":
                response_data = json.loads(event.data)['choices'][0]['delta'].get('content')
                if response_data:
                    yield response_data

    return StreamingResponse(stream_response(), media_type="application/octet-stream")

@app.get("/favicon.ico")
def favicon():
    return FileResponse(os.path.join(BASE_PATH, "static", "favicon.ico"))


import sseclient, json
@app.get("/stream_data")
async def stream_data():
    user_prompt = "who is george washington"
    req_url = "https://api.openai.com/v1/chat/completions"
    req_headers = {
        "Accept": "text/event-stream",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPENAI_KEY,
    }

    req_data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": user_prompt}],
        "max_tokens": 1000,
        "temperature": 1.2,
        "stream": True,
    }

    req = requests.post(req_url, headers=req_headers, json=req_data, stream=True)
    client = sseclient.SSEClient(req)

    def stream_response():
        for event in client.events():
            if event.data != "[DONE]":
                response_data = json.loads(event.data)['choices'][0]['delta'].get('content')
                if response_data:
                    yield response_data

    return StreamingResponse(stream_response(), media_type="application/octet-stream")
    # for event in client.events():
    #     if event.data != "[DONE]":
    #         response_data = json.loads(event.data)['choices'][0]['delta'].get('content')
    #         if response_data:
    #             return {"response_data": response_data}
                # print(response_data, end="", flush=True)
                # yield response_data
    # return StreamingResponse(req.iter_content(chunk_size=1024), media_type="application/octet-stream")

    # client = sseclient.SSEClient(req)
    # for event in client.events():
    #     if event.data != "[DONE]":
    #         response_data = json.loads(event.data)['choices'][0]['delta'].get('content')
    #         if response_data:
    #             print(response_data, end="", flush=True)
    #             yield response_data


if __name__ == "__main__":
    uvicorn.run(app, host='0.0.0.0', port=5005)

