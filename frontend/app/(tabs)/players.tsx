import { use, useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView, Image } from 'react-native';
import { styles } from '../styles';
import { PlayerSearchInfo } from '../types';

export default function PlayersScreen() {
  const api_uri = process.env.EXPO_PUBLIC_API_URI;

  const [target_player, setTargetPlayer] = useState("");
  const [players, setPlayers] = useState<PlayerSearchInfo[]>([]);
  const [loading_players, setLoadingPlayers] = useState(false);
  const [load_players_success, setLoadPlayersSuccess] = useState(true);
  const [has_searched, setHasSearched] = useState(false);

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
    setHasSearched(true);
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

  function PlayerCard({player} : {player: PlayerSearchInfo}) {
    return (
      <Pressable>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Image style={styles.playerCardHeadshot} source={{uri: player.player_headshot}} />
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.bold_text}>{player.player_name}</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.minor_text}>{
              player.active ? (
                "Active"
              ) : (
                "Not Active"
              )
            }</Text>
          </View>
        </View>
      </Pressable>
    )
  }

  function FailedSearchText({text} : {text: string}) {
    return (
      <View style={styles.FailedSearchView}>
        <Text>
          {text}
        </Text>
      </View>
    )
  }

  function SearchResultDisplay() {
    return (
      <View style={styles.SearchResultDisplay}>
        {loading_players ? (
          <ActivityIndicator animating={true}></ActivityIndicator>
        ) : (
            has_searched ? (
              load_players_success ? (
                players?.length > 0 ? (
                  <ScrollView>{
                  players?.map((row, index) => (
                    <PlayerCard key={index} player={row}/>
                  ))
                  }</ScrollView>
                ) : (
                  <FailedSearchText text={"No players found :("} />
                )
              ) : (
                <FailedSearchText text={"Couldn't load players :("} />
              )
            ) : (
              <></>
            )
        )}
      </View>
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
      <SearchResultDisplay />
    </View>
  )
}