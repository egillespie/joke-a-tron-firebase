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

// The message to display if the jokes object is empty
var noJokesMessage = 'I... I don\'t know any jokes. 😢'

// HTML elements
var requestedJokeInput = document.getElementById('requested-joke')
var jokeBox = document.getElementById('joke-box')
var jokesMenuList = document.getElementById('jokes-menu')

// -------------
// PAGE UPDATERS
// -------------

// Add the joke to the list
var jokeAdded = function (jokeSnapshot) {
  jokesMenuList.innerHTML += '<li>' + jokeSnapshot.key + '</li>'
}

// Set the displayed joke
var jokeChanged = function (jokeSnapshot) {
  setDisplayedJoke(jokeSnapshot.key)
}

// Remove the joke from the list
var jokeRemoved = function (jokeSnapshot) {
  var listItems = document.getElementsByTagName('li')
  for (var i = 0; i < listItems.length; i++) {
    if (listItems[i].textContent === jokeSnapshot.key) {
      listItems[i].parentElement.removeChild(listItems[i])
      if (requestedJokeInput.value === jokeSnapshot.key) {
        setDisplayedJoke('')
      }
      break
    }
  }
}

// Update the listed jokes, based on the jokes object
var updateJokesMenu = function () {
  // Don't worry too much about this code for now.
  // You'll learn how to do advanced stuff like
  // this in a later lesson.
  var jokeKeys = Object.keys(jokes)
  var jokeKeyListItems = jokeKeys.join('</li><li>') || noJokesMessage
  jokesMenuList.innerHTML = '<li>' + jokeKeyListItems + '</li>'
}

// Set displayed joke to a specific value
var setDisplayedJoke = function (jokeKey) {
  requestedJokeInput.value = jokeKey
  updateDisplayedJoke()
}

// Update the displayed joke, based on the requested joke
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
  setDisplayedJoke('')
}

// Forget a joke
var forgetJoke = function () {
  var badJokeKey = document.getElementById('badJokeKey')
  firebase.database().ref('jokes').child(badJokeKey.value).remove()
  badJokeKey.value = ''
}

// -------
// STARTUP
// -------

updateDisplayedJoke()

// ---------------
// EVENT LISTENERS
// ---------------

// Keep the requested joke up-to-date
requestedJokeInput.addEventListener('input', updateDisplayedJoke)
document.getElementById('remember').addEventListener('click', rememberJoke)
document.getElementById('forget').addEventListener('click', forgetJoke)

firebase.database().ref('jokes').on('child_added', jokeAdded)
firebase.database().ref('jokes').on('child_changed', jokeChanged)
firebase.database().ref('jokes').on('child_removed', jokeRemoved)
