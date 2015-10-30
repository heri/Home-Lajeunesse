/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions
} = React;

var WINDOW_WIDTH = Dimensions.get('window').width;

var DateView = require('./components/date'),
    TimeView = require('./components/time'),
    WeatherView = require('./components/weather'),
    StockView = require('./components/stock'),
    TwitterView = require('./components/twitter'),
    GithubView = require('./components/github'),
    CalendarView = require('./components/calendar'),
    NewsView = require('./components/news'),
    TrelloView = require('./components/trello');

var MagicMirror = React.createClass({
  render: function() {
    var calendar_id = 'heri@madmedia.ca',
    twitterUsers = ['paulg', 'elonmusk', 'radioopensource', 'moonscript', 'banksy', 'howlarts', 'dhh', 'shl', 'Oatmeal', 'lonelysandwich', 'kendyty', 'georgpetschnigg', 'lukew', 'wongfupro', 'macournoyer', 'davidkarp'];
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <DateView></DateView>
        </View>
        <View style={styles.row}>
          <TimeView></TimeView>
        </View>
        <View style={[styles.row, styles.margin, {marginTop: -10}]}>
          <WeatherView></WeatherView>
        </View>
        <View style={[styles.row, styles.margin]}>
          <CalendarView calendar_id={calendar_id}></CalendarView>
        </View>
        <View style={[styles.row, styles.margin]}>
          <GithubView></GithubView>
        </View>
        <View style={[styles.row, styles.margin]}>
          <TrelloView></TrelloView>
        </View>
        <View style={[styles.row, styles.margin]}>
          <NewsView></NewsView>
        </View>
        <View style={[styles.row, styles.margin]}>
          <TwitterView users={twitterUsers}></TwitterView>
        </View>
      </View>
    );
  }
});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 0
  },
  margin: {
    marginBottom: 30
  },
  stocks: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  }
});

AppRegistry.registerComponent('MagicMirror', () => MagicMirror);
