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

const startHoldings = 10000
const scratchValue = 200
const startingPot = 0
const maxWins = 30000

/*----- app's state (variables) -----*/

let p1Holdings
let p2Holdings
let p3Holdings
let p4Holdings

let p1Horses
let p2Horses
let p3Horses
let p4Horses

let die1
let die2

let pot

let h2Position
let h3Position
let h4Position
let h5Position
let h6Position
let h7Position
let h8Position
let h9Position
let h10Position
let h11Position
let h12Position

let playerTurn

/*----- cached element references -----*/

let drawButton = document.querySelector(".draw")
let rollButton = document.querySelector(".roll")
let message = document.getElementById("message")
let p1HoldingsDisplay = document.getElementById("p1Holdings")
let p2HoldingsDisplay = document.getElementById("p2Holdings")
let p3HoldingsDisplay = document.getElementById("p3Holdings")
let p4HoldingsDisplay = document.getElementById("p4Holdings")
let p1HorsesDisplay = document.getElementById("p1Horses")
let p2HorsesDisplay = document.getElementById("p2Horses")
let p3HorsesDisplay = document.getElementById("p3Horses")
let p4HorsesDisplay = document.getElementById("p4Horses")
let p1Name = document.getElementById("p1Name")
let p2Name = document.getElementById("p1Name")
let p3Name = document.getElementById("p1Name")
let p4Name = document.getElementById("p1Name")

/*----- event listeners -----*/

drawButton.addEventListener("click", function(evt) {
    drawHorses()
})

rollButton.addEventListener("click", function(evt) {
    roll()
    //if scratch pay scratch else
    move()
    //if horse moves to #fin space
    raceWin()
    //else
    nextPlayer()
})

/*----- functions -----*/

function roll () {
    console.log("Roll")
}

function move () {
    console.log("Move Horse")
}

function raceWin () {
    console.log("I win!")
}

function nextPlayer () {
    console.log("Next")
}

function init () {
    pot = startingPot
    p1Holdings = startHoldings
    p2Holdings = startHoldings
    p3Holdings = startHoldings
    p4Holdings = startHoldings
    p1Name = "Player 1"
    p2Name = "Player 1"
    p3Name = "Player 1"
    p4Name = "Player 1"
    die1 = 1
    die2 = 2
    h2Position = "0"
    h3Position = "0"
    h4Position = "0"
    h5Position = "0"
    h6Position = "0"
    h7Position = "0"
    h8Position = "0"
    h9Position = "0"
    h10Position = "0"
    h11Position = "0"
    h12Position = "0"
    playerTurn = p1Name
}

function drawHorses () {
    console.log("draw horses")
}