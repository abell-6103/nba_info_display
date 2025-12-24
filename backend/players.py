from nba_api.stats.static import players as nba_players

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
    return res
