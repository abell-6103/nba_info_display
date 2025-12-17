from nba_api.stats.endpoints import leaguestandingsv3
import pandas as pd
from time import time

_LEAGUE_ID = "00"
_SEASON_TYPE = "Regular Season"

class Standings:
  def __init__(self):
    # Rudimentary cache system
    self.items = {}
    self.last_access = {}

    # Delay before updating cache
    self.wait_time = 60

  @staticmethod
  def _renameDF(df: pd.DataFrame) -> pd.DataFrame:
    return df.rename(columns={
      "TeamName" : "name",
      "TeamCity" : "city",
      "TeamID" : "id",
      "Conference" : "conference",
      "ClinchIndicator" : "clinch",
      "PlayoffRank" : "seed",
      "WINS" : "wins",
      "LOSSES" : "losses",
      "WinPCT" : "pct",
      "ConferenceGamesBack" : "gamesBack",
      "CurrentStreak" : "streak",
      "DiffPointsPG" : "diff"
    })

  def _formatDF(df: pd.DataFrame) -> pd.DataFrame:
    df = Standings._renameDF(df)
    df = df[["name", "city", "id", "conference", "clinch", "seed", "wins", "losses", "pct", "gamesBack", "streak", "diff"]]
    df["img_href"] = "https://cdn.nba.com/logos/nba/" + df['id'].astype(str) + "/primary/D/logo.svg"
    return df

  @staticmethod
  def _getConferenceDicts(df) -> dict:
    conference_df = {
      key: group_df.drop("conference", axis=1)
      for key, group_df in df.groupby("conference")
    }
    conferences = {
      key: group.to_dict(orient="records")
      for key, group in conference_df.items()
    }
    return conferences

  def getStandings(self, season_id: str) -> dict:
    # If the data is already cached and it's been a short time, just return cached data
    if season_id in self.items.keys() and (time() - self.last_access[season_id]) <= self.wait_time:
      return self.items[season_id]
    
    try:
      df = leaguestandingsv3.LeagueStandingsV3(league_id=_LEAGUE_ID, season=season_id, season_type=_SEASON_TYPE).get_data_frames()[0]
    except:
      return None
    self.last_access[season_id] = time()

    df = Standings._formatDF(df)
    conferences = Standings._getConferenceDicts(df)

    res = {
      "season" : season_id,
      "east" : conferences["East"],
      "west" : conferences["West"]
    }
    self.items[season_id] = res
    return res
