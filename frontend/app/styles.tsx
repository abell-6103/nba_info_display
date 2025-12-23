import { Dimensions, StatusBar, StyleSheet } from "react-native";

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
    backgroundColor: '#e0e0e0'
    
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 8,
    columnGap: 4,
    height: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: "#000"
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
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 4,
  },
  ConferencePressableContainer: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center'
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
  },
  SeasonToggle: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#e0e0e0'
  },
  Modal: {
    margin: 15,
    alignItems: undefined,
    justifyContent: undefined
  }
});