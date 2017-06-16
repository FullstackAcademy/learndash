const firebase = require('firebase')

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyCXto9gID3mK91DuZqujXhSbQghcOyas7M',
  authDomain: 'learndash-4ea0a.firebaseapp.com',
  databaseURL: 'https://learndash-4ea0a.firebaseio.com',
  projectId: 'learndash-4ea0a',
  storageBucket: 'learndash-4ea0a.appspot.com',
  messagingSenderId: '732832856046'
}

firebase.initializeApp(config)
module.exports = firebase
