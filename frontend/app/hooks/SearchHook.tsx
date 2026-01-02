import { useState } from 'react';
import { PlayerSearchInfo } from '../types';

export function useSearch() {
  const [loading, setLoading] = useState<boolean>(false);
  const [load_success, setLoadSuccess] = useState<boolean>(true);
  const [players, setPlayers] = useState<PlayerSearchInfo[]>([]);
  const [has_searched, setHasSearched] = useState<boolean>(false);

  const api_uri = process.env.EXPO_PUBLIC_API_URI;

  const getPlayers = async (player_name: string) => {
    setLoading(true);
    try {
      const response = await fetch(api_uri + `/search-player/${player_name}`);
      if (response.ok) {
        const json = await response.json();
        setPlayers(json);
        setLoadSuccess(true);
      } else {
        console.error(`Player search failed.`);
        setPlayers([]);
        setLoadSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setPlayers([]);
      setLoadSuccess(false);
    }
    setHasSearched(true);
    setLoading(false);
  };

  return {
    loading_players: loading,
    load_players_success: load_success,
    players,
    has_searched,
    getPlayers
  }
}