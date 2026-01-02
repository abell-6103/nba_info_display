import { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView, Image, Modal } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { styles } from '../styles';
import { PlayerSearchInfo, PlayerBoxscoreInfo } from '../types';
import { useSearch } from '../hooks/SearchHook';

export default function PlayersScreen() {
  const api_uri = process.env.EXPO_PUBLIC_API_URI;

  const [target_player, setTargetPlayer] = useState<string>("");
  const { players, loading_players, load_players_success, has_searched, getPlayers, resetSearch } = useSearch();
  useFocusEffect(
    useCallback(() => {
      setTargetPlayer("");
      resetSearch();
    }, [])
  );

  const [player_stats, setPlayerStats] = useState<PlayerBoxscoreInfo>();
  const [loading_player_stats, setLoadingPlayerStats] = useState<boolean>(false);
  const [load_player_stats_success, setLoadPlayerStatsSuccess] = useState<boolean>(true);

  const [modal_visible, setModalVisible] = useState<boolean>(false);
  const [playoffs_visible, setPlayoffsVisible] = useState<boolean>(false);

  const getPlayerStats = async (player_id: number) => {
    setLoadingPlayerStats(true);
    try {
      const response = await fetch(api_uri + `/player-stats/${player_id}`);
      if (response.ok) {
        const json = await response.json();
        setPlayerStats(json);
        if (!json.hasOwnProperty('postseason')) {
          setPlayoffsVisible(false);
        }
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
      getPlayers(target_player);
    }

    return (
      <Pressable style={{ flex: 1 }} onPress={handlePress}>
        <View style={styles.SeasonToggle}>
          <Text>Search</Text>
        </View>
      </Pressable>
    )
  }

  function PlayerCard({ player }: { player: PlayerSearchInfo }) {
    function handlePress() {
      getPlayerStats(player.player_id);
      setModalVisible(true);
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

  function FailedSearchText({ text }: { text: string }) {
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
                    <PlayerCard key={index} player={row} />
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

  function PlayoffsToggle() {
    function togglePlayoffsVisible() {
      setPlayoffsVisible(!playoffs_visible);
    }

    return (
      <Pressable onPress={togglePlayoffsVisible} style={{ margin: 4 }}>
        <View style={styles.ConferencePressableContainer}>
          <View style={[styles.ConferenceTextBox, !playoffs_visible ? styles.ViewSelected : styles.ViewUnselected]}>
            <Text style={!playoffs_visible ? styles.TextSelected : styles.TextUnselected}>Regular Season</Text>
          </View>
          <View style={[styles.ConferenceTextBox, playoffs_visible ? styles.ViewSelected : styles.ViewUnselected]}>
            <Text style={playoffs_visible ? styles.TextSelected : styles.TextUnselected}>Playoffs</Text>
          </View>
        </View>
      </Pressable>
    )
  }

  function StatRow({ row }: { row: any }) {
    return (
      <View style={styles.StatDisplayTableRow}>
        <View style={styles.StatDisplayTableCell}>
          <Text style={styles.StatDisplayTableText}>
            {row.min.toFixed(1)}
          </Text>
        </View>
        <View style={styles.StatDisplayTableCell}>
          <Text style={styles.StatDisplayTableText}>
            {row.gp}
          </Text>
        </View>
        <View style={styles.StatDisplayTableCell}>
          <Text style={styles.StatDisplayTableText}>
            {row.gs}
          </Text>
        </View>
        <View style={styles.StatDisplayTableCell}>
          <Text style={styles.StatDisplayTableText}>
            {row.pts.toFixed(1)}
          </Text>
        </View>
        <View style={styles.StatDisplayTableCell}>
          <Text style={styles.StatDisplayTableText}>
            {row.reb.toFixed(1)}
          </Text>
        </View>
        <View style={styles.StatDisplayTableCell}>
          <Text style={styles.StatDisplayTableText}>
            {row.ast.toFixed(1)}
          </Text>
        </View>
        <View style={styles.StatDisplayTableCell}>
          <Text style={styles.StatDisplayTableText}>
            {row.blk.toFixed(1)}
          </Text>
        </View>
        <View style={styles.StatDisplayTableCell}>
          <Text style={styles.StatDisplayTableText}>
            {row.stl.toFixed(1)}
          </Text>
        </View>
        <View style={styles.StatDisplayTableCell}>
          <Text style={styles.StatDisplayTableText}>
            {row.tov.toFixed(1)}
          </Text>
        </View>
        <View style={styles.StatDisplayTableCellWide}>
          <Text style={styles.StatDisplayTableText}>
            {row.fgm.toFixed(1)} - {row.fga.toFixed(1)}
          </Text>
        </View>
        <View style={styles.StatDisplayTableCellWide}>
          <Text style={styles.StatDisplayTableText}>
            {row.fg3m.toFixed(1)} - {row.fg3a.toFixed(1)}
          </Text>
        </View>
        <View style={styles.StatDisplayTableCellWide}>
          <Text style={styles.StatDisplayTableText}>
            {row.ftm.toFixed(1)} - {row.fta.toFixed(1)}
          </Text>
        </View>
        <View style={styles.StatDisplayTableCell}>
          <Text style={styles.StatDisplayTableText}>
            {row.fg_pct.toFixed(3)}
          </Text>
        </View>
        <View style={styles.StatDisplayTableCell}>
          <Text style={styles.StatDisplayTableText}>
            {row.fg3_pct.toFixed(3)}
          </Text>
        </View>
        <View style={styles.StatDisplayTableCell}>
          <Text style={styles.StatDisplayTableText}>
            {row.ft_pct.toFixed(3)}
          </Text>
        </View>
        <View style={styles.StatDisplayTableCell}>
          <Text style={styles.StatDisplayTableText}>
            {row.efg_pct.toFixed(3)}
          </Text>
        </View>
      </View>
    )
  }

  function StatDisplay({ name, stats }: { name: string, stats: object }) {
    return (
      <View style={styles.StatDisplayContainer}>
        <Text style={styles.StatDisplayTextHeader}>{name}</Text>
        <View style={styles.StatDisplayTable}>
          <View style={styles.StatDisplayTableAnchor}>
            <View style={styles.StatDisplayTableMainCellWide}>
              <></>
            </View>
            {
              stats?.season.map((row: any) => (
                <View style={styles.StatDisplayTableMainCellWide}>
                  <Text style={styles.StatDisplayTableTextBold}>{row.season}</Text>
                  <Text style={styles.StatDisplayTableTextBold}>{row.team}</Text>
                </View>
              ))
            }
            <View style={styles.StatDisplayTableMainCellWide}>
              <Text style={styles.StatDisplayTableTextBold}>Career</Text>
            </View>
          </View>
          <ScrollView
            style={styles.StatDisplayTableBody}
            horizontal={true}
            contentContainerStyle={{ flexDirection: 'column' }}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.StatDisplayTableHeader}>
              <View style={styles.StatDisplayTableMainCell}>
                <Text style={styles.StatDisplayTableTextBold}>MIN</Text>
              </View>
              <View style={styles.StatDisplayTableMainCell}>
                <Text style={styles.StatDisplayTableTextBold}>GP</Text>
              </View>
              <View style={styles.StatDisplayTableMainCell}>
                <Text style={styles.StatDisplayTableTextBold}>GS</Text>
              </View>
              <View style={styles.StatDisplayTableMainCell}>
                <Text style={styles.StatDisplayTableTextBold}>PTS</Text>
              </View>
              <View style={styles.StatDisplayTableMainCell}>
                <Text style={styles.StatDisplayTableTextBold}>REB</Text>
              </View>
              <View style={styles.StatDisplayTableMainCell}>
                <Text style={styles.StatDisplayTableTextBold}>AST</Text>
              </View>
              <View style={styles.StatDisplayTableMainCell}>
                <Text style={styles.StatDisplayTableTextBold}>BLK</Text>
              </View>
              <View style={styles.StatDisplayTableMainCell}>
                <Text style={styles.StatDisplayTableTextBold}>STL</Text>
              </View>
              <View style={styles.StatDisplayTableMainCell}>
                <Text style={styles.StatDisplayTableTextBold}>TOV</Text>
              </View>
              <View style={styles.StatDisplayTableMainCellWide}>
                <Text style={styles.StatDisplayTableTextBold}>FG</Text>
              </View>
              <View style={styles.StatDisplayTableMainCellWide}>
                <Text style={styles.StatDisplayTableTextBold}>FG3</Text>
              </View>
              <View style={styles.StatDisplayTableMainCellWide}>
                <Text style={styles.StatDisplayTableTextBold}>FT</Text>
              </View>
              <View style={styles.StatDisplayTableMainCell}>
                <Text style={styles.StatDisplayTableTextBold}>FG%</Text>
              </View>
              <View style={styles.StatDisplayTableMainCell}>
                <Text style={styles.StatDisplayTableTextBold}>FG3%</Text>
              </View>
              <View style={styles.StatDisplayTableMainCell}>
                <Text style={styles.StatDisplayTableTextBold}>FT%</Text>
              </View>
              <View style={styles.StatDisplayTableMainCell}>
                <Text style={styles.StatDisplayTableTextBold}>eFG%</Text>
              </View>
            </View>
            {
              stats?.season.map((row: any) => (
                <StatRow row={row} />
              ))
            }
            <StatRow row={stats?.career} />
          </ScrollView>
        </View>
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
          value={target_player} />
        <SearchButton />
      </View>
      <SearchResultDisplay />
      <Modal
        animationType='slide'
        visible={modal_visible}
        onRequestClose={() => (setModalVisible(!modal_visible))}>
        <View style={styles.table}>
          <Pressable onPress={() => (setModalVisible(false))}
            style={styles.modalExitButton}
          >
            <View style={styles.CloseButton}>
              <Ionicons name={'close-outline'} size={24} color={'#fff'}/>
            </View>
          </Pressable>
          {loading_player_stats ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <ActivityIndicator animating={true}></ActivityIndicator>
            </View>
          ) : (
            <>
              <View style={styles.playerStatsHeader}>
                <Image source={{ uri: player_stats?.player_headshot }} style={
                  { height: 64, width: 88, resizeMode: 'cover' }
                } />
                <Text style={styles.playerStatsTextHeader}>{player_stats?.player_name}</Text>
              </View>
              <ScrollView style={{ flex: 1, width: '100%' }}>
                {load_player_stats_success ? (
                  <>
                    {player_stats?.stats.hasOwnProperty("postseason") ? (
                      <PlayoffsToggle />
                    ) : (
                      <></>
                    )}
                    <View style={styles.tableRow}>
                      <View style={[styles.tableCell, {flexDirection: 'column'}]}>
                        <Text style={styles.major_text}>
                          {playoffs_visible ? (
                            player_stats?.stats.postseason.pergame.career.pts.toFixed(1)
                          ) : (
                            player_stats?.stats.regular.pergame.career.pts.toFixed(1)
                          )}
                        </Text>
                        <Text style={styles.minor_text}>
                          Points
                        </Text>
                      </View>
                      <View style={[styles.tableCell, {flexDirection: 'column'}]}>
                        <Text style={styles.major_text}>
                          {playoffs_visible ? (
                            player_stats?.stats.postseason.pergame.career.reb.toFixed(1)
                          ) : (
                            player_stats?.stats.regular.pergame.career.reb.toFixed(1)
                          )}
                        </Text>
                        <Text style={styles.minor_text}>
                          Rebounds
                        </Text>
                      </View>
                      <View style={[styles.tableCell, {flexDirection: 'column'}]}>
                        <Text style={styles.major_text}>
                          {playoffs_visible ? (
                            player_stats?.stats.postseason.pergame.career.ast.toFixed(1)
                          ) : (
                            player_stats?.stats.regular.pergame.career.ast.toFixed(1)
                          )}
                        </Text>
                        <Text style={styles.minor_text}>
                          Assists
                        </Text>
                      </View>
                    </View>
                    <StatDisplay name={"Totals"} stats={playoffs_visible ? player_stats?.stats?.postseason.total : player_stats?.stats?.regular.total} />
                    <StatDisplay name={"Per Game"} stats={playoffs_visible ? player_stats?.stats?.postseason.pergame : player_stats?.stats?.regular.pergame} />
                  </>
                ) : (
                  <Text>Failed to load player stats</Text>
                )}
              </ScrollView>
            </>
          )}
        </View>
      </Modal>
    </View>
  )
}