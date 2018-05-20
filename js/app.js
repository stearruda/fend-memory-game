/*
 * GLOBAL VARIABLES
 */
// TESTE PARA END GAME >>> Remove after test
//symbols = ['diamond', 'anchor'];
// cards of the deck: 16
let cards;
// 
let firstCardOpened;
// check if we are showing an unmatched pair to the user
let showingUnmatchedCards;
//
let matchedCards;
//
let moves;
//
let timerStarted;
//
let timerId;
//
let starPanel;


function initGame(){
	// list of symbols used: 8
	let symbols = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'];
	// TESTE PARA END GAME >>> Remove after test
	symbols = ['diamond', 'anchor'];
	cards = [...symbols, ...symbols];
	firstCardOpened = null;
	// check if we are showing an unmatched pair to the user
	showingUnmatchedCards = false;
	matchedCards = [];
	moves = 0;
	timerStarted = false;
	starPanel = document.querySelectorAll('ul.stars li i');

	restart();
}

window.onload = initGame;


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

/* 
* * SHUFFLE CARDS * * 
*/
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


/* 
* * TIMER * * 
*/
function scheduleTimer(){
	let min = 0;
	let sec = 0;
	timerId = setInterval(function(){
    	document.getElementById('timer').innerHTML = `${('0' + min).slice(-2)} : ${('0' + sec).slice(-2)}`;
    	sec++;
    	if (sec > 59) {
        	sec = 0;
        	min++;
    	}
	}, 1000);
}


function showMoves(){
	const counterBox = document.querySelector('.score-panel span.moves');
	counterBox.innerHTML = moves;
}

/* 
* * COUNTER * * 
*/
function countMove(){
	moves++;
	showMoves();
}

function clearMoves(){
	moves = 0;
	showMoves();
}

/* 
* * STAR RATING * * 
*/
function showStars() {
	starPanel[2].setAttribute('class', 'fa fa-star');
	starPanel[1].setAttribute('class', 'fa fa-star');
	starPanel[0].setAttribute('class', 'fa fa-star');

	let stars = calculateStars();

	if (stars < 3) {
		starPanel[2].setAttribute('class', 'fa fa-star-o');
	}

	if (stars < 2) {
		starPanel[1].setAttribute('class', 'fa fa-star-o');
	}

	if (stars < 1) {
		starPanel[0].setAttribute('class', 'fa fa-star-o');
	}
}

function calculateStars() {
	if (moves >= 0 && moves < 12) {
		return 3;
	} else if (moves < 22) {
		return 2;
	} else if (moves < 32) {
		return 1;
	} else {
		return 0;
	}
}


/* 
* * CLICK * * 
*/
function onCardClick(e, index){
	if (!timerStarted) {
		// timer starts
		scheduleTimer();
		timerStarted = true;
	} 

	if (!matchedCards.includes(index)) {
		if(showingUnmatchedCards === false) {
			if (firstCardOpened != index) {
				e.target.classList.toggle('open');
				e.target.classList.toggle('show');
				if (firstCardOpened != null) {
					if (cards[index] === cards[firstCardOpened]) {
						match(index);
					} else {
						unmatch(index);
						// counts the moves
						countMove();
						console.log(`${moves} moves`);
					}
				} else {
					firstCardOpened = index;
				}
			}
		}
	}

	// how many stars during the game
	showStars();

	//ending game
	if (matchedCards.length === cards.length) {
		endGame();
	}
}


/* 
* * MATCH * * 
*/
function match(secondCardOpened){
	console.log('match!');
	let cardElements = document.querySelectorAll('li.card');
	cardElements[firstCardOpened].classList.add('match');
	cardElements[secondCardOpened].classList.add('match');
	cardElements[firstCardOpened].classList.remove('show', 'open');
	cardElements[secondCardOpened].classList.remove('show', 'open');
	matchedCards.push(firstCardOpened);
	matchedCards.push(secondCardOpened);
	firstCardOpened = null;
}


/* 
* * UNMATCH * * 
*/
function unmatch(secondCardOpened){
	console.log('no match!');
	let cardElements = document.querySelectorAll('li.card');
	cardElements[firstCardOpened].classList.add('unmatch');
	cardElements[secondCardOpened].classList.add('unmatch');

	showingUnmatchedCards = true;
	setTimeout(function(){
        cardElements[firstCardOpened].classList.remove('show', 'open', 'unmatch');
        cardElements[secondCardOpened].classList.remove('show', 'open', 'unmatch');
        firstCardOpened = null;
        showingUnmatchedCards = false;
    },1100);

}

function createDeck(){
	let deckUl = document.querySelector('ul.deck');
	deckUl.innerHTML = '';
	for (let i = 0; i < cards.length; i++){
		let card = cards[i];
		let cardLi = document.createElement('li');
		cardLi.setAttribute('class', 'card');
		cardLi.innerHTML = '<i class="fa fa-' + card + '"></i>';
		let cardClicked = function(e){
			onCardClick(e, i);
		}
		cardLi.addEventListener('click', cardClicked);
		deckUl.appendChild(cardLi);
	}
}

function clearTimer(){
	clearInterval(timerId);
	document.getElementById('timer').innerHTML = `00 : 00`;
	timerStarted = false;
}

function resetMatchedCards(){
	matchedCards = [];
}

/* 
* * RESET/START * * 
*/
function restart(){
	resetMatchedCards();
	cards = shuffle(cards);
	clearMoves();
	clearTimer();
	createDeck();
	showStars();
}

// restart game
let restartButton = document.querySelector('.restart i');
restartButton.addEventListener('click', function(){
	restart();
	console.log('Restart!');
})

/* 
* * MODAL * * 
*/

function showModal() {
	const modal = document.getElementById('modal-endgame');
	modal.classList.add('show');
}


/* 
* * END GAME * * 
*/
function endGame() {
	clearInterval(timerId);
	showModal();

	let modalMoves = document.querySelector('.modal-moves');
	let modalStars = document.querySelector('.modal-stars');
	let modalTime = document.querySelector('.modal-time');
	let stars = calculateStars();

	modalMoves.innerHTML = `Moves ${moves}`;
	modalStars.innerHTML = `${stars} Stars`;
	modalTime.innerHTML = `${timer.textContent}`;

	console.log('You won!');
}



/* 
* * PLAY AGAIN BUTTON * * 
*/
const playAgainButton = document.querySelector('.button');
playAgainButton.addEventListener('click', function() {
	restart();
	const modal = document.getElementById('modal-endgame');
	modal.classList.remove('show');
});


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */