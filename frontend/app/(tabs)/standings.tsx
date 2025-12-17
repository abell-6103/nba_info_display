import { useEffect } from 'react'
import { Text, View } from 'react-native';
import { styles } from '../styles';

export default function StandingsScreen() {
  const api_uri = "http://127.0.0.1:8000";

  const getStandings = async() => {
    try {
      const response = await fetch(api_uri + "/standings/2025-26");
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log("hello");
    const func = async () => {
      const res = await getStandings();
      console.log(res)
    };
    func();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Standings screen</Text>
    </View>
  );
}