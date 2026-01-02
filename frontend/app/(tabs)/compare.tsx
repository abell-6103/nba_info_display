import { useState } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';
import { CompareMode, PlayerCompareResult } from '../types';

export default function Compare() {
  const api_uri = process.env.EXPO_PUBLIC_API_URI;

  const [comparison_loading, setComparisonLoading] = useState<boolean>(true);
  const [comparison_load_success, setComparisonLoadSuccess] = useState<boolean>(true);
  const [comparison, setComparison] = useState<PlayerCompareResult>();

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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Compare players.
      </Text>
    </View>
  )
}