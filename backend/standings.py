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
    self.pull_wait_seconds = 60

  def getStandings(self, season_id: str) -> dict:
    # If the data is already cached and it's been a short time, just return cached data
    if season_id in self.items.keys() and (time() - self.last_access[season_id]) <= self.pull_wait_seconds:
      return self.items[season_id]
    
    try:
      df = leaguestandingsv3.LeagueStandingsV3(league_id=_LEAGUE_ID, season=season_id, season_type=_SEASON_TYPE).get_data_frames()[0]
    except:
      return {}
    
    self.last_access[season_id] = time()

    df = df.rename(columns={
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

    df = df[["name", "city", "id", "conference", "clinch", "seed", "wins", "losses", "pct", "gamesBack", "streak", "diff"]]
    df["img_href"] = "https://cdn.nba.com/logos/nba/" + df['id'].astype(str) + "/primary/D/logo.svg"

    conference_df = {
      key: group_df
      for key, group_df in df.groupby("conference")
    }

    conferences = {
      key: group.to_dict(orient="records")
      for key, group in conference_df.items()
    }

    res = {
      "season" : season_id,
      "east" : conferences["East"],
      "west" : conferences["West"]
    }

    self.items[season_id] = res

    return res
