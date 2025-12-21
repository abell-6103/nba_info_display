from nba_api.stats.endpoints import scoreboardv3
import pandas as pd
import numpy as np
from time import monotonic, sleep
from datetime import date, timedelta

from abc import ABC, abstractmethod

from callQueue import Call, CallQueue

class GameInterface(ABC):
  @abstractmethod
  def getGamesFromDay(self, day: date) -> dict:
    pass

  def getGamesFromRange(self, start_day: date, end_day: date) -> list:
    pass

class TeamObj:
  def __init__(self):
    self.id: int = None
    self.city: str = None
    self.score: int = None
    self.logo: str = None

  def toDict(self):
    return {
      "team_id" : self.id,
      "city" : self.city,
      "score" : self.score,
      "logo" : self.logo
    }

class GameObj:
  def __init__(self):
    self.game_id: int = None
    self.clock: str = None
    self.period: str = None
    self.status: int = None
    self.status_text: str = None
    self.home_team = TeamObj()
    self.away_team = TeamObj()

  def getPeriodStr(self):
    if (self.period <= 4):
      # Regulation
      return f'Q{self.period}'
    if (self.period == 5):
      # Initial Overtime
      return 'OT'
    # Extra Overtime
    return f'{self.period - 4}OT'

  def getStatusStr(self):
    if self.status != 2 or self.clock == "":
      return self.status_text.strip()
    return f"{self.getPeriodStr()} {self.clock}"

  def toDict(self):
    return {
      "game_id" : int(self.game_id),
      "status" : self.getStatusStr(),
      "home_team" : self.home_team.toDict(),
      "away_team" : self.away_team.toDict()
    }

class Games(GameInterface):
  def __init__(self, call_queue = CallQueue):
    super().__init__()
    self.games = {}
    self.last_access = {}
    self.call_queue = call_queue

    self.wait_time = 30

  @staticmethod
  def _buildTeamFromRow(row: pd.DataFrame) -> TeamObj:
    row = row.iloc[0]
    team = TeamObj()
    
    team.id = int(row['teamId'])
    team.city = row['teamCity']
    team.score = int(row['score'])
    team.logo = f"https://cdn.nba.com/logos/nba/{team.id}/primary/L/logo.svg"

    return team

  def getGamesFromDay(self, day: date) -> list:
    if not isinstance(day, date):
      raise TypeError("day must be of type date")

    # If already cached and its been a short time, just return it from cache
    if day in self.games.keys() and (monotonic() - self.last_access[day]) <= self.wait_time:
      return self.games[day]
    
    # Wait for our turn
    c: Call = self.call_queue.addCall()
    delay = c.ready_time - monotonic()
    if (delay > 0):
      sleep(delay)

    day_str = day.strftime('%m/%d/%Y')

    try:
      found_games = scoreboardv3.ScoreboardV3(game_date=day_str)
    except:
      return None
    self.last_access[day] = monotonic()

    headers = found_games.game_header.get_data_frame()[['gameId', 'gameStatus', 'gameStatusText', 'period', 'gameClock', 'gameCode']]
    linescores = found_games.line_score.get_data_frame()[['gameId', 'teamId', 'teamCity', 'teamTricode', 'score']]

    game_list = []
    for _, row in headers.iterrows():
      game = GameObj()

      game.game_id = row.loc['gameId']
      game.status = row.loc['gameStatus']
      game.status_text = row.loc['gameStatusText']
      game.period = row.loc['period']
      game.clock = row.loc['gameClock']

      team_codes = row.loc['gameCode'].split('/')[1]
      hometeam_code = team_codes[0:3]
      awayteam_code = team_codes[3:]
      game_linescores = linescores.loc[linescores['gameId'] == game.game_id]

      game.home_team = Games._buildTeamFromRow(game_linescores.loc[game_linescores['teamTricode'] == hometeam_code])
      game.away_team = Games._buildTeamFromRow(game_linescores.loc[game_linescores['teamTricode'] == awayteam_code])

      game_list.append(game.toDict())

    self.games[day] = game_list
    return game_list