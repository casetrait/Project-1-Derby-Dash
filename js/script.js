/*----- pseudocode -----*/
// 1.0 User selects between two options: "quick-play" or "custom settings" (If there is time and ability):
//     1.1: If User selects "quick-play" then render board with default settings:
//         1.1.1: Player names "Player 1" - "Player 4"
//         1.1.2: $100 in each players holdings
//         1.1.3: $2 scratch penalty
//         1.1.4: All horses in the "gate" position
//     [ICEBOX]
//     1.2: If User selects "custom settings" then render board with user input settings
//         1.2.1: Player namess (User Input)
//         1.2.2: (User Input) in each players holdings
//         1.2.3: (User Input) scratch penalty
//         1.1.4: All horses in the "gate" position

// 2.0: User clicks "Draw Horses" button
//     2.1: Randomly assign 6 numbers between 2 and 12 to each player

// 3.0: User rolls the dice (2) until 4 unique values (accomplished with an if statement) are rolled to determine the "scratched horses"
//     3.1: Scratched horses move back into the scratch line
//     3.2: The scratch penalty is multiplied by the number of scratch numbers each player has in their hand and is deducted from their holdings
//     3.3: The pot size (starts at $0) for the round increases by the scratch penalty value multiplied by total player scratch cards
//     3.4: The race is now ready to begin - notify the user

// 4.0: Users take turns rolling the dice to determine the actions of the race
//     4.1: If a scratched number is rolled, the rollers holdings reduces by the scratch penalty while the pot increases by the same value
//     4.2: (Else) if any other horse is rolled, the horse advances one space up the track
//     4.3: If horse reaches finish line on move, notify the user of the winning horse and skip to 5.0
//     4.4: (Else) if the horse is not at the finish, player turn changes to the next roller and play is repeated starting at 4.0

// 5.0: When a horse finishes the race
//     5.1: The value of the pot is divided by the total number of winning numbers held by all users
//             If no winner then pot starts at the current value next race
//     5.2: This value is then multiplied by the number of winning numbers each player holds and is added to their holdings
//     5.3: If any players holds greater than 50% of the total holdings value - end the game and declare a winner
//     5.4: Else horses are reset to the "gate" position and we loop back to 2.0

/*----- constants -----*/

const startHoldings = 100;
const scratchValue = 2;
const startingPot = 0;
const maxHoldings = startHoldings * 1.3;

/*----- app's state (variables) -----*/

let playerTurn = "Player 1";
let message = 'Click "Draw Horses" to Begin New Game!';
let p1Name = "Player 1";
let p2Name = "Player 2";
let p3Name = "Player 3";
let p4Name = "Player 4";
let p1Holdings = 100;
let p2Holdings = 100;
let p3Holdings = 100;
let p4Holdings = 100;
let p1Horses = [];
let p2Horses = [];
let p3Horses = [];
let p4Horses = [];
let scratchHorses = [];
let die1 = 1;
let die2 = 1;
let rolledHorse;
let pot = 0;
let raceStatus = "draw";
let p1Count = {};
let p2Count = {};
let p3Count = {};
let p4Count = {};

/*----- cached element references -----*/

let drawButton = document.querySelector(".draw");
let rollButton = document.querySelector(".roll");
let messageEl = document.getElementById("message");
let p1HoldingsDisplay = document.getElementById("p1Holdings");
let p2HoldingsDisplay = document.getElementById("p2Holdings");
let p3HoldingsDisplay = document.getElementById("p3Holdings");
let p4HoldingsDisplay = document.getElementById("p4Holdings");
let p1HorsesDisplay = document.getElementById("p1Horses");
let p2HorsesDisplay = document.getElementById("p2Horses");
let p3HorsesDisplay = document.getElementById("p3Horses");
let p4HorsesDisplay = document.getElementById("p4Horses");
let p1NameDisplay = document.getElementById("p1Name");
let p2NameDisplay = document.getElementById("p2Name");
let p3NameDisplay = document.getElementById("p3Name");
let p4NameDisplay = document.getElementById("p4Name");
let currentPotMsg = document.getElementById("currentPot");
let rollerMsg = document.getElementById("roller");
let die1El = document.getElementById("die1");
let die2El = document.getElementById("die2");
let rolledHorseEl = document.getElementById("rolledHorse");

