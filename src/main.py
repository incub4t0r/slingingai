import uvicorn
from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.responses import HTMLResponse, FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import os
from pathlib import Path
from dotenv import load_dotenv
from gptapi import OpenAI

load_dotenv()

ROOT = os.path.dirname(os.path.abspath(__file__))
BASE_PATH = Path(__file__).resolve().parent
OPENAI_KEY = os.getenv('OPENAI_KEY')

slingingai = OpenAI(OPENAI_KEY)

app = FastAPI()
app.mount("/static", StaticFiles(directory=str(os.path.join(ROOT, "static"))), name="static")
app.mount("/javascript", StaticFiles(directory=str(os.path.join(ROOT, "javascript"))), name="javascript")
templates = Jinja2Templates(directory="templates")

class User_Prompt(BaseModel):
    prompt: str

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("main.html", {"request": request})

@app.get("/redesign", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("redesign.html", {"request": request})

@app.post("/api/prompt")
async def prompt(user_prompt: User_Prompt):
    request_prompt = user_prompt.prompt.rstrip()
    # filter the prompt to remove any characters that might break the API, anc cause XSS
    request_prompt = request_prompt.replace("<", "&lt;").replace(">", "&gt;")
    return StreamingResponse(slingingai.ask(request_prompt), media_type="text/event-stream")

@app.get("/favicon.ico")
def favicon():
    return FileResponse(os.path.join(BASE_PATH, "static", "favicon.ico"))

if __name__ == "__main__":
    uvicorn.run(app, host='0.0.0.0', port=5005)

