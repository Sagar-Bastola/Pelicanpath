from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.config import get_settings
from app.routes import decode, chat, risk, plan, tops, scholarships

logging.basicConfig(level=logging.INFO)
settings = get_settings()
settings.setup_gcp()

app = FastAPI(title="PelicanPath API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(decode.router,       prefix="/api")
app.include_router(chat.router,         prefix="/api")
app.include_router(risk.router,         prefix="/api")
app.include_router(plan.router,         prefix="/api")
app.include_router(tops.router,         prefix="/api")
app.include_router(scholarships.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}