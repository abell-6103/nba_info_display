from dotenv import load_dotenv
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from standings import Standings

load_dotenv("../.env")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS").split(",")

app = FastAPI()
standings = Standings()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ALLOWED_ORIGINS,
    allow_methods = ["GET"],
    allow_headers = ["*"]
)

@app.get("/standings/{season_id}")
async def returnStandings(season_id: str):
    res = standings.getStandings(season_id)
    if res is None:
        raise HTTPException(status_code=404, detail=f"Season {season_id} not found.")
    return res