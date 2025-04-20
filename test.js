// for storing after shuff
let deck = [];

// dec. var
let hiddenCard;
let dealerSum = 0;
let playerSum = 0;
let dealerAceCount = 0;
let playerAceCount = 0;
let canHit = true;

// presets
window.onload = function () {
  buildDeck();
  shuffleDeck();

  document.getElementById("start-button").addEventListener("click", startGame);
  document.getElementById("hit-button").addEventListener("click", hit);
  document.getElementById("stand-button").addEventListener("click", stand);
};

function buildDeck() {
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const types = ["C", "D", "H", "S"];
  deck = [];

  for (let type of types) {
    for (let value of values) {
      deck.push(`${value}-${type}`);
    }
  }
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    const j = Math.floor(Math.random() * deck.length);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function startGame() {
  // Reset
  document.getElementById("dealer-cards").innerHTML = '<img id="hidden-card" src="./cards/BACK.png">';
  document.getElementById("player-cards").innerHTML = '';
  dealerSum = 0;
  playerSum = 0;
  dealerAceCount = 0;
  playerAceCount = 0;
  canHit = true;

  // Hidden card
  hiddenCard = deck.pop();
  dealerSum += getValue(hiddenCard);
  dealerAceCount += checkAce(hiddenCard);

  // Show dealer's second card
  const dealerCard = deck.pop();
  dealerSum += getValue(dealerCard);

  dealerAceCount += checkAce(dealerCard);
  const dealerCardImg = document.createElement("img");

    // loads the card:
  dealerCardImg.src = `./cards/${dealerCard}.png`;

  document.getElementById("dealer-cards").appendChild(dealerCardImg);

  // Player cards
  for (let i = 0; i < 2; i++) {
    drawCard("player");
  }

  updateTotals();
}

function hit() {
  if (!canHit) return;
  drawCard("player");
  if (reduceAce(playerSum, playerAceCount) > 21) {
    canHit = false;
    revealDealer();
    showResult("You busted! Dealer wins.");
  }
  updateTotals();
}

function stand() {
  canHit = false;
  revealDealer();

  while (reduceAce(dealerSum, dealerAceCount) < 17) {
    drawCard("dealer");
  }

  dealerSum = reduceAce(dealerSum, dealerAceCount);
  playerSum = reduceAce(playerSum, playerAceCount);

  if (dealerSum > 21) {
    showResult("Dealer busted! You win.");
  } else if (playerSum > dealerSum) {
    showResult("You win!");
  } else if (playerSum < dealerSum) {
    showResult("Dealer wins!");
  } else {
    showResult("It's a tie!");
  }
}

function drawCard(who) {
  const card = deck.pop();
  const cardImg = document.createElement("img");
  cardImg.src = `./cards/${card}.png`;

  if (who === "player") {
    playerSum += getValue(card);
    playerAceCount += checkAce(card);
    document.getElementById("player-cards").appendChild(cardImg);
  } else {
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").appendChild(cardImg);
  }
}

function revealDealer() {
  document.getElementById("hidden-card").src = `./cards/${hiddenCard}.png`;
  updateTotals();
}

function getValue(card) {
  const value = card.split("-")[0];
  if (isNaN(value)) return value === "A" ? 11 : 10;
  return parseInt(value);
}

function checkAce(card) {
  return card[0] === "A" ? 1 : 0;
}


function reduceAce(sum, aceCount) {
  while (sum > 21 && aceCount > 0) {
    sum -= 10;
    aceCount -= 1;
  }
  return sum;
}

function updateTotals() {
  document.getElementById("player-money").innerText = 100;
}

function showResult(message) {
  setTimeout(() => alert(message), 200);
}

// This works

// TESTING WITH FRIEND'S CODE:
