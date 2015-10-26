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
  var date_min = (new Date()).toISOString();
  return fetch('https://www.googleapis.com/calendar/v3/calendars/' + calendar_id +'/events?fields=items(summary,id,location,start)&timeMin=' + date_min)
  .then(function (response) {
    return response.json();
  });
}

var CalendarView = React.createClass({
  mixins: [TweenState.Mixin],
  getInitialState: function () {
    return {events: [], event: 0};
  },
  rotate: function () {
    var next = this.state.event + 1;
    if (next === this.state.events.length) {
      next = 1;
    }
    this.state.event = next;
    this.setState(this.state);
    this.fade(1);
  },
  fade: function (fadeDirection) {
    this.tweenState('opacity', {
      easing: TweenState.easingTypes.linear,
      duration: 4000,
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
    getGCalendar(this.props.calendar_id).then(function (events) {
      this.setState({events: events.items, event: 1});
      this.fade(1);
    }.bind(this));
  },
  render: function () {
    var event = this.state.events[this.state.event],
        calendarView;
    if (event && event.start && event.start.dateTime) {
      var eventDateTime = event.start.dateTime.split("T");

      calendarView = (
        <View style={[styles.event, {opacity: this.getTweeningValue('opacity')}]} key={'event' + event.id}>
          <Text style={styles.text}>{event.summary}</Text>
          <Text style={styles.text}>{eventDateTime[1]} @ {event.location}</Text>
        </View>
      );
    } else {
      calendarView = (<View><Text style={styles.title}></Text></View>);
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
