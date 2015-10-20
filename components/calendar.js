'use strict';

var React = require('react-native'),
    Styles = require('../styles.js'),
    TweenState = require('react-tween-state'),
    _ = require('lodash');

var {
  StyleSheet,
  View,
  Text,
  Image
} = React;

function getGCalendar(calendar_id) {
  today = (new Date()).toISOString();
  return fetch('https://www.googleapis.com/calendar/v3/calendars/' + calendar_id +'/events?fields=items(summary,id,location,start)&key=')
  .then(function (response) {
    return response.body.items;
  });
}

var CalendarView = React.createClass({
  mixins: [TweenState.Mixin],
  getInitialState: function () {
    return {calendars: [], calendar: 0};
  },
  rotate: function () {
    var next = this.state.calendar + 1;
    if (next === this.state.calendars.length) {
      next = 0;
    }
    this.state.calendar = next;
    this.setState(this.state);
    this.fade(1);
  },
  fade: function (fadeDirection) {
    this.tweenState('opacity', {
      easing: TweenState.easingTypes.linear,
      duration: 1000,
      endValue: fadeDirection,
      onEnd: function () {
        if (!fadeDirection) {
          // fade out, rotate
          this.rotate();
        } else {
          setTimeout(this.fade.bind(this, 0), 5000);
        }
      }.bind(this)
    });
  },
  componentDidMount: function () {
    getGCalendar(this.props.calendar_id).then(function (calendars) {
      this.setState({calendars: calendars, calendar: 0});
      this.fade(1);
    }.bind(this));
  },
  render: function () {
    var calendar = this.state.calendars[this.state.calendar],
        calendarView;

    if (calendar) {
      calendarView = (
        <View style={[styles.calendar, {opacity: this.getTweeningValue('opacity')}]} key={'calendar' + calendar.id}>
          <Text style={styles.text}>{calendar.summary}</Text>
          <Text style={styles.text}>{calendar.start.dateTime}</Text>
        </View>
      );
    } else {
      calendarView = (<View></View>);
    }
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.title}>Calendar</Text>
          <Image source={require('image!calendar')} style={styles.image} />
        </View>
        {calendarView}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  image: {
    height: 40,
    width: 40
  },
  title: {
    marginRight: 15,
    color: '#fff',
    fontSize: Styles.fontSize.medium
  },
  calendar: {
    opacity: 0
  },
  text: {
    color: '#fff',
    fontSize: Styles.fontSize.small,
    textAlign: 'right'
  }
});

module.exports = CalendarView;
