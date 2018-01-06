/*
 *  Follwing codes will be executed after all DOMs are rendered on window
 */

// TODO: render win page
// TODO: add timer

/*
 *  Constants
 */

const DECK_SIZE = 16;
const CARD_DISPLAY_TIME = 1000;
const STAR_MAXIMUM = 3
const STAR_DROPPING_RATE = 3;
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
// cards = shuffle(cards);

// Create deck DOM
const deck = document.createElement('ul');
deck.className = "deck";

// In each loop, create a cardWrapper with a card and append the wrapper to deck
for(let i = 0; i < DECK_SIZE; i++) {
 const cardWrapper = document.createElement("li");
 cardWrapper.className = "card";
 cardWrapper.appendChild(createCard(cards[i]))
 deck.appendChild(cardWrapper);
}

// Paint the DOM onto html page
container = document.querySelector("div.container")
container.appendChild(deck);


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
      // check win?
      if(matchedCard.length === DECK_SIZE) {
        starAcq = counterToStars(counter);
        displayCongratModal(starAcq);
      }
      else {
        // update counters
        counter += 1;
        // render counters
        document.querySelector("span.moves").textContent = counter;
        // render stars
        if ((counter % STAR_DROPPING_RATE) === 0) {
          stars = document.querySelector("ul.stars")
          stars.removeChild(stars.lastElementChild);
        }
      }
    }
  }
});

/*
 * set up the event listener for a restart buttom.
 * button clicked ==> refresh the page
 */
document.querySelector("div.restart").addEventListener('click', function () {
  location.reload();
})

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

function displayCongratModal(starAcq) {
  // prepare modal
  paraCongrat = document.createElement('p');
  paraInstruction = document.createElement('p');
  // insert number of stars acquired
  paraCongrat.textContent = "Congrat! You won " + starAcq + " stars!";
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
