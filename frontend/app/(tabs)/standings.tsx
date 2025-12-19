import { useEffect, useState } from 'react'
import { Text, ActivityIndicator, View, ScrollView, Image, Pressable } from 'react-native';
import { styles } from '../styles';
import { StandingsRowInfo } from '../types';

export default function StandingsScreen() {
  const api_uri = process.env.EXPO_PUBLIC_API_URI;

  const [loading, setLoading] = useState(true); // Initialize to true so that page loads with progress wheel
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

  function getClinchText(clinch: string): string {
    const divisions = [' - sw', ' - c', ' - nw', ' - a', ' - se', ' - p'];
    const conferences = [' - w', ' - e'];
    if (divisions.includes(clinch)) {
      return "Clinched Division";
    } else if (conferences.includes(clinch)) {
      return "Clinched Conference";
    } else if (clinch === ' - x') {
      return "Clinched Playoff Berth";
    } else if (clinch === ' - ps') {
      return "Clinched Postseason";
    } else if (clinch === ' - pi') {
      return "Clinched Play-In Berth";
    } else if (clinch === ' - o') {
      return "Eliminated from contention";
    } else {
      return "";
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
          <View style={[styles.ConferenceTextBox, !east_visible ? styles.ViewSelected : styles.ViewUnselected]}>
            <Text style={!east_visible ? styles.TextSelected : styles.TextUnselected}>West</Text>
          </View>
          <View style={[styles.ConferenceTextBox, east_visible ? styles.ViewSelected : styles.ViewUnselected]}>
            <Text style={east_visible ? styles.TextSelected : styles.TextUnselected}>East</Text>
          </View>
        </View>
      </Pressable>
    )
  }

  function StandingsRow({row} : {row: StandingsRowInfo}) {
    return (
      <View style={styles.tableRow}>
        <View style={[styles.tableCell, {flex: 1}]}>
          <Text style={styles.major_text}>{row.seed}</Text>
        </View>
        <View style={[styles.tableCell, {flex: 4, justifyContent: 'flex-start'}]}>
          <Image source={{uri: row.img_href}} style={styles.teamLogo}/>
          {row.clinch === "" ? (
            <Text style={styles.bold_text}>{row.name}</Text>
          ) : (
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.bold_text}>{row.name}</Text>
              <Text style={styles.minor_text}>{getClinchText(row.clinch)}</Text>
            </View>
          )}
        </View>
        <View style={[styles.tableCell, {flex: 2, flexDirection: 'column'}]}>
          <Text style={styles.bold_text}>{row.wins}-{row.losses}</Text>
          <Text style={styles.minor_text}>W-L</Text>
        </View>
        <View style={[styles.tableCell, {flex: 2, flexDirection: 'column'}]}>
          <Text style={styles.bold_text}>{row.gamesBack === 0 ? '-' : row.gamesBack}</Text>
          <Text style={styles.minor_text}>GB</Text>
        </View>
        <View style={[styles.tableCell, {flex: 2, flexDirection: 'column'}]}>
          <Text style={styles.bold_text}>{getStreakText(row.streak)}</Text>
          <Text style={styles.minor_text}>STRK</Text>
        </View>
        <View style={[styles.tableCell, {flex: 2, flexDirection: 'column'}]}>
          <Text style={styles.bold_text}>{row.diff}</Text>
          <Text style={styles.minor_text}>DIFF</Text>
        </View>
      </View>
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