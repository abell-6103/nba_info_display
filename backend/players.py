from abc import ABC, abstractmethod
from pydantic import BaseModel
from time import sleep, monotonic

from callQueue import CallQueue

from nba_api.stats.static import players as nba_players
from nba_api.stats.endpoints import playercareerstats

def _sortFunc(item):
  return not item['active']

def searchPlayers(player_name: str) -> list:
  nba_res = nba_players.find_players_by_full_name(player_name)
  res = []
  for player in nba_res:
    res.append({
      "player_id": player['id'],
      "player_name": player['full_name'],
      "active": player['is_active'],
      "player_headshot": f"https://cdn.nba.com/headshots/nba/latest/1040x760/{player['id']}.png"
    })
  res.sort(key=_sortFunc)
  return res

class Statline(BaseModel):
  gp: int
  pts: int | float
  ast: int | float
  reb: int | float
  blk: int | float
  stl: int | float
  tov: int | float
  pf: int | float
  fga: int | float
  fgm: int | float
  fg_pct: int | float
  fg3a: int | float
  fg3m: int | float
  fg3_pct: int | float
  fta: int | float
  ftm: int | float
  ft_pct: int | float
  oreb: int | float
  dreb: int | float
  efg_pct: int | float

class PlayerStatsOut(BaseModel):
  player_name: str
  player_id: int
  player_headshot: str
  stats: dict[str, (Statline | dict[str, Statline])]

class PlayerStatInterface(ABC):
  @abstractmethod
  def __init__(self, call_queue: CallQueue):
    ...

  @abstractmethod
  def getPlayerStats(player_id: int) -> PlayerStatsOut:
    ...

class PlayerStats(PlayerStatInterface):
  def __init__(self, call_queue: CallQueue):
    self.stat_cache = {}
    self.last_access = {}
    self.call_queue = call_queue

    self.wait_time = 60

  def getPlayerStats(self, player_id: int) -> PlayerStatsOut:
    if not isinstance(player_id, int):
      raise TypeError("player_id must be of type int")
    
    if player_id in self.stat_cache.keys() and (monotonic() - self.last_access[player_id]) <= self.wait_time:
      return self.stat_cache[player_id]
    
    try:
      nba_res = playercareerstats.PlayerCareerStats(player_id=player_id, per_mode36="Totals")
    except:
      return None
    self.last_access[player_id] = monotonic()

    dropped_cols = ['PLAYER_ID', 'LEAGUE_ID', 'Team_ID']
    career_total_regular = nba_res.career_totals_regular_season.get_data_frame().drop(columns=dropped_cols)
    career_total_playoff = nba_res.career_totals_post_season.get_data_frame().drop(columns=dropped_cols)
    season_total_regular = nba_res.season_totals_regular_season.get_data_frame().drop(columns=dropped_cols)
    season_total_playoff = nba_res.season_totals_post_season.get_data_frame().drop(columns=dropped_cols)

    return nba_res