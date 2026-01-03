import { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, Image, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { styles } from '../styles';
import { CompareMode, PlayerBoxscoreInfo, PlayerCompareResult, PlayerSearchInfo } from '../types';
import { useSearch } from '../hooks/SearchHook';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Compare() {
  const { players, loading_players, load_players_success, has_searched, getPlayers, resetSearch } = useSearch();

  const [comparison_loading, setComparisonLoading] = useState<boolean>(false);
  const [comparison_load_success, setComparisonLoadSuccess] = useState<boolean>(true);
  const [comparison, setComparison] = useState<PlayerCompareResult>();

  const api_uri = process.env.EXPO_PUBLIC_API_URI;

  const getComparison = async (p1_id: number, p2_id: number, mode: CompareMode) => {
    setComparisonLoading(true);
    let uri = api_uri + `/compare/?mode_type=${mode.mode_type}&p1_id=${p1_id}&p2_id=${p2_id}`;
    if (mode.mode_type == "season") {
      uri += `&season_name=${mode.season_name}`;
    }
    try {
      const response = await fetch(uri);
      if (response.ok) {
        const json = await response.json();
        setComparison(json);
        setComparisonLoadSuccess(true);
      } else {
        console.error("Couldn't load comparison.");
        setComparison(undefined);
        setComparisonLoadSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setComparison(undefined);
      setComparisonLoadSuccess(false);
    }
    setComparisonLoading(false);
  }

  const [comparison_target, setComparisonTarget] = useState<PlayerSearchInfo[]>([]);
  useEffect(() => {
    if (comparison_target.length >= 2) {
      const p1_id = comparison_target[0].player_id;
      const p2_id = comparison_target[1].player_id;
      const mode: CompareMode = {
        mode_type: 'career',
        season_name: undefined
      };
      getComparison(p1_id, p2_id, mode);
    }
  }, [comparison_target])

  function Comparison() {
    function ExitButton() {
      function onPress() {
        resetSearch();
        setComparisonTarget([]);
      }

      return (
        <Pressable style={styles.SearchResultExit} onPress={onPress}>
          <Ionicons name="arrow-back-outline" color="#fff" />
          <Text style={styles.SearchResultExitText}>Exit</Text>
        </Pressable>
      )
    }

    function PlayerIcon({ player }: { player: PlayerBoxscoreInfo }) {
      return (
        <View style={{alignItems: 'center'}}>
          <Image source={{ uri: player.player_headshot }} style={styles.ComparisonHeadshot} />
          <Text style={styles.ComparisonPlayerText}>{player.player_name}</Text>
        </View>
      )
    }

    function StatBox({name, value, highlight}: {name: string, value: number, highlight: boolean}) {
      return (
        <View style={styles.StatBox}>
          <Text style={styles.StatBoxName}>{name}</Text>
          <Text style={highlight ? (styles.StatBoxTextHighlight) : (styles.StatBoxTextBasic)}>{value}</Text>
        </View>
      )
    }

    function PlayerColumn({ player, index }: { player: PlayerBoxscoreInfo | undefined, index: number }) {
      function getHighlight(value: number | undefined): boolean {
        if (value === undefined) {
          return false;
        } 
        if (index === 0) {
          return value > 0
        } else if (index === 1) {
          return value < 0
        }
        return false;
      }
      
      let source;
      if (comparison?.mode.mode_type === "career") {
        source = player?.stats.regular.pergame.career;
      } else {
        source = player?.stats.regular.pergame.season[comparison?.mode.season_name];
      }

      return (
        player === undefined ? (
          <></>
        ) : (
          <View style={styles.ComparisonColumn}>
            <PlayerIcon player={player} />
            <StatBox name='Points'
            value={source.pts.toFixed(1)}
            highlight={getHighlight(comparison?.result.pergame.pts)}/>
            <StatBox name='Rebounds'
            value={source.reb.toFixed(1)}
            highlight={getHighlight(comparison?.result.pergame.reb)}/>
            <StatBox name='Assists'
            value={source.ast.toFixed(1)}
            highlight={getHighlight(comparison?.result.pergame.ast)}/>
            <StatBox name='FG%'
            value={source.fg_pct.toFixed(3)}
            highlight={getHighlight(comparison?.result.pergame.fg_pct)}/>
            <StatBox name='FG3%'
            value={source.fg3_pct.toFixed(3)}
            highlight={getHighlight(comparison?.result.pergame.fg3_pct)}/>
            <StatBox name='FT%'
            value={source.ft_pct.toFixed(3)}
            highlight={getHighlight(comparison?.result.pergame.ft_pct)}/>
            <StatBox name='Minutes/Game'
            value={source.min.toFixed(1)}
            highlight={getHighlight(comparison?.result.pergame.min)}/>
            <StatBox name='Blocks'
            value={source.blk.toFixed(1)}
            highlight={getHighlight(comparison?.result.pergame.blk)}/>
            <StatBox name='Steals'
            value={source.stl.toFixed(1)}
            highlight={getHighlight(comparison?.result.pergame.stl)}/>
            <StatBox name='Fouls'
            value={source.pf.toFixed(1)}
            highlight={getHighlight(comparison?.result.pergame.pf)}/>
            <StatBox name='Turnovers'
            value={source.tov.toFixed(1)}
            highlight={getHighlight(comparison?.result.pergame.tov)}/>
          </View>
        )

      )
    }

    return (
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <ExitButton />
        </View>
        <ScrollView>
          <View style={styles.ComparisonContainer}>
            <PlayerColumn player={comparison?.player_1} index={0} />
            <PlayerColumn player={comparison?.player_2} index={1} />
          </View>
        </ScrollView>
      </View>
    )
  }

  function SearchResult() {
    function PlayerCard({ player }: { player: PlayerSearchInfo }) {
      function handlePress() {
        setComparisonTarget(prev => [...prev, player]);
        resetSearch();
      }

      return (
        <Pressable onPress={handlePress}>
          <View style={[styles.tableRow, player.active ? {} : { backgroundColor: '#7278a0' }]}>
            <View style={styles.tableCell}>
              <Image style={styles.playerCardHeadshot} source={{ uri: player.player_headshot }} />
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

    function handleExitPress() {
      resetSearch();
    }

    return (
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Pressable style={styles.SearchResultExit} onPress={handleExitPress}>
            <Ionicons name="arrow-back-outline" color="#fff" />
            <Text style={styles.SearchResultExitText}>
              Back
            </Text>
          </Pressable>
        </View>
        {players.length > 0 ? (
          <ScrollView>
            {players?.map((row, index) => (
              <PlayerCard key={index} player={row} />
            ))}
          </ScrollView>
        ) : (
          <Text>No players found :(</Text>
        )}
      </View>
    )
  }

  function SearchComponent() {
    const [target_player, setTargetPlayer] = useState<string>("");

    function handlePress() {
      getPlayers(target_player);
    }

    function PlayerItem({ player, index }: { player: PlayerSearchInfo, index: number }) {
      function handlePress() {
        setComparisonTarget(prev =>
          prev.filter((_, item_index) => item_index !== index)
        )
      }

      return (
        <View style={styles.SearchComponentPlayerItem}>
          <Text>{player.player_name}</Text>
          <Pressable style={styles.SearchComponentButton} onPress={handlePress}>
            <Ionicons name="close-outline" size={14} color="#eee" />
          </Pressable>
        </View>
      )
    }

    return (
      <View style={styles.SearchComponentContainer}>
        <Text style={styles.SearchComponentHeader}>
          {comparison_target.length > 0 ?
            ("Select another player.") : ("Select a player.")}
        </Text>
        <View style={styles.SearchComponentBody}>
          <TextInput
            style={styles.TextInput}
            placeholder="Type a player's name here."
            onChangeText={setTargetPlayer}
            value={target_player}
          />
          <Pressable style={styles.SearchComponentButton} onPress={handlePress}>
            <Ionicons name={'search-outline'} size={16} color="#eee" />
          </Pressable>
        </View>
        {comparison_target?.map((row, index) => (
          <PlayerItem key={index} index={index} player={row} />
        ))}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {loading_players || comparison_loading ? (
        <ActivityIndicator animating={true} />
      ) : (
        comparison_target.length >= 2 && comparison_load_success ? (
          <Comparison />
        ) : (
          has_searched ? (
            <SearchResult />
          ) : (
            <SearchComponent />
          )
        )
      )}
    </View>
  )
}