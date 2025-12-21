from dotenv import load_dotenv
import os

from datetime import date, datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from callQueue import CallQueue
from standings import Standings
from games import Games

load_dotenv("../.env")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS").split(",")

calls_per_minute = 10
minute_length = 60
call_delay = minute_length / calls_per_minute

app = FastAPI()
call_queue = CallQueue(call_delay)
standings = Standings(call_queue)
games = Games(call_queue)

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

@app.get("/games/{game_day}")
async def returnGames(game_day: str):
    try:
        date_obj = datetime.strptime(game_day, "%m/%d/%Y").date()
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Could not resolve date {game_day}.")
    res = games.getGamesFromDay(date_obj)
    if res is None:
        raise HTTPException(status_code=404, detail=f"Could not find games on {game_day}.")
    return res