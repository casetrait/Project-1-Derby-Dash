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
let message

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
let p2NameDisplay = document.getElementById("p1Name")
let p3NameDisplay = document.getElementById("p1Name")
let p4NameDisplay = document.getElementById("p1Name")
let currentPotMsg = document.getElementById("currentPot")
let rollerMsg = document.getElementById("roller")
let die1Roll = document.getElementById("die1")
let die2Roll = document.getElementById("die2")

/*----- event listeners -----*/

drawButton.addEventListener("click", drawHorses)
rollButton.addEventListener("click", roll) 

/*----- functions -----*/

function drawHorses () {
    console.log("draw horses")
     //if game in process return else draw 6 random numbers between 1 and 12
}

function roll () {
    console.log("Roll")
    //roll die 1 and die 2
    //if scratch pay scratch else
    //move horse up one space
    //if horse moves to #fin space
    //win function
    //else next player
}

function init () {
    pot = startingPot
    p1Holdings = startHoldings
    p2Holdings = startHoldings
    p3Holdings = startHoldings
    p4Holdings = startHoldings
    p1Horses = 'Click "Draw Horses"'
    p2Horses = 'Click "Draw Horses"'
    p3Horses = 'Click "Draw Horses"'
    p4Horses = 'Click "Draw Horses"'
    p1Name = "Player 1"
    p2Name = "Player 1"
    p3Name = "Player 1"
    p4Name = "Player 1"
    die1 = 1
    die2 = 1
    h2Position = ""//gate TBD
    h3Position = ""//gate TBD
    h4Position = ""//gate TBD
    h5Position = ""//gate TBD
    h6Position = ""//gate TBD
    h7Position = ""//gate TBD
    h8Position = ""//gate TBD
    h9Position = ""//gate TBD
    h10Position = ""//gate TBD
    h11Position = ""//gate TBD
    h12Position = ""//gate TBD
    playerTurn = p1Name
    message = 'Click "Draw Horses" to begin'

    render()
}

function render() {
    //update DOM values
    currentPotMsg.textContent = pot
    rollerMsg.textContent = playerTurn
    p1HoldingsDisplay.textContent = p1Holdings
    p2HoldingsDisplay.textContent = p2Holdings
    p3HoldingsDisplay.textContent = p3Holdings
    p4HoldingsDisplay.textContent = p4Holdings
    p1NameDisplay.textContent = p1Name
    p2NameDisplay.textContent = p2Name
    p3NameDisplay.textContent = p3Name
    p4NameDisplay.textContent = p4Name
    p1HorsesDisplay.textContent = p1Horses
    p2HorsesDisplay.textContent = p2Horses
    p3HorsesDisplay.textContent = p3Horses
    p4HorsesDisplay.textContent = p4Horses
    messageEl.textContent = message
    die1Roll.textContent = die1
    die1Roll.textContent = die1
    //horses in gate
}