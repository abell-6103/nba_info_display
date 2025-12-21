type StandingsRowInfo = {
  name: string;
  city: string;
  id: number;
  clinch: string;
  seed: number;
  wins: number;
  losses: number;
  pct: number;
  gamesBack: number;
  streak: number;
  diff: number;
  img_href: string;
}

type TeamGameInfo = {
  team_id: number;
  city: string;
  score: number;
  logo: string;
}

type GameInfo = {
  game_id: number;
  status: string;
  home_team: TeamGameInfo;
  away_team: TeamGameInfo;
}

export {
  StandingsRowInfo,
  TeamGameInfo,
  GameInfo
}