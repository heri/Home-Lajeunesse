# Connected-Lajeunesse

View github, weather, calendar and home notifications on an Android Tablet. With speech recognition control and twitter sentiment analysis

## Environment Configuration
`env.js` project root
```json
{
  "forecast": {
    "access_token": "forecast.io token"
  },
  "github": {
    "access_token": ""
  },
  "twitter": {
    "consumer_key": "",
    "consumer_token": "",
    "access_token": "",
    "access_token_secret": ""
  }
}
```

## Build
```
npm install -g react-native-cli
npm install
react-native run-android
```
