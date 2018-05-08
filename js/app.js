/*
 * GLOBAL VARIABLES
 */

// list of symbols used: 8
let symbols = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'];
// cards of the deck: 16
let cards = [...symbols, ...symbols];
// 
let firstCardOpened = null;
// check if we are showing an unmatched pair to the user
let showingUnmatchedCards = false;
//
let matchedCards = [];
//
let moveCounter = 1;


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
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

// timer
function timer(){
	let min = 0;
	let sec = 0;
	let timer = setInterval(function(){
    	document.getElementById('timer').innerHTML = `${('0' + min).slice(-2)} : ${('0' + sec).slice(-2)}`;
    	sec++;
    	if (sec > 59) {
        	sec = 0;
        	min++;
    	}

	}, 1000);
}


/* 
* * CLICK * * 
*/

function onCardClick(e, index){
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
					}
				} else {
					firstCardOpened = index;
				}
			}
		}
	}

	// counts the moves
	let counter = document.querySelector('span.moves');
	let moves = moveCounter++;
	counter.textContent = moves;
	debugger;

	// star rating
	let starPanel = document.querySelectorAll('ul.stars li i');

	if (moves === 12) {
		starPanel[2].setAttribute('class', 'fa fa-star-o');
		console.log('2 stars!');
	} else if (moves === 22) {
		starPanel[1].setAttribute('class', 'fa fa-star-o');
		console.log('1 star!');
	} else if (moves === 32) {
		starPanel[0].setAttribute('class', 'fa fa-star-o');
		console.log('Game over! Try Again!');
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


	return timer();
}


window.onload = restart;


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