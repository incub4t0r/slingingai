import uvicorn
from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import os
from pathlib import Path

import os
from dotenv import load_dotenv

load_dotenv()

ROOT = os.path.dirname(os.path.abspath(__file__))
OPENAI_KEY = os.getenv('OPENAI_KEY')

app = FastAPI()
# app.mount("/static", StaticFiles(directory="static"), name="static")
# app.mount("/javascript", StaticFiles(directory="javascript"), name="javascript")
templates = Jinja2Templates(directory="templates")

class User_Prompt(BaseModel):
    prompt: str

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("templates/index.html", {"request": request})


if __name__ == "__main__":
    uvicorn.run(app, host='0.0.0.0', port=5005)