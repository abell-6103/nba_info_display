import { useEffect, useState } from 'react'
import { View, Text} from 'react-native';
import { styles } from '../styles';
import { TeamGameInfo, GameInfo } from '../types';

export default function Games() {
  const api_uri = process.env.EXPO_PUBLIC_API_URI;

  const [loading, setLoading] = useState(true);
  const [loadSuccess, setLoadSuccess] = useState(false);
  const [games, setGames] = useState<GameInfo[]>([]);

  const getGames = async(target_day: string) => {
    setLoading(true);
    try {
      const response = await fetch(api_uri + `/games/${target_day}`);
      if (response.ok) {
        const json = await response.json();
        setGames(json);
      } else {
        console.error(`Couldn't load games from ${target_day}`)
        setLoadSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setLoadSuccess(false);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Games</Text>
    </View>
  );
}