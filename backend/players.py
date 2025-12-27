from abc import ABC, abstractmethod
from pydantic import BaseModel
from time import sleep, monotonic
import pandas as pd

from callQueue import CallQueue

from nba_api.stats.static import players as nba_players
from nba_api.stats.endpoints import playercareerstats

REGULAR_STR = 'regular'
PLAYOFF_STR = 'postseason'
TOTAL_STR = 'total'
PERGAME_STR = 'pergame'
CAREER_STR = 'career'
SEASON_STR = 'season'

def _getPlayerHeadshot(player_id: int) -> str:
  return f"https://cdn.nba.com/headshots/nba/latest/1040x760/{player_id}.png"

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
      "player_headshot": _getPlayerHeadshot(player['id'])
    })
  res.sort(key=_sortFunc)
  return res

class Statline(BaseModel):
  gp: int
  gs: int
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

  @staticmethod
  def loadFromSeries(s: pd.Series):
    res = Statline(
      gp = s.loc['GP'],
      gs = s.loc['GS'],
      pts = s.loc['PTS'],
      ast = s.loc['AST'],
      reb = s.loc['REB'],
      blk = s.loc['BLK'],
      stl = s.loc['STL'],
      tov = s.loc['TOV'],
      pf = s.loc['PF'],
      fga = s.loc['FGA'],
      fgm = s.loc['FGM'],
      fg_pct = s.loc['FG_PCT'],
      fg3a = s.loc['FG3A'],
      fg3m = s.loc['FG3M'],
      fg3_pct = s.loc['FG3_PCT'],
      fta = s.loc['FTA'],
      ftm = s.loc['FTM'],
      ft_pct = s.loc['FT_PCT'],
      oreb = s.loc['OREB'],
      dreb = s.loc['DREB'],
      efg_pct = (s.loc['FGM'] + s.loc['FG3M']) / s.loc['FGA'] if s.loc['FGA'] > 0 else 0
    )
    return res

class PlayerStatsOut(BaseModel):
  player_name: str
  player_id: int
  player_headshot: str
  stats: dict[str, dict[str, dict[str, dict[str, int | float] | list[dict[str, int | float | str]]]]]

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

  def _getPerGameStats(self, totals: pd.DataFrame) -> pd.DataFrame:
    divisor = 'GP'
    ignored_cols = ['GS', divisor, 'SEASON_ID', 'TEAM_ABBREVIATION', 'PLAYER_AGE']

    per_game_stats = totals.copy(deep = True)
    altered_cols = per_game_stats.columns.difference(ignored_cols)
    per_game_stats[altered_cols] = per_game_stats[altered_cols].div(per_game_stats[divisor], axis=0)

    return per_game_stats

  def _getSeasonDict(self, season_series: pd.Series) -> dict:
    season_dict = Statline.loadFromSeries(season_series).model_dump()
    season_dict['season'] = season_series.loc['SEASON_ID']
    season_dict['team'] = season_series.loc['TEAM_ABBREVIATION']
    return season_dict

  def getPlayerStats(self, player_id: int) -> PlayerStatsOut:
    if not isinstance(player_id, int):
      raise TypeError("player_id must be of type int")
    
    player_details = nba_players.find_player_by_id(player_id)
    if player_details is None:
      return None

    if player_id in self.stat_cache.keys() and (monotonic() - self.last_access[player_id]) <= self.wait_time:
      return self.stat_cache[player_id]
    
    delay = self.call_queue.addCall().ready_time - monotonic()
    if (delay > 0):
      sleep(delay)
    
    try:
      nba_res = playercareerstats.PlayerCareerStats(player_id=player_id, per_mode36="Totals")
    except:
      return None
    self.last_access[player_id] = monotonic()

    dropped_cols = ['PLAYER_ID', 'LEAGUE_ID', 'TEAM_ID']
    career_total_regular = nba_res.career_totals_regular_season.get_data_frame().drop(columns=dropped_cols)
    season_total_regular = nba_res.season_totals_regular_season.get_data_frame().drop(columns=dropped_cols)
    career_total_playoff = nba_res.career_totals_post_season.get_data_frame().drop(columns=dropped_cols)
    season_total_playoff = nba_res.season_totals_post_season.get_data_frame().drop(columns=dropped_cols)

    played_regular = False
    if not career_total_regular.empty:
      played_regular = True
      career_pergame_regular = self._getPerGameStats(career_total_regular)
      season_pergame_regular = self._getPerGameStats(season_total_regular)

    played_playoff = False
    if not career_total_playoff.empty:
      played_playoff = True
      career_pergame_playoff = self._getPerGameStats(career_total_playoff)
      season_pergame_playoff = self._getPerGameStats(season_total_playoff)

    name = player_details['full_name']
    headshot = _getPlayerHeadshot(player_id)
    stats = {}
    
    if played_regular:
      stats[REGULAR_STR] = {}
      stats[REGULAR_STR][TOTAL_STR] = {}
      stats[REGULAR_STR][PERGAME_STR] = {}

      stats[REGULAR_STR][TOTAL_STR][CAREER_STR] = Statline.loadFromSeries(career_total_regular.iloc[0]).model_dump()
      stats[REGULAR_STR][TOTAL_STR][SEASON_STR] = []
      for _, row in season_total_regular.iterrows():
        stats[REGULAR_STR][TOTAL_STR][SEASON_STR].append(self._getSeasonDict(row))

      stats[REGULAR_STR][PERGAME_STR][CAREER_STR] = Statline.loadFromSeries(career_pergame_regular.iloc[0]).model_dump()
      stats[REGULAR_STR][PERGAME_STR][SEASON_STR] = []
      for _, row in season_pergame_regular.iterrows():
        stats[REGULAR_STR][PERGAME_STR][SEASON_STR].append(self._getSeasonDict(row))

    if played_playoff:
      stats[PLAYOFF_STR] = {}
      stats[PLAYOFF_STR][TOTAL_STR] = {}
      stats[PLAYOFF_STR][PERGAME_STR] = {}

      stats[PLAYOFF_STR][TOTAL_STR][CAREER_STR] = Statline.loadFromSeries(career_total_playoff.iloc[0]).model_dump()
      stats[PLAYOFF_STR][TOTAL_STR][SEASON_STR] = []
      for _, row in season_total_playoff.iterrows():
        stats[PLAYOFF_STR][TOTAL_STR][SEASON_STR].append(self._getSeasonDict(row))

      stats[PLAYOFF_STR][PERGAME_STR][CAREER_STR] = Statline.loadFromSeries(career_pergame_playoff.iloc[0]).model_dump()
      stats[PLAYOFF_STR][PERGAME_STR][SEASON_STR] = []
      for _, row in season_pergame_playoff.iterrows():
        stats[PLAYOFF_STR][PERGAME_STR][SEASON_STR].append(self._getSeasonDict(row))

    res = PlayerStatsOut(player_name=name, player_id=player_id, player_headshot=headshot, stats=stats)
    return res