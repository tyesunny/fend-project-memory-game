/*
 *  Follwing codes will be executed after all DOMs are rendered on window
 */

/*
 *  Constants
 */

const DECK_SIZE = 16;
const CARD_DISPLAY_TIME = 1000;
const STAR_MAXIMUM = 3
const STAR_DROPPING_RATE = 8;
let openedCard = [];
let matchedCard = [];
let counter = 0;
let cards =   [ "fa fa-diamond",
                "fa fa-paper-plane-o",
                "fa fa-anchor",
                "fa fa-bolt",
                "fa fa-cube",
                "fa fa-leaf",
                "fa fa-bicycle",
                "fa fa-bomb",
                "fa fa-diamond",
                "fa fa-paper-plane-o",
                "fa fa-anchor",
                "fa fa-bolt",
                "fa fa-cube",
                "fa fa-leaf",
                "fa fa-bicycle",
                "fa fa-bomb",    ];    // name of cards, must be in pairs!

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle cards
cards = shuffle(cards);
// Create deck DOM
const deck = document.createElement('ul');
deck.className = "deck";
for(let i = 0; i < DECK_SIZE; i++) {
  // In each loop, create a cardWrapper with a card and append the wrapper to deck
  const cardWrapper = document.createElement("li");
  cardWrapper.className = "card";
  cardWrapper.appendChild(createCard(cards[i]))
  deck.appendChild(cardWrapper);
}
// Paint the DOM onto html page
container = document.querySelector("div.container")
container.appendChild(deck);
// Start timer
startTime = Date.now();
timerInterval = setInterval(function() {
    totalTime = Date.now() - startTime;
    formattedTime = formatTime(totalTime);
    document.querySelector("span.timer").textContent = `${formattedTime.minutes}:${formattedTime.seconds}`;
}, 1000);


/*
 * set up the event listener for a card. If a card is clicked
 */

deck.addEventListener("click", function functionName(e) {
  const selectedCard = e.target;
  // check if the card not the others were clicked
  if((selectedCard.nodeName.toLowerCase() === 'li') && (selectedCard.className === "card")) {
    // display the card and insert it into the openedCard list
    displayCard(e.target);
    openedCard.push(selectedCard);
    if(openedCard.length == 2) {
      // if two cards are opened, check if they match
      if(isSameCard(openedCard[0],openedCard[1])) {
        console.log("same card.");
        // move the matched cards to matchedCard list
        matchedCard.push(openedCard.pop());
        matchedCard.push(openedCard.pop());
      }
      else {
        console.log("different card");
        // hide and empty opened card
        hideCard(openedCard.pop());
        hideCard(openedCard.pop());
      }
      // check if game won.
      if(matchedCard.length === DECK_SIZE) {
        // game won, stop timer
        clearInterval(timerInterval);
        // calculate number of stars won
        starAcq = counterToStars(counter);
        // render congrat modal
        displayCongratModal(starAcq, formattedTime);
      }
      else {
        // update counters
        counter += 1;
        // render counters
        document.querySelector("span.moves").textContent = counter;
        // render stars every STAR_DROPPING_RATE moves
        if ((counter % STAR_DROPPING_RATE) === 0) {
          stars = document.querySelector("ul.stars")
          stars.removeChild(stars.lastElementChild);
        }
      }
    }
  }
});

/*
 * set up the event listener for a restart button.
 * button clicked ==> refresh the page
 */
document.querySelector("div.restart").addEventListener('click', function () {
  location.reload();
})

/*
 * set up the event listener for a close buttom.
 * button clicked ==> refresh the page
 */
document.querySelector("button.close").addEventListener('click', function () {
  location.reload();
})

/*
 * utility functions ==> rendering
 */

// This function creates <i></i> DOM to represent card
function createCard(cardName) {
 const newCard = document.createElement('i');
 newCard.className = cardName;
 return newCard;
}

// flip the card through CSS class
function displayCard(cardWrapper) {
  cardWrapper.className = "card open show";
}

// flip the card through CSS class, set timeout = 1ms allowing card to be displayed
function hideCard(cardWrapper) {
  setTimeout(function() {
    cardWrapper.className = "card";
  }, CARD_DISPLAY_TIME)
}

// generate congrat modal
function displayCongratModal(starAcq, formattedTime) {
  // prepare modal
  paraCongrat = document.createElement('p');
  paraInstruction = document.createElement('p');
  // insert number of stars acquired
  paraCongrat.textContent = `Congrat! You won ${starAcq} stars in ${formattedTime.minutes}:${formattedTime.seconds}!`;
  paraInstruction.textContent = "Click the X to start a new game.";
  document.querySelector("div.modal-content").appendChild(paraCongrat);
  document.querySelector("div.modal-content").appendChild(paraInstruction);
  // display modal
  document.querySelector("div.modal").style.display = "block"
}


/*
 * utility functions ==> logic
 */


// counter to stars
function counterToStars(counter) {
  const starAcq = STAR_MAXIMUM-parseInt(counter/STAR_DROPPING_RATE);
  // if starAcq > 0 return starAcq otherwise return 0
  return starAcq > 0 ? starAcq : 0;

}

// compare if two cards are same
function isSameCard(cardWrapper1,cardWrapper2) {
  return (cardWrapper1.firstChild.className === cardWrapper2.firstChild.className)
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


/**
 * This function is from project: https://github.com/egarat/fend-memory-game
 * as of 1/6/2018
 * @function formatTime
 * @description Converts miliseconds to an object separated as minutes and seconds (if seconds < 10, then it has a preceding 0)
 * @param {number} ms - Time to convert to an object
 * @returns {Object} with two properties (minutes, seconds)
 */
const formatTime = function(ms) {
    // Convert ms to s
    const unformattedSeconds = Math.floor(ms / 1000);
    // If applies, extract amount of minutes
    const minutes = unformattedSeconds >= 60 ? Math.floor(unformattedSeconds / 60) : 0;
    // Removing the minutes and get the rest of the time as seconds
    const seconds = minutes > 0 ? unformattedSeconds - (minutes * 60) : unformattedSeconds;

    return {
        minutes,
        seconds: seconds < 10 ? '0' + seconds : seconds
    };
};
