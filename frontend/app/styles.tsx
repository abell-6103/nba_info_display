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
  },
  TextInput: {
    flex: 4,
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    textAlign: 'center',
  },
  SearchResultDisplay: {
    flex: 1
  },
  FailedSearchView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  playerCardHeadshot: {
    width: 44,
    height: 32,
    backgroundColor: "#fff",
    resizeMode: 'cover',
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 4,
  },
  playerStatsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 64,
    borderBottomWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#181b1e',
    width: "100%",
    paddingTop: 8
  },
  playerStatsTextHeader: {
    fontSize: 20,
    fontWeight: 700,
    color: '#fff'
  },
  modalExitButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10
  },
  StatDisplayContainer: {
    margin: 4,
  },
  StatDisplayTextHeader: {
    fontWeight: 600,
    fontSize: 16,
  },
  StatDisplayTable: {
    borderWidth: 1,
    borderColor: "#fff",
    flex: 1,
    margin: 2,
    backgroundColor: '#25292e',
    flexDirection: 'row',
  },
  StatDisplayTableHeader: {
    flexDirection: 'row',
  },
  StatDisplayTableRow: {
    flexDirection: 'row',
  },
  StatDisplayTableBody: {
    flexDirection: 'column',
    width: '100%'
  },
  StatDisplayTableAnchor: {
    borderRightWidth: 1,
    borderColor: '#fff'
  },
  StatDisplayTableMainCell: {
    flexDirection: 'row',
    height: 18,
    width: 64,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#181b1e',
    columnGap: 2
  },
  StatDisplayTableMainCellWide: {
    flexDirection: 'row',
    height: 18,
    width: 128,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#181b1e',
    columnGap: 4
  },
  StatDisplayTableCell: {
    flexDirection: 'row',
    height: 18,
    width: 64,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: '#aaa',
  },
  StatDisplayTableCellWide: {
    flexDirection: 'row',
    height: 18,
    width: 128,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: '#aaa',
  },
  StatDisplayTableTextBold: {
    color: '#fff',
    fontWeight: 400,
  },
  StatDisplayTableText: {
    color: '#eee'
  },
  CloseButton: {
    backgroundColor: '#31396d',
    borderRadius: 4,
    padding: 2,
  },
  NewsCard: {
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 12,
    margin: 6,
    flexDirection: 'row',
    alignItems: 'center'
  },
  NewsCardBody: {
    flexDirection: 'column',
    flex: 3
  },
  NewsCardSide: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center'
  },
  NewsCardTitle: {
    fontSize: 16,
    fontWeight: 600,
    margin: 2
  },
  NewsCardSubtitle: {
    fontStyle: 'italic',
    margin: 1
  }
});