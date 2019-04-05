/* ------------------------------------------- REQUIREMENTS -------------------------------------------------------
1) Create a list that holds all of your cards
2) Display the cards on the page
    - shuffle the list of cards using the provided "shuffle" method below
    - loop through each card and create its HTML
    - add each card's HTML to the page
3) Set up the event listener for a card. If a card is clicked:
    - display the card's symbol (put this functionality in another function that you call from this one)
    - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
    - if the list already has another card, check to see if the two cards match
        + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
        + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
        + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
        + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
  ----------------------------------------------------------------------------------------------------------------- */
// Global scope bindings

// let binding to track matched pairs during game play
let cardPairsMatched = 0;

 // let binding to track timer interval
let timerId;

// let binding to check whether timer is active
let isTimerActive = true;

// let binding to track current game play time

let currentTimer = 0;

// let binding to track array of clicked cards
let toggledCards = [];

// let binding to track complete game moves
let moveCount = 0;

/*
const binding that selects the first element with the class 'deck' to:
1) add event listener for event delegation
2) add shuffled elements to parent
*/
const cardDeck = document.querySelector('.deck');


// Listeners

// const binding that selects the modal close button
const modalCloseButton = document.querySelector('.modal-button-close');
// add click listener that calls toggleModal function
modalCloseButton.addEventListener('click', () => {
    toggleModal();
});

// const binding that selects the modal replay button
const modalReplayButton = document.querySelector('.modal-button-replay');
// add click listener that calls replayGame function
modalReplayButton.addEventListener('click', () => {
    replayGame();
});

// const binding that selects the restart element
const gameRestart = document.querySelector('.score-panel .restart');
// add click listener that calls resetGame function
gameRestart.addEventListener('click', () => {
    resetGame();
});

// adding event listener to cardDeck that listens for a click event with a listener function that passes the event object as event1
cardDeck.addEventListener('click', function(event1) {
    // local binding for event object target to event1ObjectTarget
    const event1ObjectTarget = event1.target;
    // check if event oject target can be played by passing the event1ObjectTarget to the checkCardPlay function
    if (checkCardPlay(event1ObjectTarget)) {
        if (isTimerActive) {
            startTimer();
            isTimerActive = false;
        }
        // if the condition is true, run the toggleCard function passing the binding event1ObjectTarget as the argument
        toggleCard(event1ObjectTarget);
        // run the addToggledCard function passing the binding event1ObjectTarget as the argument
        addToggledCard(event1ObjectTarget);
        // check if the toggledCards array has a length of 2
        if (toggledCards.length == 2) {
            // if the condition is true, run the checkToggledCardsMatch function passing the binding event1ObjectTarget as the argument
            checkToggledCardsMatch(event1ObjectTarget);
            // run the addMove function in the local scope
            addMove();
            // run the toggleStar function in the local scope
            checkMoveCount();
        }
    }
});


// Functions

// arrow function that has no parameters
const gameInit = () => {
    // call shuffleCardDeck function
    shuffleCardDeck();
    // call resetCardDeck function
    resetCardDeck();
    // call resetMoveCount function
    resetMoveCount();
};

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

// arrow function that has no parameters
const shuffleCardDeck = () => {
    // select all of the li elements under the element with the class deck -- returns a nodeList
    const cardsToShuffleNodeList = document.querySelectorAll('.deck li');
    // convert the NodeList to an array
    const cardsToShuffleArray = Array.from(cardsToShuffleNodeList);
    // shuffle the cardsToShuffleArray
    const shuffledCardsArray = shuffle(cardsToShuffleArray);
    // for each card of the shuffledCardsArray
    for (card of shuffledCardsArray) {
        // to the global variable cardDeck append each card
        cardDeck.appendChild(card);
    }
};

// arrow function that has no parameters
const startTimer = () => {
    // assign interval to global binding timerId
    timerId = setInterval(() => {
        // for each interval
        //increment the global currentTimer binding
        currentTimer ++;
        // set setTimeout callback function to run after 1s
        displayTimer();
    }, 1000);

};

// arrow function that has no parameters 
const stopTimer = () => {
    // call clearInterval function on global timerId binding
    clearInterval(timerId);
};

