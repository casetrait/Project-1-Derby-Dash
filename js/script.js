// 1.0 User selects between two options: "quick-play" or "custom settings" (If there is time and ability):
//     1.1: If User selects "quick-play" then render board with default settings:
//         1.1.1: Player names "Player 1" - "Player 4"
//         1.1.2: $10,000 in each players holdings
//         1.1.3: $200 scratch penalty
//         1.1.4: All horses in the "gate" position

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
//     5.3: If any players holds greater than 70% of the total holdings value - end the game and declare winner
//     5.4: Else horses are reset to the "gate" position and we loop back to 2.0
    
// TBD: At each scratch penalty payment event we must check for players holding value dropping is less than or equal to $0
//         This could trigger elimination from the game. Alternatively, we may allow players to plunge into negative values (bank loan anyone?)


/*----- constants -----*/

const startHoldings = 100
const scratchValue = 2
const startingPot = 0
const maxWins = startHoldings*3

/*----- app's state (variables) -----*/

let playerTurn = "Player 1"
let message = 'Click "Draw Horses" to Begin!'
let p1Name = "Player 1"
let p2Name = "Player 2"
let p3Name = "Player 3"
let p4Name = "Player 4"
let p1Holdings = 100
let p2Holdings = 100
let p3Holdings = 100
let p4Holdings = 100
let p1Horses = []
let p2Horses = []
let p3Horses = []
let p4Horses = []
let scratchHorses = []
let die1 = 1
let die2 = 1
let rolledHorse
let pot = 0
let raceStatus = "draw"
const p1Count = {};
const p2Count = {};
const p3Count = {};
const p4Count = {};


/*----- cached element references -----*/

let drawButton = document.querySelector(".draw")
let rollButton = document.querySelector(".roll")
let messageEl = document.getElementById("message")
let p1HoldingsDisplay = document.getElementById("p1Holdings")
let p2HoldingsDisplay = document.getElementById("p2Holdings")
let p3HoldingsDisplay = document.getElementById("p3Holdings")
let p4HoldingsDisplay = document.getElementById("p4Holdings")
let p1HorsesDisplay = document.getElementById("p1Horses")
let p2HorsesDisplay = document.getElementById("p2Horses")
let p3HorsesDisplay = document.getElementById("p3Horses")
let p4HorsesDisplay = document.getElementById("p4Horses")
let p1NameDisplay = document.getElementById("p1Name")
let p2NameDisplay = document.getElementById("p2Name")
let p3NameDisplay = document.getElementById("p3Name")
let p4NameDisplay = document.getElementById("p4Name")
let currentPotMsg = document.getElementById("currentPot")
let rollerMsg = document.getElementById("roller")
let die1El = document.getElementById("die1")
let die2El = document.getElementById("die2")
let rolledHorseEl = document.getElementById("rolledHorse")

/*----- event listeners -----*/

drawButton.addEventListener("click", drawHorses)
rollButton.addEventListener("click", roll) 

/*----- functions -----*/

function drawHorses() {
     if(raceStatus === "draw"){
            for (let i=0; i<6; i++) {
            p1Horses.push(getRandomHorseNum())
            p2Horses.push(getRandomHorseNum())
            p3Horses.push(getRandomHorseNum())
            p4Horses.push(getRandomHorseNum())
            }
            raceStatus = "scratch"
            message = 'Click "Roll" to Elect Scratched Horses!'
            countPlayerHorses()
            render()
     } else { return }
}

function roll () {
    if (raceStatus === "scratch" || "racing"){  
    if (raceStatus === "scratch"){
        rollScratch()
      } else {
        rollRace()
      }
    render()
    }
    else { return }
}

function rollScratch() {
    die1 = getRandomDieNum()
    die2 = getRandomDieNum()
    rolledHorse = die1 + die2
    if (scratchHorses.indexOf(rolledHorse) === -1){
        scratchHorses.push(rolledHorse)
        //converts undefined counts into 0 for purpose of math
        p1Count[rolledHorse] = p1Count[rolledHorse] ? p1Count[rolledHorse] : 0
        p2Count[rolledHorse] = p2Count[rolledHorse] ? p2Count[rolledHorse] : 0
        p3Count[rolledHorse] = p3Count[rolledHorse] ? p3Count[rolledHorse] : 0
        p4Count[rolledHorse] = p4Count[rolledHorse] ? p4Count[rolledHorse] : 0
        //decrease player holdings by scratchValue * scratchCount
        p1Holdings = p1Holdings - (p1Count[rolledHorse] * scratchValue)
        p2Holdings = p2Holdings - (p2Count[rolledHorse] * scratchValue)
        p3Holdings = p3Holdings - (p3Count[rolledHorse] * scratchValue)
        p4Holdings = p4Holdings - (p4Count[rolledHorse] * scratchValue)
        //increase pot by scratchValue * ScratchCount
        pot = pot + scratchValue * (p1Count[rolledHorse] + p2Count[rolledHorse] + p3Count[rolledHorse] + p4Count[rolledHorse])
        //find target classes for squaree and horse to move scratched horses into scratch row
        let horseTarget = document.getElementById("h" + rolledHorse)
        let squareTarget = document.getElementById("s" + rolledHorse)
        squareTarget.appendChild(horseTarget)
        changeTurn()
    } else { return }
    if (scratchHorses.length === 4) {      
        raceStatus = "racing"
        message = 'Click "Roll" to Race!'
    } else { return }
}

