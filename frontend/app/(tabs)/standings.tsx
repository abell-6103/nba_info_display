import { useEffect, useState } from 'react'
import { Text, ActivityIndicator, View, ScrollView, Image, Pressable } from 'react-native';
import { DataTable } from 'react-native-paper';
import { styles } from '../styles';
import { StandingsRowInfo } from '../types';

export default function StandingsScreen() {
  const api_uri = process.env.EXPO_PUBLIC_API_URI;

  const [loading, setLoading] = useState(true);
  const [loadSuccess, setLoadSuccess] = useState(false);
  const [target_season, setTargetSeason] = useState("2025-26");
  const [curr_season, setCurrSeason] = useState(undefined);
  const [standings_east, setStandingsEast] = useState(undefined);
  const [standings_west, setStandingsWest] = useState(undefined);
  const [east_visible, showEast] = useState(false);

  const clearData = () => {
    setCurrSeason(undefined);
    setStandingsEast(undefined);
    setStandingsWest(undefined);
  }

  const getStandings = async(target: string) => {
    setLoading(true);
    try {
      const response = await fetch(api_uri + `/standings/${target}`);
      if (response.ok) {
        const json = await response.json();
        setCurrSeason(json.season);
        setStandingsEast(json.east);
        setStandingsWest(json.west);
        setLoadSuccess(true);
      } else {
        console.error(`Couldn't load standings from season ${target}`);
        clearData();
        setLoadSuccess(false);
      }
    } catch (error) {
      console.error(error);
      clearData();
      setLoadSuccess(false);
    }
    setLoading(false);
  }

  function getStreakText(streak: number): string {
    const magnitude = Math.abs(streak);
    if (magnitude === 0) {
      return "-";
    } else if (streak > 0) {
      return `W${magnitude}`;
    } else {
      return `L${magnitude}`;
    }
  }

  useEffect(() => {
    getStandings(target_season);
  }, []);

  function ConferencePressable() {
    const flipConference = () => {
      showEast(!east_visible);
    }
    return (
      <Pressable onPress={flipConference}>
        <View style={styles.ConferencePressableContainer}>
          <View style={[styles.ConferenceTextBox, east_visible ? styles.ViewSelected : styles.ViewUnselected]}>
            <Text style={east_visible ? styles.TextSelected : styles.TextUnselected}>East</Text>
          </View>
          <View style={[styles.ConferenceTextBox, !east_visible ? styles.ViewSelected : styles.ViewUnselected]}>
            <Text style={!east_visible ? styles.TextSelected : styles.TextUnselected}>West</Text>
          </View>
        </View>
      </Pressable>
    )
  }

  function StandingsRow({row} : {row: StandingsRowInfo}) {
    return (
      <DataTable.Row>
        <DataTable.Cell style={[styles.tableCell, {justifyContent: 'center'}]}>{row.seed}</DataTable.Cell>
        <DataTable.Cell>
            <View style={styles.tableCell}>
              <Image source={{uri: row.img_href}} style={styles.teamLogo}/>
              <Text>{row.name}</Text>
            </View>
        </DataTable.Cell>
        <DataTable.Cell style={styles.tableCell}>{`${row.wins}-${row.losses}`}</DataTable.Cell>
        <DataTable.Cell style={styles.tableCell}>{row.gamesBack}</DataTable.Cell>
        <DataTable.Cell style={styles.tableCell}>{row.pct.toPrecision(3)}</DataTable.Cell>
        <DataTable.Cell style={styles.tableCell}>{getStreakText(row.streak)}</DataTable.Cell>
      </DataTable.Row>
    );
  }

  function FullStandings({standings} : {standings: Array<StandingsRowInfo>}) {
    return (
      <ScrollView>{
        standings?.map((row, index) => (
          <StandingsRow key={index} row={row}/>
        ))
      }</ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator animating={true}></ActivityIndicator>
        ) : (
        loadSuccess ? (
          <View style={styles.table}>
            <ConferencePressable />
            <DataTable.Header>
              <DataTable.Title>Rank</DataTable.Title>
              <DataTable.Title>Team</DataTable.Title>
              <DataTable.Title>Record</DataTable.Title>
              <DataTable.Title>GB</DataTable.Title>
              <DataTable.Title>Win%</DataTable.Title>
              <DataTable.Title>Streak</DataTable.Title>
            </DataTable.Header>
            {east_visible ? (
              <FullStandings standings={standings_east}></FullStandings>
            ) : (
              <FullStandings standings={standings_west}></FullStandings>
            )}
          </View>
          ) : (
            <Text style={styles.text}>Couldn't load data :(</Text>
        )
      )}
    </View>
  );
}