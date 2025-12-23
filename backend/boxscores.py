from nba_api.stats.endpoints import boxscoretraditionalv3, boxscoresummaryv3

from time import monotonic, sleep
from abc import ABC, abstractmethod
import pandas as pd

from callQueue import CallQueue

class BoxscoreInterface(ABC):
  def __init__(self, call_queue: CallQueue):
    pass

  def getBoxscore(self, game_id: str) -> dict:
    pass

class Boxscores(BoxscoreInterface):
  def __init__(self, call_queue):
    self.boxscores = {}
    self.last_access = {}
    self.call_queue = call_queue

    self.wait_time = 30

  def _validateId(self, game_id: str):
    if not isinstance(game_id, str):
      raise TypeError("game_id must be of type str")
    if len(game_id) != 10 or not game_id.isnumeric():
      raise ValueError("game_id must be numeric and have length 10")

  def _getTeamStatsDf(self, res: boxscoretraditionalv3.BoxScoreTraditionalV3) -> pd.DataFrame:
    team_stats_df = res.team_stats.get_data_frame()[["teamId", 'teamCity', 'fieldGoalsMade',
                                                     'fieldGoalsAttempted', 'threePointersMade',
                                                     'threePointersAttempted', 'freeThrowsMade',
                                                     'freeThrowsAttempted', 'reboundsOffensive',
                                                     'reboundsDefensive', 'assists', 'steals',
                                                     'blocks', 'turnovers', 'points',
                                                     'foulsPersonal']]
    
    team_stats_df = team_stats_df.rename(columns={"teamId": "team_id", "teamCity": "team_city",
                                                  "fieldGoalsMade": "fgm", "fieldGoalsAttempted":
                                                  "fga", "threePointersMade": "fg3m",
                                                  "threePointersAttempted": "fg3a",
                                                  "freeThrowsMade": "ftm", "freeThrowsAttempted":
                                                  "fta", "reboundsOffensive": "oreb",
                                                  "reboundsDefensive": "dreb", "assists": "ast",
                                                  "steals": "stl", "blocks": "blk", "turnovers":
                                                  "tov", "points": "pts", "foulsPersonal": "pf"})

    return team_stats_df

  def _getApiRes(self, game_id: str):
    score_exists = True
    try:
      # Game exists and so does its box score
      res = boxscoretraditionalv3.BoxScoreTraditionalV3(game_id=game_id)
      if len(res.player_stats.get_dict()['data']) == 0:
        return None, None
    except:
      score_exists = False
      try:
        # Game exists but its box score does not
        res = boxscoresummaryv3.BoxScoreSummaryV3(game_id=game_id)
      except:
        # Neither the game nor the box score exists
        return None, None
    return res, score_exists

  def _getTeamStatsDict(self, row: pd.Series):
    stats = {}
    _statList = ['fgm', 'fga', 'fg3m', 'fg3a', 'ftm', 'fta', 'oreb', 'dreb',
                 'ast', 'blk', 'stl', 'pts', 'pf']
    for stat in _statList:
      stats[stat] = row.loc[stat]

    # extra implied stats
    stats['reb'] = stats['oreb'] + stats['dreb']
    stats['fg_pct'] = stats['fgm'] / stats['fga']
    stats['fg3_pct'] = stats['fg3m'] / stats['fg3a']
    stats['ft_pct'] = stats['ftm'] / stats['fta']

    return stats

  def getBoxscore(self, game_id: str) -> dict:
    if game_id in self.boxscores.keys() and (monotonic() - self.last_access[game_id]) <= self.wait_time:
      return self.boxscores[game_id]

    self._validateId(game_id)
    res, score_exists = self._getApiRes(game_id)
    if score_exists is None:
      return None
    self.last_access[game_id] = monotonic()

    score = {
      "team_0": {},
      "team_1": {},
      "score_exists": score_exists
    }

    if score_exists:
      team_stats_df = self._getTeamStatsDf(res)

      sample_team = {
        "team_id" : None,
        "team_city" : None,
        "team_stats" : {},
        "player_stats" : {}
      }
      score["team_0"] = sample_team.copy()
      score["team_1"] = sample_team.copy()

      i = 0
      for _, row in team_stats_df.iterrows():
        team = score[f"team_{i}"]
        team["team_id"] = row.loc['team_id']
        team["team_city"] = row.loc['team_city']
        team["team_stats"] = self._getTeamStatsDict(row)
        i += 1

    else:
      pass

    self.boxscores[game_id] = score
    return score