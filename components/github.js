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

function getGithubNotifications() {
  return fetch('https://api.github.com/notifications?access_token=')
    .then(function(response) {
      return response.json();
    });
}

var GithubView = React.createClass({
  mixins: [TweenState.Mixin],
  getInitialState: function () {
    return {notifications: [], notification: 0};
  },
  rotate: function () {
    var next = this.state.notification + 1;
    if (next === this.state.notifications.length) {
      next = 0;
    }
    this.state.notification = next;
    this.setState(this.state);
    this.fade(1);
  },
  fade: function (fadeDirection) {
    this.tweenState('opacity', {
      easing: TweenState.easingTypes.linear,
      duration: 3000,
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
    getGithubNotifications().then(function (notifications) {
      this.setState({notifications: notifications, notification: 0});
      this.fade(1);
    }.bind(this));
  },
  render: function () {
    var notification = this.state.notifications[this.state.notification],
        notificationView;
        if (notification) {
          notificationView = (
            <View style={[styles.notification, {opacity: this.getTweeningValue('opacity')}]} key={'notification' + notification.id}>
            <Text style={styles.text}>{notification.repository.name}: {notification.subject.title}</Text>
            </View>
          );
        } else {
          notificationView = (<View></View>);
        }

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.title}>Github</Text>
          <Image source={require('image!github')} style={styles.image} />
        </View>
        {notificationView}
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
  text: {
    color: '#fff',
    fontSize: Styles.fontSize.small,
    textAlign: 'right'
  },
  notification: {
    opacity: 0
  }
});


module.exports = GithubView;