/*----- event listeners -----*/

drawButton.addEventListener("click", drawHorses);
rollButton.addEventListener("click", roll);

/*----- functions -----*/

function drawHorses() {
  //draw 6 random horses between 2 and 12 for each player
  if (raceStatus === "draw") {
    for (let i = 0; i < 6; i++) {
      p1Horses.push(getRandomHorseNum());
      p2Horses.push(getRandomHorseNum());
      p3Horses.push(getRandomHorseNum());
      p4Horses.push(getRandomHorseNum());
    }
    raceStatus = "scratch";
    message = 'Click "Roll" to Elect Scratched Horses!';
    countPlayerHorses();
    render();
  } else {
    return;
  }
}

function roll() {
  //uses race status to determine whether drawing scratch horses or racing and renders results
  if (raceStatus !== "draw") {
    if (raceStatus === "scratch") {
      rollScratch();
    } else {
      rollRace();
    }
    render();
    setTimeout(render, 6100);
  } else {
    return;
  }
}

function rollScratch() {
  rollDice();
  //checks if horse isn't already scratched
  if (scratchHorses.indexOf(rolledHorse) === -1) {
    scratchHorses.push(rolledHorse);
    zeroCounter(rolledHorse);
    //decrease player holdings by scratchValue * scratchCount
    p1Holdings = p1Holdings - p1Count[rolledHorse] * scratchValue;
    p2Holdings = p2Holdings - p2Count[rolledHorse] * scratchValue;
    p3Holdings = p3Holdings - p3Count[rolledHorse] * scratchValue;
    p4Holdings = p4Holdings - p4Count[rolledHorse] * scratchValue;
    //increase pot by scratchValue * total held scratch numbers
    pot += scratchValue *
        (p1Count[rolledHorse] +
          p2Count[rolledHorse] +
          p3Count[rolledHorse] +
          p4Count[rolledHorse]);
    //find target classes for squaree and horse to move scratched horses into scratch row
    let horseTarget = document.getElementById("h" + rolledHorse);
    let squareTarget = document.getElementById("s" + rolledHorse);
    squareTarget.appendChild(horseTarget);
    changeTurn();
  } else {
    return;
  }
  //change status to racing once 4 scratch horses are elected
  if (scratchHorses.length === 4) {
    raceStatus = "racing";
    message = 'Click "Roll" to Race!';
  } else {
    return;
  }
}

function rollRace() {
  rollDice();
  //check for scratch
  if (scratchHorses.includes(rolledHorse)) {
    payScratch();
    changeTurn();
    //i not scratch horses move up the track
  } else {
    //cache rolled horse image
    let horseTarget = document.getElementById("h" + rolledHorse);
    //determines current location and adds one to column ID to determine target square for move
    let currentColumn = horseTarget.parentNode.id.charAt(0);
    let nextColumn = Number(currentColumn) + 1;
    let squareTarget = document.getElementById(nextColumn + "r" + rolledHorse);
    squareTarget.style.border = "none";
    //moves cached horse to target square
    squareTarget.appendChild(horseTarget);
    changeTurn();
    //checks move for race win condition, pays and updates game state for next race
    if (squareTarget.classList.contains("fin")) {
      raceWin(squareTarget);
      gameWinCheck();
      //timeout before resetting state and rendering allows user to observe results
      setTimeout(function () {
        resetHorses();
        squareTarget.style.backgroundImage = "url('imgs/checkers.png')";
        messageEl.style.color = "white";
        message = 'Click "Draw Horses" to Begin Next Race!';
        p1HorsesDisplay.style.color = "white";
        p2HorsesDisplay.style.color = "white";
        p3HorsesDisplay.style.color = "white";
        p4HorsesDisplay.style.color = "white";
        p1Horses = [];
        p2Horses = [];
        p3Horses = [];
        p4Horses = [];
        p1Count = {};
        p2Count = {};
        p3Count = {};
        p4Count = {};
      }, 6000);
    } else {
      return;
    }
  }
}

