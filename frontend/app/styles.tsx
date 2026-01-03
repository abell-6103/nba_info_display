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
    backgroundColor: '#fff'
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
  },
  SearchComponentContainer: {
    backgroundColor: '#eee',
    padding: 8,
    width: '50%',
    borderRadius: 12,
    flexDirection: 'column',
  },
  SearchComponentHeader: {
    textAlign: 'center',
    margin: 4,
    fontWeight: 600,
    color: '#333',
    fontSize: 18,
    fontStyle: 'italic'
  },
  SearchComponentBody: {
    flexDirection: 'row',
    columnGap: 6,
    margin: 4
  },
  SearchComponentButton: {
    borderRadius: 12,
    backgroundColor: '#31396d',
    padding: 6
  },
  SearchResultExit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#31396d',
    padding: 4,
    columnGap: 4
  },
  SearchResultExitText: {
    color: '#fff'
  },
  SearchComponentPlayerItem: {
    flexDirection: 'row',
    columnGap: 6,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2
  },
  ComparisonHeadshot: {
    width: 128,
    height: 128,
    backgroundColor: "#fff",
    resizeMode: 'cover',
    borderRadius: 12,
    borderWidth: 1,
  },
  ComparisonPlayerText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 600,
    margin: 4,
    fontSize: 16
  },
  ComparisonContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  ComparisonColumn: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    padding: 8,
    justifyContent: 'space-evenly'
  },
  StatBox: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    margin: 6,
    height: 60
  },
  StatBoxName: {
    fontSize: 12,
    margin: 2,
    fontWeight: 600
  },
  StatBoxTextHighlight: {
    fontSize: 20,
    fontWeight: 800,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 8,
    textAlign: 'center'
  },
  StatBoxTextBasic: {
    fontSize: 20,
    fontWeight: 600,
    textAlign: 'center'
  }
});