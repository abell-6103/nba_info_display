from dotenv import load_dotenv
import os

from datetime import date, datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from callQueue import CallQueue
from standings import Standings
from games import Games
from boxscores import Boxscores
from players import searchPlayers, PlayerStats, CompareMode, InvalidComparisonException, PlayerStatsOut, PlayerCompareResult
from news import News

load_dotenv("../.env")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS").split(",")

calls_per_minute = 10
minute_length = 60
call_delay = minute_length / calls_per_minute

app = FastAPI()
call_queue = CallQueue(call_delay)
standings = Standings(call_queue)
games = Games(call_queue)
boxscores = Boxscores(call_queue)
playerStats = PlayerStats(call_queue)
news = News()

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
        date_obj = datetime.strptime(game_day, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Could not resolve date {game_day}.")
    res = games.getGamesFromDay(date_obj)
    if res is None:
        raise HTTPException(status_code=404, detail=f"Could not find games on {game_day}.")
    return res

@app.get("/boxscore/{game_id}")
async def returnBoxscore(game_id: str):
    try:
        res = boxscores.getBoxscore(game_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="game_id must be 10 numeric digits.")
    if res is None:
        raise HTTPException(status_code=404, detail=f"Could not find game with id {game_id}.")
    return res

@app.get("/search-player/{player_name}")
async def playerSearch(player_name: str):
    player_name = "".join(player_name.split())
    player_name = player_name.replace("+", " ")
    res = searchPlayers(player_name)
    return res

@app.get("/player-stats/{player_id}")
async def returnPlayerStats(player_id: int):
    try:
        res: PlayerStatsOut = playerStats.getPlayerStats(player_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid format for player_id")
    if res is None:
        raise HTTPException(status_code=404, detail=f"Could not find stats for player with id {player_id}")
    return res.model_dump()

@app.get("/news/")
async def returnNews():
    res = []
    articles = news.getNews()
    for article in articles:
        res.append(article.model_dump())
    return res

@app.get("/compare/")
async def returnCareerCompare(p1_id: int = None, p2_id: int = None,
                              mode_type: str = None, season_name: str = None):
    
    try:
        compare_mode = CompareMode(mode_type, season_name)
    except ValueError:
        raise HTTPException(status_code=400, detail="Could not derive compare mode from query")
    
    try:
        comparison: PlayerCompareResult = playerStats.comparePlayerStats(p1_id, p2_id, compare_mode)
    except InvalidComparisonException:
        raise HTTPException(status_code=400, detail="Invalid comparison")

    if comparison == None:
        raise HTTPException(status_code=404, detail="One or more players not found")
    
    return comparison.model_dump()