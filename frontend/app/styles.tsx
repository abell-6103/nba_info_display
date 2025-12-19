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
  major_text: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 24,
  },
  bold_text: {
    color: '#fff',
    fontWeight: 600,
    fontSize: 16
  },
  minor_text: {
    color: '#fff',
    fontSize: 10
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
  tableRow: {
    flex: 1,
    backgroundColor: '#31396d', 
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    margin: 4
  },
  tableCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamLogo: {
    width: 32,
    height: 32,
    backgroundColor: "#fff",
    resizeMode: 'contain',
    marginRight: 4,
    borderWidth: 1,
    borderRadius: 4,
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