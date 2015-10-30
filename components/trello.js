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

function getTrelloCards() {
  return fetch('https://api.trello.com/1/member/herirakotomalala/cards?key=')
    .then(function(response) {
      return response.json();
    });
}

var TrelloView = React.createClass({
  mixins: [TweenState.Mixin],
  getInitialState: function () {
    return {cards: [], card: 0};
  },
  rotate: function () {
    var next = this.state.card + 1;
    if (next === this.state.cards.length) {
      next = 0;
    }
    this.state.card = next;
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
          setTimeout(this.fade.bind(this, 0), 9000);
        }
      }.bind(this)
    });

  },
  componentDidMount: function () {
    getTrelloCards().then(function (cards) {
      this.setState({cards: cards.filter(function(card){return card.subscribed}), card: 0});
      this.fade(1);
    }.bind(this));
  },
  render: function () {
    var card = this.state.cards[this.state.card],
        cardView;
        if (card) {
          cardView = (
            <View style={[styles.card, {opacity: this.getTweeningValue('opacity')}]} key={'card' + card.id}>
            <Text style={styles.text}>{card.name}</Text>
            </View>
          );
        } else {
          cardView = (<View></View>);
        }

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.title}>Trello</Text>
          <Image source={require('image!trello')} style={styles.image} />
        </View>
        {cardView}
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
  card: {
    opacity: 0
  }
});


module.exports = TrelloView;
