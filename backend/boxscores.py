from nba_api.stats.endpoints import boxscoretraditionalv3, boxscoresummaryv3

from time import monotonic, sleep
from abc import ABC, abstractmethod
import pandas as pd

from callQueue import CallQueue

class StatObj:
  def __init__(self):
    self.values = {}
    self._statList = ['fgm', 'fga', 'fg3m', 'fg3a', 'ftm', 'fta', 'oreb', 'dreb',
                      'ast', 'blk', 'stl', 'pts', 'pf', 'min']
    for stat in self._statList:
      self.values[stat] = None

  def getValues(self) -> dict:
    # work on a copy so the returned value doesnt affect the source
    copy = self.values.copy()

    # extra stats
    copy['reb'] = copy['oreb'] + copy['dreb']
    copy['fg_pct'] = 0 if copy['fga'] == 0 else copy['fgm'] / copy['fga']
    copy['fg3_pct'] = 0 if copy['fg3a'] == 0 else copy['fg3m'] / copy['fg3a']
    copy['ft_pct'] = 0 if copy['fta'] == 0 else copy['ftm'] / copy['fta']
    copy['efg_pct'] = 0 if copy['fga'] == 0 else ( copy['fgm'] + 0.5 * copy['fg3m'] ) / copy['fga']

    return copy
  
  @staticmethod
  def loadFromSeries(source: pd.Series) -> "StatObj":
    newObj = StatObj()
    for stat in newObj._statList:
      try:
        newObj.values[stat] = source.loc[stat]
      except KeyError:
        newObj.values[stat] = 0
    return newObj

class BoxscoreInterface(ABC):
  @abstractmethod
  def __init__(self, call_queue: CallQueue):
    pass

  @abstractmethod
  def getBoxscore(self, game_id: str) -> dict:
    pass