function rollRace() {
    die1 = getRandomDieNum()
    die2 = getRandomDieNum()
    rolledHorse = die1 + die2
    if (scratchHorses.includes(rolledHorse)){
        console.log("scratch!")
    } else {
        let horseTarget = document.getElementById("h" + rolledHorse)
        let currentColumn = horseTarget.parentNode.id.charAt(0)
        let nextColumn = Number(currentColumn) + 1
        let squareTarget = document.getElementById(nextColumn + "r" + rolledHorse)
        squareTarget.style.border = "none"
        squareTarget.appendChild(horseTarget)
        if (squareTarget.classList.contains("fin")){
            squareTarget.style.backgroundImage= 'url("")'
            squareTarget.style.backgroundColor = "green"
        } else { return }
    }
    changeTurn()

    // if horse parent class==="fin" raceWinEvent function including pot split and set raceStatus = "draw"
}


function countPlayerHorses () {

    for (const num of p1Horses) {
        if (p1Count[num]){
            p1Count[num] += 1
        } else {
            p1Count[num] = 1
        }
    }
    for (const num of p2Horses) {
        if (p2Count[num]){
            p2Count[num] += 1
        } else {
            p2Count[num] = 1
        }
    }
    for (const num of p3Horses) {
        if (p3Count[num]){
            p3Count[num] += 1
        } else {
            p3Count[num] = 1
        }
    }
    for (const num of p4Horses) {
        if (p4Count[num]){
            p4Count[num] += 1
        } else {
            p4Count[num] = 1
        }
    }
}

function init () {
    message = 'Click "Draw Horses" to Begin!'
    pot = startingPot
    p1Holdings = startHoldings
    p2Holdings = startHoldings
    p3Holdings = startHoldings
    p4Holdings = startHoldings
    p1Name = "Player 1"
    p2Name = "Player 2"
    p3Name = "Player 3"
    p4Name = "Player 4"
    playerTurn = p1Name
    die1 = 1
    die2 = 1
    resetHorses()
    render()
}

function render() {
    currentPotMsg.textContent = `Current Pot: $ ${pot}`
    rollerMsg.textContent = `Roller: ${playerTurn}`
    p1HoldingsDisplay.textContent = `$ ${p1Holdings}`
    p2HoldingsDisplay.textContent = `$ ${p2Holdings}`
    p3HoldingsDisplay.textContent = `$ ${p3Holdings}`
    p4HoldingsDisplay.textContent = `$ ${p4Holdings}`
    p1NameDisplay.textContent = p1Name
    p2NameDisplay.textContent = p2Name
    p3NameDisplay.textContent = p3Name
    p4NameDisplay.textContent = p4Name
    p1HorsesDisplay.textContent = p1Horses
    p2HorsesDisplay.textContent = p2Horses
    p3HorsesDisplay.textContent = p3Horses
    p4HorsesDisplay.textContent = p4Horses
    messageEl.textContent = message
    die1El.src = `imgs/${die1}d.png`
    die2El.src = `imgs/${die2}d.png`
    rolledHorseEl.textContent = Number(die1) + Number(die2)
}

function getRandomDieNum() {
    return Math.floor(Math.random()*6 + 1)
}

function getRandomHorseNum() {
    return Math.floor(Math.random()*11 + 2)
}

function changeTurn () {
    if (playerTurn === p1Name){playerTurn = p2Name}
    else if (playerTurn === p2Name){playerTurn = p3Name}
    else if (playerTurn === p3Name){playerTurn = p4Name}
    else {playerTurn = p1Name}
}

function checkWinner(){
    //check winner
}

function resetHorses() {
    for (let i=2; i<13; i++) {
    let horseTarget = document.getElementById("h" + i)
    let squareTarget = document.getElementById("0r" + i)
    squareTarget.appendChild(horseTarget)
    }
    resetBorderStyling()
    messageEl.textContent = 'Click "Draw Horses" to Begin Next Race!'
    raceStatus = "draw"
    p1HorsesDisplay.textContent = 'Draw Horses'
    p2HorsesDisplay.textContent = 'Draw Horses'
    p3HorsesDisplay.textContent = 'Draw Horses'
    p4HorsesDisplay.textContent = 'Draw Horses'
}

function resetBorderStyling() {
    let raceSquares = document.getElementsByClassName("race")

    for (let i=0; i < raceSquares.length; i++) {
        let raceSquare = raceSquares[i];
        raceSquare.style.border = "5px solid white"
    }
}