// Initialize Firebase
var config = {
  apiKey: 'AIzaSyD0ad33Xon8PkZqbtm5mBVTRlX-ONT-Nzg',
  authDomain: 'joke-a-tron-9000.firebaseapp.com',
  databaseURL: 'https://joke-a-tron-9000.firebaseio.com',
  projectId: 'joke-a-tron-9000',
  storageBucket: 'joke-a-tron-9000.appspot.com',
  messagingSenderId: '87962746854'
}
firebase.initializeApp(config)
firebase.auth().signInAnonymously()

// ----
// DATA
// ----

// A couple jokes to start with
var jokes = {
  'the horse': {
    setup: 'A horse walks into the bar. The bartender asks...',
    punchline: 'Why the long face?'
  },
  'Orion\'s pants': {
    setup: 'How does Orion keep his pants up?',
    punchline: 'With an asteroid belt.'
  }
}

// The message to display if the jokes object is empty
var noJokesMessage = 'I... I don\'t know any jokes. 😢'

// -------------
// PAGE UPDATERS
// -------------

// Update the listed jokes, based on the jokes object
var jokesMenuList = document.getElementById('jokes-menu')
var updateJokesMenu = function () {
  // Don't worry too much about this code for now.
  // You'll learn how to do advanced stuff like
  // this in a later lesson.
  var jokeKeys = Object.keys(jokes)
  var jokeKeyListItems = jokeKeys.join('</li><li>') || noJokesMessage
  jokesMenuList.innerHTML = '<li>' + jokeKeyListItems + '</li>'
}

// Update the displayed joke, based on the requested joke
var requestedJokeInput = document.getElementById('requested-joke')
var jokeBox = document.getElementById('joke-box')
var updateDisplayedJoke = function () {
  var requestedJokeKey = requestedJokeInput.value.trim()

  if (requestedJokeKey) {
    firebase.database().ref('jokes').child(requestedJokeKey).once('value')
    .then(function (jokeSnapshot) {
      if (jokeSnapshot.exists()) {
        var joke = jokeSnapshot.val()
        jokeBox.innerHTML = '<p>' + joke.setup + '</p><p>' + joke.punchline + '</p'
      } else {
        jokeBox.textContent = noJokesMessage
      }
    })
  } else {
    jokeBox.textContent = noJokesMessage
  }
}

// Remember a joke
var rememberJoke = function () {
  var newJokeKey = document.getElementById('newJokeKey')
  var newJokeSetup = document.getElementById('newJokeSetup')
  var newJokePunchline = document.getElementById('newJokePunchline')

  firebase.database().ref('jokes').child(newJokeKey.value).set({
    setup: newJokeSetup.value,
    punchline: newJokePunchline.value
  })

  newJokeKey.value = ''
  newJokeSetup.value = ''
  newJokePunchline.value = ''
}

// Forget a joke
var forgetJoke = function () {
  var badJokeKey = document.getElementById('badJokeKey')

  firebase.database().ref('jokes').child(badJokeKey.value).remove()

  badJokeKey.value = ''
}

// Function to keep track of all other
// page update functions, so that we
// can call them all at once
var updatePage = function () {
  updateJokesMenu()
  updateDisplayedJoke()
}

// -------
// STARTUP
// -------

// Update the page immediately on startup
updatePage()

// ---------------
// EVENT LISTENERS
// ---------------

// Keep the requested joke up-to-date
requestedJokeInput.addEventListener('input', updateDisplayedJoke)
document.getElementById('remember').addEventListener('click', rememberJoke)
document.getElementById('forget').addEventListener('click', forgetJoke)
