/*
 * Create a list that holds all of your cards
 */

let symbols = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'];
let cards = [...symbols, ...symbols];

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

/* 
* * CLICK * * 
*/

function onCardClick(e){
	e.target.classList.toggle('open');
	e.target.classList.toggle('show');
}


/* 
* * RESET/START * * 
*/

function restart(){
	cards = shuffle(cards);
	//console.log(cards);
	let deckUl = document.querySelector('ul.deck');
	deckUl.innerHTML = '';
	for(card of cards){
		let cardLi = document.createElement('li');
		cardLi.setAttribute('class', 'card');
		cardLi.innerHTML = '<i class="fa fa-' + card + '"></i>';
		cardLi.addEventListener('click', onCardClick);
		deckUl.appendChild(cardLi);
	}
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
/*
let firstLiSelected;
let firstSelection;
let secondSelection;


function flip(e) {
	e.target.classList.toggle('open');
	e.target.classList.toggle('show');

	let quantidadeDeAbertos = 0;

	for (let j = 0; j < cards.length; j++) {
		let cardAtualAberto = cards[j].classList.contains('open');
		if(cardAtualAberto) {
			quantidadeDeAbertos++;
		}
		//console.log('card ' + j + ' está aberto ' + cardAtualAberto);
	}
	//console.log('Quantidade de abertos é ' + quantidadeDeAbertos);

	let currentSelection = e.target.getElementsByTagName('i')[0].getAttribute('class');

	if (quantidadeDeAbertos === 1) {
		firstLiSelected = e.target;
		firstSelection = currentSelection;
	} else if (quantidadeDeAbertos === 2) {
		secondSelection = currentSelection;
	}
	//console.log('First Selection is ' + firstSelection);
	//console.log('and Second Selection is ' + secondSelection);

	if (quantidadeDeAbertos === 2) {
		//console.log('vou fazer match');
		if (firstSelection === secondSelection) {
			e.target.classList.add('match');
			firstLiSelected.classList.add('match');
			console.log('deu match!');
		} else {
			
			console.log('não deu match');
		}
	}
}


for (let i = 0; i < cards.length; i++) {
	cards[i].addEventListener('click', flip);
}
*/
