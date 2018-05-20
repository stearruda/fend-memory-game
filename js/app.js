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
let showingPairResult = false;
//
let matchedCards;
//
let moves;
//
let timerId;


/* 
* * START/RESET Game * * 
*/
function restartGame(){
	createCards();
	resetMatchedCards();
	createDeck();
	clearMoves();
	clearTimer();
	showStars();
}

function setUpButtonEvents(){
	
	const restartButton = document.querySelector('.restart i');
	restartButton.addEventListener('click', function(){
		restartGame();
		console.log('Restart!');
	})

	const playAgainButton = document.querySelector('.button');
	playAgainButton.addEventListener('click', function() {
		restartGame();
		const modal = document.getElementById('modal-endgame');
		modal.classList.remove('show');
	});
}

function initGame(){
	setUpButtonEvents();
	restartGame();
}

window.onload = initGame;


function createCards(){
	const symbols = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'];
	// TESTE PARA END GAME >>> Remove after test
	//const symbols = ['diamond', 'anchor'];
	cards = [...symbols, ...symbols];
	cards = shuffle(cards);
}


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
function showTime(min, sec){
	document.getElementById('timer').innerHTML = `${('0' + min).slice(-2)} : ${('0' + sec).slice(-2)}`;	    	
}

function scheduleTimerIfNeeded(){
	if (timerId === null) {
		// timer starts
		let min = 0;
		let sec = 0;
		timerId = setInterval(function(){
	    	sec++;
	    	if (sec > 59) {
	        	sec = 0;
	        	min++;
	    	}
	    	showTime(min, sec);
		}, 1000);
	} 
}

function clearTimer(){
	clearInterval(timerId);
	showTime(0, 0);
	timerId = null;
}

/* 
* * Move COUNTER * * 
*/

function showMoves(){
	const counterBox = document.querySelector('.score-panel span.moves');
	counterBox.innerHTML = moves;
}

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
	const starPanel = document.querySelectorAll('ul.stars li i');
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
	const cardStillNotMatched = !matchedCards.includes(index);
	const notShowingAnimation = showingPairResult === false;
	const sameCardClicked = firstCardOpened === index;
	const shouldHandleClick = cardStillNotMatched && notShowingAnimation && !sameCardClicked;  
	if (shouldHandleClick) {
		scheduleTimerIfNeeded();
		openCard(e.target);
		handleCardClick(e, index);
	}
}

function openCard(cardElement){
	cardElement.classList.add('open', 'show');
}

function tryToMatch(firstCardIndex, secondCardIndex){
	const symbolsMatch = cards[firstCardIndex] === cards[secondCardIndex]; 
	if (symbolsMatch) {
		match(firstCardIndex, secondCardIndex);
	} else {
		unmatch(firstCardIndex, secondCardIndex);
		// counts the moves
		countMove();
	}
}

function checkEndGame(){
	const allCardsAreMatched = matchedCards.length === cards.length; 
	if (allCardsAreMatched) {
		endGame();
	}
}

function handleCardClick(e, index){
	const oneCardIsAlreadyOpened = firstCardOpened != null; 
	if (oneCardIsAlreadyOpened) {
		tryToMatch(firstCardOpened, index);
	} else {
		firstCardOpened = index;
	}
	showStars();
	checkEndGame();	
}


/* 
* * MATCH * * 
*/
function initNewComparison(){
	firstCardOpened = null;
}

function animateMatch(firstCardIndex, secondCardIndex){
	const cardElements = document.querySelectorAll('li.card');
	const firstCardClasses = cardElements[firstCardIndex].classList; 
	firstCardClasses.add('match');
	firstCardClasses.remove('show', 'open');

	const secondCardClasses = cardElements[secondCardIndex].classList; 
	secondCardClasses.add('match');
	secondCardClasses.remove('show', 'open');
}

function match(firstCardIndex, secondCardIndex){
	matchedCards.push(firstCardIndex);
	matchedCards.push(secondCardIndex);

	animateMatch(firstCardIndex, secondCardIndex);
	initNewComparison();	
}


/* 
* * UNMATCH * * 
*/
function unmatch(firstCardIndex, secondCardIndex){
	console.log('no match!');
	let cardElements = document.querySelectorAll('li.card');
	cardElements[firstCardIndex].classList.add('unmatch');
	cardElements[secondCardIndex].classList.add('unmatch');

	showingPairResult = true;
	setTimeout(function(){
        cardElements[firstCardIndex].classList.remove('show', 'open', 'unmatch');
        cardElements[secondCardIndex].classList.remove('show', 'open', 'unmatch');        
        showingPairResult = false;
    },1100);

	initNewComparison();
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


function resetMatchedCards(){
	matchedCards = [];
	firstCardOpened = null;
}


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
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */