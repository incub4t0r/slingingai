import uvicorn
from fastapi import FastAPI, Request, BackgroundTasks, Response, Form, BackgroundTasks
from fastapi.responses import HTMLResponse, FileResponse, StreamingResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import os
from pathlib import Path
from dotenv import load_dotenv
from gptapi import OpenAI
import starlette.status as status
import schedule
import time
from weeklypasscode import get_passcode, gen_user_cookie

load_dotenv()

ROOT = os.path.dirname(os.path.abspath(__file__))
BASE_PATH = Path(__file__).resolve().parent
OPENAI_KEY = os.getenv('OPENAI_KEY')
SHARED_LOCALHOST_SECRET = os.getenv('SHARED_LOCALHOST_SECRET')

slingingai = OpenAI(OPENAI_KEY)
app = FastAPI()

app.mount("/static", StaticFiles(directory=str(os.path.join(ROOT, "static"))), name="static")
app.mount("/javascript", StaticFiles(directory=str(os.path.join(ROOT, "javascript"))), name="javascript")
templates = Jinja2Templates(directory="templates")

class User_Prompt(BaseModel):
    prompt: str

MASTER_COOKIE = ""
MASTER_PASSCODE = ""

def retrieve_passcode_set_user_coookie():
    global MASTER_COOKIE
    global MASTER_PASSCODE
    MASTER_PASSCODE = get_passcode()
    MASTER_COOKIE = gen_user_cookie(MASTER_PASSCODE)
    print("Passcode: " + MASTER_PASSCODE)
    print("Cookie: " + MASTER_COOKIE)
    return

# Schedule the passcode retrieval to run every Sunday at a specific time (e.g., 2:00 AM)
schedule.every().sunday.at("02:00").do(retrieve_passcode_set_user_coookie)

# Background task for running the scheduled job
def background_task():
    while True:
        schedule.run_pending()
        time.sleep(1)

@app.on_event("startup")
def startup_event():
    retrieve_passcode_set_user_coookie()
    background_tasks = BackgroundTasks()
    background_tasks.add_task(background_task)


def check_cookie(request: Request):
    user_cookie = request.cookies.get("user_cookie")
    if (MASTER_COOKIE == user_cookie):
        return True
    return False


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    if (check_cookie(request)):
        response = RedirectResponse(url="/main", status_code=status.HTTP_302_FOUND)  # Redirect to the main page or any other desired destination
        return response
    # context = {"request": request, "error_message": "Wrong passcode."}
    return templates.TemplateResponse("login.html", {"request": request})


@app.post("/login")
async def login(request: Request, otp: str = Form(...)):
    print(f"OTP: {otp}, MASTER_PASSCODE: {MASTER_PASSCODE}, CHECK: {otp.strip() == MASTER_PASSCODE.strip()}")
    if (MASTER_PASSCODE.strip() == otp.strip()):
        response = RedirectResponse(url="/main", status_code=status.HTTP_302_FOUND)
        response.set_cookie(key="user_cookie", value=MASTER_COOKIE, max_age=60*60*24*7, expires=60*60*24*7)
        return response
    context = {"request": request, "error_message": "Wrong passcode."}
    return templates.TemplateResponse("login.html", context)


@app.get("/main", response_class=HTMLResponse)
async def main(request: Request):
    if (check_cookie(request)):
        return templates.TemplateResponse("main.html", {"request": request})
    return RedirectResponse(url="/", status_code=status.HTTP_302_FOUND)


@app.post("/logout")
async def logout(request: Request):
    response = RedirectResponse(url="/", status_code=status.HTTP_302_FOUND)  # Redirect to the main page or any other desired destination
    response.delete_cookie("user_cookie")
    return response


@app.post("/api/prompt")
async def prompt(user_prompt: User_Prompt):
    request_prompt = user_prompt.prompt.rstrip()
    # request_prompt = request_prompt.replace("<", "&lt;").replace(">", "&gt;")
    return StreamingResponse(slingingai.ask(request_prompt), media_type="text/event-stream")


@app.get("/favicon.ico")
def favicon():
    return FileResponse(os.path.join(BASE_PATH, "static", "favicon.ico"))


@app.get("/api/passcode")
async def api_passcode(request: Request):
    if (request.headers.get("Authorization") == SHARED_LOCALHOST_SECRET):
        return {"passcode": MASTER_PASSCODE}
    return {"passcode": ""}


if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=5005)

