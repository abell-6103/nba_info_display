from nba_api.stats.endpoints import scoreboardv3
import pandas as pd
from time import monotonic, sleep
from datetime import date, timedelta

from abc import ABC, abstractmethod

from callQueue import Call, CallQueue

class GameInterface(ABC):
  @abstractmethod
  def getGamesFromDay(self, day: date) -> dict:
    pass

  def getGamesFromRange(self, start_day: date, end_day: date) -> dict:
    pass

class Games(GameInterface):
  def __init__(self, call_queue = CallQueue):
    super().__init__()
    self.games = {}
    self.last_access = {}
    self.call_queue = call_queue

    self.wait_time = 30

  def getGamesFromDay(self, day: date) -> dict:
    # If already cached and its been a short time, just return it from cache
    if day in self.games.keys() and (monotonic() - self.last_access[day]) <= self.wait_time:
      return self.games[day]
    
    # Wait for our turn
    c: Call = self.call_queue.addCall()
    delay = c.ready_time - monotonic()
    if (delay > 0):
      sleep(delay)

    day_str = day.strftime('%m/%d/%Y')
    found_games = scoreboardv3.ScoreboardV3(game_date=day_str)

    headers = found_games.game_header.get_data_frame()
    linescores = found_games.line_score.get_data_frame()

    
print(Games(CallQueue(4)).getGamesFromDay(date(2025,12,20)))