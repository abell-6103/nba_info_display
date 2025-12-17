import { useEffect, useState } from 'react'
import { Text, ActivityIndicator, View, ScrollView } from 'react-native';
import { DataTable } from 'react-native-paper';
import { styles } from '../styles';
import { StandingsRowInfo } from '../types';

export default function StandingsScreen() {
  const api_uri = "http://127.0.0.1:8000";
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

  const getStandings = async() => {
    setLoading(true);
    try {
      const response = await fetch(api_uri + `/standings/${target_season}`);
      if (response.ok) {
        const json = await response.json();
        setCurrSeason(json.season);
        setStandingsEast(json.east);
        setStandingsWest(json.west);
        setLoadSuccess(true);
      } else {
        console.error(`Couldn't load standings from season ${target_season}`);
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

  useEffect(() => {
    getStandings();
  }, []);

  function StandingsRow({row} : {row: StandingsRowInfo}) {
    return (
      <DataTable.Row>
        <DataTable.Cell> </DataTable.Cell>
        <DataTable.Cell>{row.seed}</DataTable.Cell>
        <DataTable.Cell>{row.city}</DataTable.Cell>
        <DataTable.Cell>{`${row.wins}-${row.losses}`}</DataTable.Cell>
        <DataTable.Cell>{row.gamesBack}</DataTable.Cell>
        <DataTable.Cell>{row.pct}</DataTable.Cell>
        <DataTable.Cell>{row.streak}</DataTable.Cell>
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
            <DataTable.Header>
              <DataTable.Title> </DataTable.Title>
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