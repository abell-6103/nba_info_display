import { Dimensions, StatusBar, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
  table: {
    flex: 1,
    width: "100%",
    backgroundColor: '#fff',
  },
  tableCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamLogo: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  ConferencePressableContainer: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    margin: 12,
    overflow: 'hidden'
  },
  ConferenceTextBox: {
    flex: 1,
    padding: 4,
    alignItems: 'center',
  },
  ViewSelected: {
    backgroundColor: '#25292e',
  },
  ViewUnselected: {
    backgroundColor: '#fff',
  },
  TextSelected: {
    color: '#fff',
    fontWeight: '700'
  },
  TextUnselected: {
    color: '#000',
  }
});