//function sums count of each horse in the players horse arrays for math calcs in payoutPot and rolScratch functions
function countPlayerHorses() {
  for (const num of p1Horses) {
    if (p1Count[num]) {
      p1Count[num] += 1;
    } else {
      p1Count[num] = 1;
    }
  }
  for (const num of p2Horses) {
    if (p2Count[num]) {
      p2Count[num] += 1;
    } else {
      p2Count[num] = 1;
    }
  }
  for (const num of p3Horses) {
    if (p3Count[num]) {
      p3Count[num] += 1;
    } else {
      p3Count[num] = 1;
    }
  }
  for (const num of p4Horses) {
    if (p4Count[num]) {
      p4Count[num] += 1;
    } else {
      p4Count[num] = 1;
    }
  }
}

//converts undefined counts into 0 for purpose of math
function zeroCounter(rolledHorse){
    p1Count[rolledHorse] = p1Count[rolledHorse] ? p1Count[rolledHorse] : 0;
    p2Count[rolledHorse] = p2Count[rolledHorse] ? p2Count[rolledHorse] : 0;
    p3Count[rolledHorse] = p3Count[rolledHorse] ? p3Count[rolledHorse] : 0;
    p4Count[rolledHorse] = p4Count[rolledHorse] ? p4Count[rolledHorse] : 0;
}

//initialize board for new game
function init() {
  message = 'Click "Draw Horses" to Begin New Game!';
  pot = startingPot;
  p1Holdings = startHoldings;
  p2Holdings = startHoldings;
  p3Holdings = startHoldings;
  p4Holdings = startHoldings;
  p1Name = "Player 1";
  p2Name = "Player 2";
  p3Name = "Player 3";
  p4Name = "Player 4";
  p1Horses = [];
  p2Horses = [];
  p3Horses = [];
  p4Horses = [];
  playerTurn = p1Name;
  die1 = 1;
  die2 = 1;
  p1Count = {};
  p2Count = {};
  p3Count = {};
  p4Count = {};
  resetHorses();
  render();
}

//render the board function is called after each move
function render() {
  currentPotMsg.textContent = `Current Pot: $ ${pot}`;
  rollerMsg.textContent = `Roller: ${playerTurn}`;
  p1HoldingsDisplay.textContent = `$ ${p1Holdings}`;
  p2HoldingsDisplay.textContent = `$ ${p2Holdings}`;
  p3HoldingsDisplay.textContent = `$ ${p3Holdings}`;
  p4HoldingsDisplay.textContent = `$ ${p4Holdings}`;
  p1NameDisplay.textContent = p1Name;
  p2NameDisplay.textContent = p2Name;
  p3NameDisplay.textContent = p3Name;
  p4NameDisplay.textContent = p4Name;
  if (p1Horses[0]) {
    p1HorsesDisplay.textContent = p1Horses;
    p2HorsesDisplay.textContent = p2Horses;
    p3HorsesDisplay.textContent = p3Horses;
    p4HorsesDisplay.textContent = p4Horses;
  } else {
    p1HorsesDisplay.textContent = "Draw Horses";
    p2HorsesDisplay.textContent = "Draw Horses";
    p3HorsesDisplay.textContent = "Draw Horses";
    p4HorsesDisplay.textContent = "Draw Horses";
  }
  messageEl.textContent = message;
  die1El.src = `imgs/${die1}d.png`;
  die2El.src = `imgs/${die2}d.png`;
  rolledHorseEl.textContent = Number(die1) + Number(die2);
}

//computes two random dice numbers between 1 and 6 and sums them
function rollDice() {
    die1 = Math.floor(Math.random() * 6 + 1);
    die2 = Math.floor(Math.random() * 6 + 1);
    rolledHorse = die1 + die2;
}

