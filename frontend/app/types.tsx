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

type StatInfo = {
  min: number;
  fga: number;
  fgm: number;
  fg_pct: number;
  fg3a: number;
  fg3m: number;
  fg3_pct: number;
  fta: number;
  ftm: number;
  ft_pct: number;
  oreb: number;
  dreb: number;
  reb: number;
  ast: number;
  blk: number;
  stl: number;
  pts: number;
  pf: number;
  tov: number;
}

type PlayerBoxscoreInfo = {
  player_id: number;
  player_name: string;
  player_headshot: string;
  stats: object;
}

type PlayerSearchInfo = {
  player_id: number;
  player_name: string;
  player_headshot: string;
  active: boolean;
}

type TeamBoxscoreInfo = {
  team_id: number;
  team_city: string;
  team_stats: StatInfo;
  player_stats: PlayerBoxscoreInfo[];
}

type BoxscoreInfo = {
  team_0: TeamBoxscoreInfo;
  team_1: TeamBoxscoreInfo;
  score_exists: boolean;
}

type ArticleInfo = {
  title: string;
  source: string;
  href: string;
  publish_time: string;
}

type CompareMode = {
  mode_type: string;
  season_name: string | undefined;
}

type ComparisonList = {
  total: StatInfo;
  pergame: StatInfo;
}

type PlayerCompareResult = {
  player_1: PlayerBoxscoreInfo;
  player_2: PlayerBoxscoreInfo;
  mode: CompareMode;
  result: ComparisonList;
  season_overlap: string[];
}

export {
  StandingsRowInfo,
  TeamGameInfo,
  GameInfo,
  PlayerBoxscoreInfo,
  PlayerSearchInfo,
  BoxscoreInfo,
  ArticleInfo,
  CompareMode,
  PlayerCompareResult
}