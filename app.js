/* global firebase */
const firebaseConfig = {
  apiKey: 'AIzaSyCKj7jge9Vq__aZN9CEdsiWwgTYjW2GOTk',
  authDomain: 'joke-a-tron-9000-99123.firebaseapp.com',
  projectId: 'joke-a-tron-9000-99123',
  storageBucket: 'joke-a-tron-9000-99123.appspot.com',
  messagingSenderId: '842807512042',
  appId: '1:842807512042:web:26a94beca6acd9970c4093',
  measurementId: 'G-C4XDW252BW'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

// ----
// DATA
// ----

// A couple jokes to start with
const jokes = {}

// The message to display if the jokes object is empty
const noJokesMessage = 'I... I don\'t know any jokes. 😢'

// -------------
// PAGE UPDATERS
// -------------

// Update the listed jokes, based on the jokes object
const jokesMenuList = document.getElementById('jokes-menu')
const updateJokesMenu = function () {
  // Don't worry too much about this code for now.
  // You'll learn how to do advanced stuff like
  // this in a later lesson.
  const jokeKeys = Object.keys(jokes)
  const jokeKeyListItems = jokeKeys.join('</li><li>') || noJokesMessage
  jokesMenuList.innerHTML = '<li>' + jokeKeyListItems + '</li>'
}

// Update the displayed joke, based on the requested joke
const requestedJokeInput = document.getElementById('requested-joke')
const jokeBox = document.getElementById('joke-box')
const updateDisplayedJoke = function () {
  const requestedJokeKey = requestedJokeInput.value
  if (jokes[requestedJokeKey]) {
    const joke = jokes[requestedJokeKey]
    jokeBox.innerHTML = '<p>' + joke.setup + '</p><p>' + joke.punchline + '</p>'
  } else {
    jokeBox.textContent = 'I don\'t know that joke...'
  }
}

// Add a new joke
const rememberJokeKey = document.getElementById('remember-joke-key')
const rememberJokeSetup = document.getElementById('remember-joke-setup')
const rememberJokePunchline = document.getElementById('remember-joke-punchline')
const rememberJokeButton = document.getElementById('remember-joke-button')
const rememberJoke = function () {
  const key = rememberJokeKey.value
  const setup = rememberJokeSetup.value
  const punchline = rememberJokePunchline.value
  if (key.trim().length > 0) {
    db.collection('jokes').doc(key).set({
      setup: setup,
      punchline: punchline
    })
  }
}

// Delete a joke
const forgetJokeKey = document.getElementById('forget-joke-key')
const forgetJokeButton = document.getElementById('forget-joke-button')
const forgetJoke = function () {
  const key = forgetJokeKey.value
  if (key.length > 0) {
    db.collection('jokes').doc(key).delete()
  }
}

// Function to keep track of all other
// page update functions, so that we
// can call them all at once
const updatePage = function () {
  updateJokesMenu()
  updateDisplayedJoke()
}

// -------
// STARTUP
// -------

db.collection('jokes')
  .onSnapshot(function (snapshot) {
    snapshot.docChanges().forEach(function (change) {
      const joke = change.doc.data()
      if (change.type === 'added') {
        jokes[change.doc.id] = joke
      } else if (change.type === 'modified') {
        jokes[change.doc.id] = joke
      } else if (change.type === 'removed') {
        delete jokes[change.doc.id]
      }
    })
    updatePage()
  })

// ---------------
// EVENT LISTENERS
// ---------------

// Keep the requested joke up-to-date
requestedJokeInput.addEventListener('input', updateDisplayedJoke)
rememberJokeButton.addEventListener('click', rememberJoke)
forgetJokeButton.addEventListener('click', forgetJoke)