class Boxscores(BoxscoreInterface):
  def __init__(self, call_queue: CallQueue):
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
    team_stats_df = res.team_stats.get_data_frame()[["teamId", 'teamCity', 'minutes',
                                                     'fieldGoalsMade', 'fieldGoalsAttempted',
                                                     'threePointersMade', 'threePointersAttempted',
                                                     'freeThrowsMade', 'freeThrowsAttempted',
                                                     'reboundsOffensive', 'reboundsDefensive',
                                                     'assists', 'steals', 'blocks', 'turnovers',
                                                     'points', 'foulsPersonal']]
    
    team_stats_df = team_stats_df.rename(columns={"teamId": "team_id", "teamCity": "team_city",
                                                  "minutes": "min", "fieldGoalsMade": "fgm",
                                                  "fieldGoalsAttempted": "fga",
                                                  "threePointersMade": "fg3m",
                                                  "threePointersAttempted": "fg3a",
                                                  "freeThrowsMade": "ftm", "freeThrowsAttempted":
                                                  "fta", "reboundsOffensive": "oreb",
                                                  "reboundsDefensive": "dreb", "assists": "ast",
                                                  "steals": "stl", "blocks": "blk", "turnovers":
                                                  "tov", "points": "pts", "foulsPersonal": "pf"})

    return team_stats_df
  
  def _getPlayerStatsDf(self, boxscore: boxscoretraditionalv3.BoxScoreTraditionalV3) -> pd.DataFrame:
    player_stats_df = boxscore.player_stats.get_data_frame()[["teamId", "personId", "nameI",
                                                              "position", "jerseyNum", "minutes",
                                                              "fieldGoalsMade",
                                                              "fieldGoalsAttempted",
                                                              "threePointersMade",
                                                              "threePointersAttempted",
                                                              "freeThrowsMade",
                                                              "freeThrowsAttempted",
                                                              "reboundsOffensive",
                                                              "reboundsDefensive",
                                                              "assists", "steals", "blocks",
                                                              "turnovers", "points",
                                                              "foulsPersonal"]]
    
    player_stats_df = player_stats_df.rename(columns={"teamId": "team_id", "personId": "player_id",
                                                      "nameI": "player_name", "jerseyNum":
                                                      "jersey", "minutes": "min", "fieldGoalsMade":
                                                      "fgm", "fieldGoalsAttempted": "fga",
                                                      "threePointersMade": "fg3m",
                                                      "threePointersAttempted": "fg3a",
                                                      "freeThrowsMade": "ftm",
                                                      "freeThrowsAttempted": "fta",
                                                      "reboundsOffensive": "oreb",
                                                      "reboundsDefensive": "dreb", "assists":
                                                      "ast", "steals": "stl", "blocks": "blk",
                                                      "turnovers": "tov", "points": "pts",
                                                      "foulsPersonal": "pf"})

    return player_stats_df

  def _getTeamInfoDf(self, res: boxscoresummaryv3.BoxScoreSummaryV3) -> pd.DataFrame:
    team_info_df = res.other_stats.get_data_frame()[["teamId", "teamCity"]]
    team_info_df = team_info_df.rename(columns={"teamId": "team_id", "teamCity": "team_city"})

    return team_info_df

  def _waitForCall(self) -> None:
    c = self.call_queue.addCall()
    delay = c.ready_time - monotonic()
    if delay > 0:
      sleep(delay)

  def _getApiRes(self, game_id: str):
    self._waitForCall()
    try:
      summary = boxscoresummaryv3.BoxScoreSummaryV3(game_id=game_id)
    except:
      # If summary doesn't exist, neither does the game
      return None, None, None
    
    score_exists = True
    self._waitForCall()
    try:
      # Game exists and so does its box score
      boxscore = boxscoretraditionalv3.BoxScoreTraditionalV3(game_id=game_id)
      if len(boxscore.player_stats.get_dict()['data']) == 0:
        return None, None, None
    except:
      boxscore = None
      score_exists = False
    return boxscore, summary, score_exists

  def _getStatsDict(self, row: pd.Series):
    stats = StatObj.loadFromSeries(row).getValues()
    return stats

  def getBoxscore(self, game_id: str) -> dict:
    if game_id in self.boxscores.keys() and (monotonic() - self.last_access[game_id]) <= self.wait_time:
      return self.boxscores[game_id]

    self._validateId(game_id)
    boxscore, summary, score_exists = self._getApiRes(game_id)
    if score_exists is None:
      return None
    self.last_access[game_id] = monotonic()

    score = {
      "team_0": {},
      "team_1": {},
      "score_exists": score_exists,
      "status": summary.game_summary.get_data_frame().iloc[0].loc['gameStatusText']
    }

    if score_exists:
      team_stats_df = self._getTeamStatsDf(boxscore)

      sample_team = {
        "team_id" : None,
        "team_city" : None,
        "team_logo" : None,
        "team_stats" : {},
      }
      score["team_0"] = sample_team.copy()
      score["team_1"] = sample_team.copy()

      score["team_0"]["player_stats"] = []
      score["team_1"]["player_stats"] = []

      i = 0
      for _, row in team_stats_df.iterrows():
        team = score[f"team_{i}"]
        team["team_id"] = row.loc['team_id']
        team["team_city"] = row.loc['team_city']
        team["team_logo"] = f"https://cdn.nba.com/logos/nba/{team['team_id']}/primary/L/logo.svg"
        team["team_stats"] = self._getStatsDict(row)
        i += 1

      player_stats_df = self._getPlayerStatsDf(boxscore)
      for _, row in player_stats_df.iterrows():
        player = {}
        player["player_name"] = row.loc["player_name"]
        player["player_id"] = row.loc["player_id"]
        player["position"] = row.loc["position"]
        player["started"] = player["position"] != ""
        #player["jersey"] = row.loc["jersey"]
        player["stats"] = self._getStatsDict(row)

        if row.loc["team_id"] == score["team_0"]["team_id"]:
          score["team_0"]['player_stats'].append(player)
        elif row.loc["team_id"] == score["team_1"]["team_id"]:
          score["team_1"]['player_stats'].append(player)

    else:
      team_info_df = self._getTeamInfoDf(summary)

      sample_team = {
        "team_id" : None,
        "team_city" : None,
        "team_logo" : None
      }
      score["team_0"] = sample_team.copy()
      score["team_1"] = sample_team.copy()

      i = 0
      for _, row in team_info_df.iterrows():
        team = score[f"team_{i}"]
        team["team_id"] = row.loc["team_id"]
        team["team_city"] = row.loc["team_city"]
        team["team_logo"] = f"https://cdn.nba.com/logos/nba/{team['team_id']}/primary/L/logo.svg"
        i += 1

    self.boxscores[game_id] = score
    return score