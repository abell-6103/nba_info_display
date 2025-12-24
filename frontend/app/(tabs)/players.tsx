import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { styles } from '../styles';
import { PlayerSearchInfo } from '../types';

export default function PlayersScreen() {
  const api_uri = process.env.EXPO_PUBLIC_API_URI;

  const [target_player, setTargetPlayer] = useState("");
  const [players, setPlayers] = useState<PlayerSearchInfo[]>([]);
  const [loading_players, setLoadingPlayers] = useState(false);
  const [load_players_success, setLoadPlayersSuccess] = useState(true);

  const getPlayers = async(player_name: string) => {
    setLoadingPlayers(true);
    try {
      const response = await fetch(api_uri + `/search-player/${player_name}`);
      if (response.ok) {
        const json = await response.json();
        setPlayers(json);
        setLoadPlayersSuccess(true);
      } else {
        console.error(`Player search failed.`);
        setPlayers([]);
        setLoadPlayersSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setPlayers([]);
      setLoadPlayersSuccess(false);
    }
    setLoadingPlayers(false);
  };

  function SearchButton() {
    function handlePress() {
      const formatted_target = target_player.trim().replace(/\s+/g, '+');
      getPlayers(formatted_target);
    }

    return (
      <Pressable style={{flex: 1}} onPress={handlePress}>
        <View style={styles.SeasonToggle}>
          <Text>Search</Text>
        </View>
      </Pressable>
    )
  }

  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <TextInput
        style={styles.TextInput} 
        placeholder="Type a player's name here."
        onChangeText={setTargetPlayer}
        value={target_player}/>
        <SearchButton />
      </View>
    </View>
  )
}