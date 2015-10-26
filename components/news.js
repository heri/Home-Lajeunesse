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

function getNewsArticles() {
  var url = 'http://api.nytimes.com/svc/topstories/v1/world.json?api-key='
  return fetch(url)
    .then(function(response) {
      return response.json();
    });
}

var NewsView = React.createClass({
  mixins: [TweenState.Mixin],
  getInitialState: function () {
    return {articles: [], article: 0};
  },
  rotate: function () {
    var next = this.state.article + 1;
    if (next === this.state.articles.length) {
      next = 0;
    }
    this.state.article = next;
    this.setState(this.state);
    this.fade(1);
  },
  fade: function (fadeDirection) {
    this.tweenState('opacity', {
      easing: TweenState.easingTypes.linear,
      duration: 2000,
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
    getNewsArticles().then(function (articles) {
      this.setState({articles: articles.results, article: 0});
      this.fade(1);
    }.bind(this));
  },
  render: function () {
    var article = this.state.articles[this.state.article],
        articleView;
        if (article) {
          var articleTime = article.updated_date.split("T")[1].split("-")[0];
          articleView = (
            <View style={[styles.article, {opacity: this.getTweeningValue('opacity')}]} key={'article' + article.id}>
              <Text style={styles.text}>{article.subsection}: {article.title}</Text>
              <Text style={styles.text}>@{articleTime}</Text>
            </View>
          );
        } else {
          articleView = (<View></View>);
        }

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.title}>News</Text>
          <Image source={require('image!nytimes')} style={styles.image} />
        </View>
        {articleView}
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
  article: {
    opacity: 0
  }
});


module.exports = NewsView;
