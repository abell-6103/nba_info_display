import { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, ScrollView, Image, Pressable } from 'react-native';
import { styles } from '../styles';
import { TeamGameInfo, GameInfo, BoxscoreInfo } from '../types';
import moment from 'moment';

export default function Games() {
  const api_uri = process.env.EXPO_PUBLIC_API_URI;

  const today = new Date();
  const today_string = moment(today).format("YYYY-MM-DD");

  const [games_loading, setGamesLoading] = useState(true);
  const [games_loadSuccess, setGamesLoadSuccess] = useState(false);
  const [games, setGames] = useState<GameInfo[]>([]);
  const [target_day, setTargetDay] = useState(today_string);

  const [boxscore_loading, setBoxscoreLoading] = useState(true);
  const [boxscore_loadSuccess, setBoxscoreLoadSuccess] = useState(false);
  const [boxscore, setBoxscore] = useState<BoxscoreInfo[]>([]);
  const [target_game, setTargetGame] = useState("0000000000");

  const getGames = async(target_day: string) => {
    setGamesLoading(true);
    try {
      const response = await fetch(api_uri + `/games/${target_day}`);
      if (response.ok) {
        const json = await response.json();
        setGames(json);
      } else {
        console.error(`Couldn't load games from ${target_day}`)
        setGamesLoadSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setGamesLoadSuccess(false);
    }
    setGamesLoading(false);
  }

  const getBoxscore = async(target_game: string) => {
    setBoxscoreLoading(true);
    try {
      const response = await fetch(api_uri + `/boxscore/${target_game}`);
      if (response.ok) {
        const json = await response.json();
        setBoxscore(json);
      } else {
        console.error(`Couldn't load boxscore with id ${target_game}.`)
        setBoxscoreLoadSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setBoxscoreLoadSuccess(false);
    }
    setBoxscoreLoading(false);
  }

  useEffect(() => {
    getGames(target_day);
    getBoxscore("0022500397");
  }, []);

  function DatePressable() {
    return (
      <Pressable style={{flex: 1}}>
        <View style={styles.SeasonToggle}>
          <Text>{target_day}</Text>
        </View>
      </Pressable>
    );
  }

  function openGameModal(game_id: number) {
    console.log(game_id)
  }

  function GameEntry({game}: {game: GameInfo}) {
    const handlePress = () => {
      openGameModal(game.game_id);
    };

    return (
      <Pressable onPress={handlePress}>
        <View style={[styles.tableRow, {justifyContent: 'space-evenly'}]}>
          <View style={[styles.tableCell]}>
            <Image source={{uri: game.away_team.logo}} style={styles.teamLogo}/>
          </View>
          <View style={[styles.tableCell, {flex: 2}]}>
            <Text style={[styles.bold_text, {textAlign:'center'}]}>{game.away_team.city}</Text>
          </View>
          <View style={[styles.tableCell, {flexDirection: 'column'}]}>
            <Text style={styles.bold_text}>{game.away_team.score} - {game.home_team.score}</Text>
            <Text style={styles.minor_text}>{game.status}</Text>
          </View>
          <View style={[styles.tableCell, {flex: 2}]}>
            <Text style={[styles.bold_text, {textAlign:'center'}]}>{game.home_team.city}</Text>
          </View>
          <View style={[styles.tableCell]}>
            <Image source={{uri: game.home_team.logo}} style={styles.teamLogo}/>
          </View>
        </View>
      </Pressable>
    );
  }

  function GamesTable() {
    return (
        <ScrollView>{
          games?.map((row, index) => (
            <GameEntry key={index} game={row}/>
          ))
        }</ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {games_loading ? (
        <ActivityIndicator animating={true}></ActivityIndicator>
      ) : (
        <View style={styles.table}>
          <View style={[styles.tableHeader, {alignContent: 'center'}]}>
            <DatePressable />
          </View>
          {games?.length > 0 ? (
            <GamesTable />
          ) : (
            <View style={styles.container}>
              <Text style={styles.text}>Couldn't find games :(</Text>
            </View>
          )} 
        </View>
      )}
    </View>
  );
}