//returns random number between 2 and 12
function getRandomHorseNum() {
  return Math.floor(Math.random() * 11 + 2);
}

//changes plater turn
function changeTurn() {
  if (playerTurn === p1Name) {
    playerTurn = p2Name;
  } else if (playerTurn === p2Name) {
    playerTurn = p3Name;
  } else if (playerTurn === p3Name) {
    playerTurn = p4Name;
  } else {
    playerTurn = p1Name;
  }
}

//resets horse back to gate, called after race
function resetHorses() {
  for (let i = 2; i < 13; i++) {
    let horseTarget = document.getElementById("h" + i);
    let squareTarget = document.getElementById("0r" + i);
    squareTarget.appendChild(horseTarget);
  }
  resetBorderStyling();
}

//resets border styling, called after race
function resetBorderStyling() {
  let raceSquares = document.getElementsByClassName("race");

  for (let i = 0; i < raceSquares.length; i++) {
    let raceSquare = raceSquares[i];
    raceSquare.style.border = "5px solid white";
  }
}

//called if scratch horse is roller and pays scratch amount from player into pot
function payScratch() {
  if (playerTurn === p1Name) {
    p1Holdings -= scratchValue;
    pot += scratchValue;
  } else if (playerTurn === p2Name) {
    p2Holdings -= scratchValue;
    pot += scratchValue;
  } else if (playerTurn === p3Name) {
    p3Holdings -= scratchValue;
    pot += scratchValue;
  } else {
    p4Holdings -= scratchValue;
    pot += scratchValue;
  }
}

//unique rendering for race win logic and payment of pot
function raceWin(squareTarget) {
  squareTarget.style.backgroundImage = 'url("")';
  squareTarget.style.backgroundColor = "green";
  payoutPot();
  raceStatus = "draw";
  scratchHorses = [];
  messageEl.style.color = "green";
  message = `${rolledHorse} Horse Wins!!`;
  p1HorsesDisplay.style.color = "green";
  p2HorsesDisplay.style.color = "green";
  p3HorsesDisplay.style.color = "green";
  p4HorsesDisplay.style.color = "green";
  p1Horses = `${p1Count[rolledHorse]} x Winner`;
  p2Horses = `${p2Count[rolledHorse]} x Winner`;
  p3Horses = `${p3Count[rolledHorse]} x Winner`;
  p4Horses = `${p4Count[rolledHorse]} x Winner`;
}

function payoutPot() {
  zeroCounter(rolledHorse);
  //determines total winning horses held
  let numWinners =
    p1Count[rolledHorse] +
    p2Count[rolledHorse] +
    p3Count[rolledHorse] +
    p4Count[rolledHorse];
  //portions pot by number of winner
  if (numWinners === 0) {
    return;
  } else {
    let potPortion = pot / numWinners;
    //distrbutes rounded portions to winners
    p1Holdings += Math.round(potPortion * p1Count[rolledHorse]);
    p2Holdings += Math.round(potPortion * p2Count[rolledHorse]);
    p3Holdings += Math.round(potPortion * p3Count[rolledHorse]);
    p4Holdings += Math.round(potPortion * p4Count[rolledHorse]);
    pot = 0;
  }
}

//checks if any players holdings is over the maxHoldings amount and sets winning message and init function for new game
function gameWinCheck() {
  if (p1Holdings > maxHoldings) {
    messageEl.style.color = "green";
    message = "Player 1 Wins the Game!!";
    setTimeout(init, 7500);
  } else if (p2Holdings > maxHoldings) {
    messageEl.style.color = "green";
    message = "Player 2 Wins the Game!!";
    setTimeout(init, 7500);
  } else if (p3Holdings > maxHoldings) {
    messageEl.style.color = "green";
    message = "Player 3 Wins the Game!!";
    setTimeout(init, 7500);
  } else if (p4Holdings > maxHoldings) {
    messageEl.style.color = "green";
    message = "Player 4 Wins the Game!!";
    setTimeout(init, 6300);
  } else {
    return;
  }
}
