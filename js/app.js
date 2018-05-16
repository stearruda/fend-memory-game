/*
 * GLOBAL VARIABLES
 */

// list of symbols used: 8
let symbols = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'];
// TESTE PARA END GAME >>> Remove after test
//symbols = ['diamond', 'anchor'];
// cards of the deck: 16
let cards = [...symbols, ...symbols];
// 
let firstCardOpened = null;
// check if we are showing an unmatched pair to the user
let showingUnmatchedCards = false;
//
let matchedCards = [];
//
let counterBox = document.querySelector('.score-panel span.moves');
//
let moves = 0;
//
let timerStarted = false;
//
let timerId;
//
let starPanel = document.querySelectorAll('ul.stars li i');


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


/* 
* * COUNTER * * 
*/
function countMove(){
	moves++;
	counterBox.innerHTML = moves;
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
	debugger;
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
	showingUnmatchedCards = true;
	setTimeout(function(){
		let cardElements = document.querySelectorAll('li.card');
        cardElements[firstCardOpened].classList.remove('show', 'open');
        cardElements[secondCardOpened].classList.remove('show', 'open');
        firstCardOpened = null;
        showingUnmatchedCards = false;
    },1100);

}


/* 
* * RESET/START * * 
*/
function restart(){
	cards = shuffle(cards);
	//console.log(shuffledCards);
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

	//clear timer
	clearInterval(timerId);
	document.getElementById('timer').innerHTML = `00 : 00`;
	timerStarted = false;

	//clear moves
	moves = 0;
	counterBox.innerHTML = `0`;

	//Cards that were matched before now can be clicked
	matchedCards = [];
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

	let modalScore = document.querySelector('.modal span.score');
	let stars = calculateStars();
	modalScore.innerHTML = `With ${moves} Moves, ${stars} Stars in ${timer.textContent}`;

	console.log('You won!');
}

window.onload = restart;

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