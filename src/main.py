import uvicorn
from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.responses import HTMLResponse, FileResponse
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
        "max_tokens": 100,
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
    try:
        openai_response = completion.json()['choices'][0]['message']['content']
        print(openai_response)
    except:
        openai_response = "Something went wrong. Please try again."
    return openai_response

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("main.html", {"request": request})

@app.post("/api/prompt")
def prompt(user_prompt: User_Prompt, request: Request):
    request_prompt = user_prompt.prompt.rstrip()
    print(request_prompt)
    openai_response = openai_api_request(request_prompt)
    print(openai_response)
    # print(user_prompt.prompt)
    return {"openai_response": openai_response}


if __name__ == "__main__":
    uvicorn.run(app, host='0.0.0.0', port=5005)