// arrow function that has no parameters
const displayTimer = () => {
    // select timer element
    const timerSelect = document.querySelector('.timer');
    // calculate hours based on global binding currentTimer
    const hours = Math.floor(currentTimer / 3600);
    // calculate minutes based on global binding currentTimer  
    const minutes = Math.floor((currentTimer - (hours * 3600)) / 60);
    // calculate seconds based on global binding currentTimer
    const seconds = currentTimer - (hours * 3600) - (minutes * 60);

    // assign hours to hh with inline conditional checking value of hours, appending a "0" if hours is less than 10, and
    // converting hours value to strings for both T/F.
    let hh = hours < 10 ? "0" + hours.toString() : hours.toString();
    // assign minutes to mm with inline conditional checking value of minutes, appending a "0" if minutes is less than 10, and
    // converting minutes value to strings for both T/F.
    let mm = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
    // assign seconds to ss with inline conditional checking value of seconds, appending a "0" if seconds is less than 10, and
    // converting seconds value to strings for both T/F.
    let ss = seconds < 10 ? "0" + seconds.toString() : seconds.toString();

    // update the selected timer element innerHTML value to be a string literal that points to the values of hh, mm, and ss.
    timerSelect.innerHTML = `${hh}:${mm}:${ss}`;
};

/*
arrow function that has one parameter, eventObjectTarget, that returns true if the event object target

1) contains the card class
2) does not contain the match class
3) the toggledCards array has a length less than 2
4) the toggledCards array does not include the event object target 
*/
const checkCardPlay = eventObjectTarget => {
    return (
        eventObjectTarget.classList.contains('card') &&
        !eventObjectTarget.classList.contains('match')
        && toggledCards.length < 2 &&
        !toggledCards.includes(eventObjectTarget)
        );
};

// arrow function that has no parameters 
const checkToggledCardsMatch = () => {
    // local binding to set maximum card pairs
    const cardPairs = 8;
    // compare the two items in the toggledCards array
    if (toggledCards[0].firstElementChild.classList[1] === toggledCards[1].firstElementChild.classList[1]) {
        // if the condition is true, toggle the match class for each item
        toggledCards[0].classList.toggle('match');
        toggledCards[1].classList.toggle('match');
        toggledCards[0].classList.add('animated', 'heartBeat');
        toggledCards[1].classList.add('animated', 'heartBeat');
        // then empty the toggledCards array
        toggledCards = [];
        // increment global binding cardPairsMatched
        cardPairsMatched ++;
        // check if cardPairsMatched is strictly equal to cardPais
        if (cardPairsMatched === cardPairs){
            // if true
            // set setTimeout callback function to run after .750s
            setTimeout(() => {
                // call gameEnd function
                gameEnd();
            }, 750);
        }
    }
    else {
        // if the condition is not true
        toggledCards[0].classList.add('animated', 'wobble');
        toggledCards[1].classList.add('animated', 'wobble');
        toggledCards[0].style.backgroundColor = 'red';
        toggledCards[1].style.backgroundColor = 'red';
     
        // set setTimeout callback function to run after 1s
        setTimeout(() => { 
            // run the toggleCard function for each item in the toggleCards array
            toggledCards[0].classList.remove('animated', 'wobble');
            toggledCards[1].classList.remove('animated', 'wobble');
            toggleCard(toggledCards[0]);
            toggledCards[0].style.backgroundColor = '';
            toggleCard(toggledCards[1]);
            toggledCards[1].style.backgroundColor = '';    
            // then empty the toggleCards array
            toggledCards = [];
        }, 1000);
    }
};

// arrow function that has no parameters
const addMove = () => {
    // increments global moveCount binding
    moveCount ++;
    // local binding that selects the element with class moves that is within an element with class score-panel
    const moveInnerHTML = document.querySelector('.score-panel .moves');
    // select innerHtml of selected element and set it's value to the value at the global moveCount binding
    moveInnerHTML.innerHTML = moveCount;
};

// arrow function that has no parameters
const checkMoveCount = () => {
    // checks whether moveCount gloabl binding has a value of either 11 or 17
    if (moveCount == 11 || moveCount == 17) {
        // if true run the toogleStart function in the local scope
        toggleStar();
    }
};

// arrow function that has no parameters
const toggleStar = () => {
    // local binding that selects all of the li elements under the element with the class 'deck'
    const starsNodeList = document.querySelectorAll('.stars li');
    // for each item in starsNodeList
    for (star of starsNodeList) {
        // check if opacity is not set to .10
        if (star.style.opacity != .10) {
            // if true
            // set opacity to .10
             star.style.opacity = .10;
             // break out of loop so that all stars are not toggled at once
             break;
        }
    }
};

