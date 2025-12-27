import { use, useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView, Image, Modal } from 'react-native';
import { styles } from '../styles';
import { PlayerSearchInfo, PlayerBoxscoreInfo } from '../types';

export default function PlayersScreen() {
  const api_uri = process.env.EXPO_PUBLIC_API_URI;

  const [target_player, setTargetPlayer] = useState<string>("");
  const [players, setPlayers] = useState<PlayerSearchInfo[]>([]);
  const [loading_players, setLoadingPlayers] = useState<boolean>(false);
  const [load_players_success, setLoadPlayersSuccess] = useState<boolean>(true);
  const [has_searched, setHasSearched] = useState<boolean>(false);

  const [target_id, setTargetId] = useState<number>(-1);
  const [player_stats, setPlayerStats] = useState<PlayerBoxscoreInfo>();
  const [loading_player_stats, setLoadingPlayerStats] = useState<boolean>(false);
  const [load_player_stats_success, setLoadPlayerStatsSuccess] = useState<boolean>(true);

  const [modal_visible, setModalVisible] = useState<boolean>(false);

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

  const getPlayerStats = async(player_id: number) => {
    setLoadingPlayerStats(true);
    try {
      const response = await fetch(api_uri + `/player-stats/${player_id}`);
      if (response.ok) {
        const json = await response.json();
        setPlayerStats(json);
        setLoadPlayerStatsSuccess(true);
      } else {
        console.error(`Failed to load stats for player with id ${player_id}`);
        setPlayerStats(undefined);
        setLoadPlayerStatsSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setPlayerStats(undefined);
      setLoadPlayerStatsSuccess(false);
    }
    setLoadingPlayerStats(false);
  }

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
    function handlePress() {
      getPlayerStats(player.player_id);
      setModalVisible(true);
    }

    return (
      <Pressable onPress={handlePress}>
        <View style={[styles.tableRow, player.active ? {} : {backgroundColor: '#7278a0'}]}>
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
      <Modal
        animationType='slide'
        visible={modal_visible}
        onRequestClose={() => (setModalVisible(!modal_visible))}
      >
        <View style={styles.container}>
          <Text style={styles.text}>This is a modal.</Text>
        </View>
      </Modal>
    </View>
  )
}