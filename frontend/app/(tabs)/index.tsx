import { Link } from "expo-router";
import { Text, View } from "react-native";
import { styles } from '../styles';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/standings" style={styles.button}>
        Go to Standings
      </Link>
    </View>
  );
}