// arrow function that has one parametereventObjectTarget
const toggleCard = eventObjectTarget => {
    // for event oject target toggle the 'open' class
    eventObjectTarget.classList.toggle('open');
    // for event oject target toggle the 'show' class
    eventObjectTarget.classList.toggle('show');
 };

// arrow function that has one parameter, eventObjectTarget
const addToggledCard = eventObjectTarget => {
    // push to the toggledCards global binding the first classList child of the first element child of the event object target.
    toggledCards.push(eventObjectTarget);
};

// arrow function that has no parameters
const toggleModal = () => {
    // local binding to select the element with 'modal' class
    const modal = document.querySelector('.modal');
    // check if selected element does not style display value of 'block'
    if (modal.style.display != 'block') {
        // if true
        // set style display value to 'block' 
        modal.style.display = 'block';
    } else {
        // else set style display to to 'none'
        modal.style.display = 'none';
    }
};

// arrow function that has no parameters
const gameStatsToModal = () => {
    // local binding to select element with 'modal-time' class that is within the element with the 'game-stats' class
    const modalTime = document.querySelector('.game-stats .modal-time');
    // local binding to select element with 'timer' class that is within the element with the 'score-panel' class
    const gameTime = document.querySelector('.score-panel .timer');
    // local binding to set the value of the innerHTML of gameTime
    const gameTimeInnerHTML = gameTime.innerHTML;
    // set modalTime innerHTML using the template literal that calls the gameTimeInnerHTML
    modalTime.innerHTML = `<strong>GAME TIME</strong><br><em>${gameTimeInnerHTML}</em>`;

    // local binding to select element with 'modal-moves' class that is within the element with the 'game-stats' class
    const modalMoves = document.querySelector('.game-stats .modal-moves');
    // set modalMoves innerHTML using the template literal that calls the global binding moveCount
    modalMoves.innerHTML = `<strong>MOVES</strong><br><em>${moveCount}</em>`;

    // local binding to select element with 'modal-stars' class that is within the element with the 'game-stats' class
    const modalStars = document.querySelector('.game-stats .modal-stars');

    const gameStars = document.querySelector('.score-panel .stars');
    // set modalStars innerHTML to the innerHTML at local binding gameStars
    modalStars.innerHTML = gameStars.innerHTML;
};

// arrow function that has no parameters
 const resetGame = () => {
    // call resetTimer function
    resetTimer();
    // call resetMoveCount function
    resetMoveCount();
    // call resetToggledStars function
    resetToggledStars();
    // call resetCardDeck function
    resetCardDeck();
    // call shuffleCardDeck function
    shuffleCardDeck();
 };

// arrow function that has no parameters
 const resetTimer = () => {
    // call stopTimer function
    stopTimer();
    // set global binding value to true
    isTimerActive = true;
    // set global binding value to 0
    currentTimer = 0;
    // call displayTimer function
    displayTimer();
 };

// arrow function that has no parameters
 const resetMoveCount = () => {
    // set global binding to 0
    moveCount = 0;
    // select the innerHTML of the element with 'moves' class that is within element that has 'score-panel' class
    // set the innerHTML to moveCount
    document.querySelector('.score-panel .moves').innerHTML = moveCount;
 };

// arrow function that has no parameters
 const resetToggledStars = () => {
    // local binding that selects all of the li elements under the element with the class 'deck'
    const starsNodeList = document.querySelectorAll('.stars li');
    // for each item in starsNodeList
    for (star of starsNodeList) {
        // set style opacity to 1
        star.style.opacity = 1;
    }
 };

// arrow function that has no parameters
 const gameEnd = () => {
    // call stopTimer function
    stopTimer();
    // call toggleModal function
    toggleModal();
    // call gameStatsToModal function
    gameStatsToModal();
 };

// arrow function that has no parameters
 const replayGame = () => {
    // call resetGame function
    resetGame();
    // call toggleModal function
    toggleModal();
    // set global binding to 0
    cardPairsMatched = 0;
 };

 // arrow function that has no parameters
 const resetCardDeck = () => {
    // local binding that selects all of the li elements under the element with the class 'deck'
    const starsNodeList = document.querySelectorAll('.deck li');
    // for each item of starsNodeList
    for (card of starsNodeList) {
        // set the element className property to have only 'card'
        card.className = 'card';
    }
    // set global binding to 0
    cardPairsMatched = 0;
 };

 // call gameInit to initialize game
gameInit();