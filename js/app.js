const startGameBtn = $(".startGame-btn");
const restGameBtn = $(".reset-btn");
const startGameDetails = $(".start-details");
const nameDetails = $(".name-details");
const playGround = $(".play-ground");

let userBlock = $(".user");
let userNameHtml = $(".user .name");
let userCardsHtml = $(".user .cards");
let userChipsHtml = $(".user .chips");
let userBetHtml = $(".user .bet .bet-text");
let userSumHtml = $(".user .sum");
let userControlBtns = $(".user .userbtns");
let userSwitchBtn = $(".user .userbtns .switch-btn-left");
let userWithdrawCardBtn = $(".user .userbtns .cardWithdraw-btn");
let userShowCardsBtn = $(".user .userbtns .showcards-btn");
let userBetContainer = $(".user .bet-container");
let userBetBtn = $(".user .bet-container .bet-btn");
let userBetInput = $(".user .bet-container .bet-input");

let pc1Block = $(".pc1");
let pc1NameHtml = $(".pc1 .name");
let pc1CardsHtml = $(".pc1 .cards");
let pc1ChipsHtml = $(".pc1 .chips");
let pc1BetHtml = $(".pc1 .bet .bet-text");
let pc1SumHtml = $(".pc1 .sum");
let pc1WithdrawCardBtn = $(".pc1 .cardWithdraw-btn");
let pc1BetContainer = $(".pc1 .bet-container");
let pc1BetBtn = $(".pc1 .bet-container .bet-btn");
let pc1BetInput = $(".pc1 .bet-container .bet-input");

let pc2Block = $(".pc2");
let pc2NameHtml = $(".pc2 .name");
let pc2CardsHtml = $(".pc2 .cards");
let pc2ChipsHtml = $(".pc2 .chips");
let pc2BetHtml = $(".pc2 .bet .bet-text");
let pc2SumHtml = $(".pc2 .sum");
let pc2WithdrawCardBtn = $(".pc2 .cardWithdraw-btn");
let pc2BetContainer = $(".pc2 .bet-container");
let pc2BetBtn = $(".pc2 .bet-container .bet-btn");
let pc2BetInput = $(".pc2 .bet-container .bet-input");

let userWithdrawCardAllowness = false;
let showPcDetails = false;
let firstWithdraw = false;
let chipsValue = 100;
let withdrawCardDecision = ["yes", "no"];
let multiplyFactor = 1;
let bet = 0;
let betArr = [];
let playersArray = [];
let winner = "";

let blackjackSound = new Audio("sounds/blackjack.mp3");
let cardSound = new Audio("sounds/card.mp3");
let btnSound = new Audio("sounds/btn.wav");
let switchSound = new Audio("sounds/switch.wav");
let betSound = new Audio("sounds/bet.mp3");

//Hiding the nameDetails + nameDetails + restGameBtn + userShowCardsBtn
nameDetails.hide();
playGround.hide();
restGameBtn.hide();
userShowCardsBtn.hide();

startGameBtn.on("click", function(){
    btnSound.play();
    blackjackSound.play();
    startGameBtn.hide();
    nameDetails.show();
    $(".name-details input").on("keypress", function(event){
        if (event.key === "Enter") {
            firstWithdraw = true;
            userNameHtml.html($(".name-details input").val());
            startGameDetails.hide();
            playGround.show();
            
            let user = new Player(userBlock, userNameHtml, userCardsHtml, [], userSumHtml, 
            0, userChipsHtml, chipsValue, userBetHtml, userWithdrawCardBtn, 
            userBetContainer, userBetBtn, userBetInput, true, true, "none");
            let pc1 = new Player(pc1Block, pc1NameHtml, pc1CardsHtml, [], pc1SumHtml, 
            0, pc1ChipsHtml ,chipsValue, pc1BetHtml, pc1WithdrawCardBtn, 
            pc1BetContainer, pc1BetBtn, pc1BetInput, true, true, "none");
            let pc2 = new Player(pc2Block, pc2NameHtml, pc2CardsHtml, [], pc2SumHtml, 
            0, pc2ChipsHtml, chipsValue, pc2BetHtml, pc2WithdrawCardBtn, 
            pc2BetContainer, pc2BetBtn, pc2BetInput, true, true, "none");
            
            playersArray = [user, pc1, pc2];
            
            generateBetArray();
            gamePlay(user);
            gamePlay(pc1);
            gamePlay(pc2);
            firstWithdraw = false;

            userBetBtn.on("click", () => {
                btnSound.play();
                userBetFunction();
            });

            userBetInput.on("keypress", function(event) {
                if (event.key === "Enter") {
                    userBetFunction();
                }
            });
            
            userSwitchBtn.on("click", () => {
                switchSound.play();
                if (userSwitchBtn.hasClass("switch-btn-left")) {
                    userSwitchBtn.removeClass("switch-btn-left");
                    userSwitchBtn.addClass("switch-btn-right");
                    userWithdrawCardBtn.slideUp("slow");
                    userShowCardsBtn.slideDown("slow");
                } else {
                    userSwitchBtn.removeClass("switch-btn-right");
                    userSwitchBtn.addClass("switch-btn-left");
                    userShowCardsBtn.slideUp("slow");
                    userWithdrawCardBtn.slideDown("slow");
                }
            });

            userWithdrawCardBtn.on("click", () => {
                btnSound.play();
                userWithdrawCardAllowness = userBetFunction();
                if (userWithdrawCardAllowness) {
                    gamePlay(user);
                    gamePlay(pc1);
                    gamePlay(pc2);
                } 
            });

            userShowCardsBtn.on("click", () => {
                btnSound.play();
                userWithdrawCardAllowness = userBetFunction();
                if (userWithdrawCardAllowness) {
                    showPcDetails = true;
                    displayImage(pc1, true);
                    sum(pc1, true);
                    displayImage(pc2, true);
                    sum(pc2, true);
                    winning();
                    userWithdrawCardBtn.attr("disabled", "disabled");
                    userShowCardsBtn.attr("disabled", "disabled");
                    userSwitchBtn.attr("disabled", "disabled");
                    userBetBtn.attr("disabled", "disabled");
                    userBetInput.attr("disabled", "disabled");
                    userBlock.animate({opacity: '0.5'}, 7000);
                    pc1Block.animate({opacity: '0.5'}, 7000);
                    pc2Block.animate({opacity: '0.5'}, 7000);
                    restGameBtn.fadeIn(7000);
                }
            });
          
            pc1Block.hover(() => {
                if (pc1.isAlive) {
                    //To avoide the toggling if isAlive === false
                    pc1WithdrawCardBtn.fadeToggle(200);
                    pc1BetContainer.fadeToggle(200);
                }
            });

            pc2Block.hover(() => {
                if (pc2.isAlive) {
                    pc2WithdrawCardBtn.fadeToggle(200);
                    pc2BetContainer.fadeToggle(200);  
                }
            });
        }
    });
});

class Player {
    constructor(block, name, cardsHtml, cardsArr, sumHtml, sum, chipsHtml, chips, betHtml, withdrawCardBtn, betContainer, betBtn, betInput, continuoWithdrawCards, isAlive, risk) {
        this.block = block;
        this.name = name;
        this.cardsHtml = cardsHtml;
        this.cardsArr = cardsArr;
        this.sumHtml = sumHtml;
        this.sum = sum;
        this.chipsHtml = chipsHtml;
        this.chips = chips;
        this.betHtml = betHtml;
        this.withdrawCardBtn = withdrawCardBtn;
        this.betContainer = betContainer;
        this.betBtn = betBtn;
        this.betInput = betInput;
        this.continuoWithdrawCards = continuoWithdrawCards;
        this.isAlive = isAlive;
        this.risk = risk;
    }
}

function gamePlay(playerName) {
    if (playerName.isAlive === true) {
        withdrawCard(playerName);
        cardSound.play();
        displayImage(playerName, showPcDetails);
        betFunction(playerName);
        checkAlive(playerName);
    }
}

function withdrawCard(playerName) {
    if (firstWithdraw) {
        //Get a random number between (1 & 13)
        multiplyFactor = 13;
        const firstCard = Math.floor(Math.random() * multiplyFactor + 1);

        //To avoide outOfGame situation, sum > 21, reduce the multiplyFactor
        //Assure that the player doesn't get a Blackjack at initializing the game stage
        //Get a random number between (1 & 7)
        multiplyFactor = 7;
        const secondCard = Math.floor(Math.random() * multiplyFactor + 1);

        playerName.cardsArr.push(firstCard);
        playerName.cardsArr.push(secondCard);

    } else {
        multiplyFactor = riskManagement(playerName);
        if (playerName.name.text() === userNameHtml.text()) {
            let newCard = Math.floor(Math.random() * multiplyFactor + 1);
            playerName.cardsArr.push(newCard);
        } else {
            if (playerName.continuoWithdrawCards) {
                if (playerName.risk === "high risk") {
                    //Chance to withdraw
                    let DecisionIndex = Math.floor(Math.random() * 2);
                    let finalDecision = withdrawCardDecision[DecisionIndex]
                    if (finalDecision === "yes") {
                        let newCard = Math.floor(Math.random() * multiplyFactor + 1);
                        playerName.cardsArr.push(newCard);
                    } else {
                        playerName.continuoWithdrawCards = false;
                    }
                } else {
                    let newCard = Math.floor(Math.random() * multiplyFactor + 1);
                    playerName.cardsArr.push(newCard);
                }
            }
        }
    }
    sum(playerName, showPcDetails);
}

function displayImage(playerName, showPcDetails) {
    let imgString = ""
    if (playerName.name.text() === userNameHtml.text()) {
        for (let i = 0; i < playerName.cardsArr.length; i++) {
            imgString += `<img src=images/${playerName.cardsArr[i]}.png>`
        }
    } else {
        if (showPcDetails) {
            for (let i = 0; i < playerName.cardsArr.length; i++) {
                imgString += `<img src=images/${playerName.cardsArr[i]}.png>`
            }
        } else {
            for (let i = 0; i < playerName.cardsArr.length; i++) {
                imgString += `<img src=images/backside.png>`
            }
        }
    }
    playerName.cardsHtml.html(imgString);
}

function sum(playerName, showPcDetails){
    //Set the sum to 0 at the start of any sum calculation
    playerName.sum = 0;
    for (let i = 0; i < playerName.cardsArr.length; i++) {
        playerName.sum += playerName.cardsArr[i]
    }

    //Identify the Risk
    if (playerName.sum <= 10) {
        playerName.risk = "no risk";
    } else if (playerName.sum <= 13) {
        playerName.risk = "low risk";
    } else if (playerName.sum <= 15) {
        playerName.risk = "medium risk";
    } else if (playerName.sum > 15) {
        playerName.risk = "high risk";
    }

    let htmlText = `Sum = ${playerName.sum}`;
    
    //Display the sum results
    if (playerName.name.text() === userNameHtml.text()) {
        if (playerName.sum === 21) {
            playerName.sumHtml.html(`${htmlText}, BlackJack`);
            playerName.sumHtml.addClass("blackjack-txt");
            playerName.withdrawCardBtn.attr("disabled", "disabled");
        } else if (playerName.sum > 21) {
            playerName.isAlive = false;
            playerName.sumHtml.html(`${htmlText}, You've Lost`);
            playerName.sumHtml.addClass("lose-txt");
        } else {
            playerName.sumHtml.html(htmlText);
        }
    } else {
        //PC section
        if (showPcDetails) {
            if (playerName.sum === 21) {
                playerName.sumHtml.html(`${htmlText}, BlackJack`);
                playerName.sumHtml.addClass("blackjack-txt");
                playerName.continuoWithdrawCards = false;
            } else if (playerName.sum > 21) {
                playerName.isAlive = false;
                playerName.sumHtml.html(`${htmlText}, You've Lost`);
                playerName.sumHtml.addClass("lose-txt");
            } else {
                playerName.sumHtml.html(htmlText);
            }
        } else {
            if (playerName.sum === 21) {
                playerName.continuoWithdrawCards = false;
                playerName.sumHtml.html("Sum = ??");
            } else if (playerName.sum > 21) {
                playerName.isAlive = false;
                playerName.sumHtml.html(`${htmlText}, You've Lost`);
                playerName.sumHtml.addClass("lose-txt");
            } else {
                playerName.sumHtml.html("Sum = ??");
            }
        }
    }
}

function riskManagement(playerName) {
    switch (playerName.risk) {
        case "no risk": 
            //sum <= 10 (no risk)
            //Assure that all players stays on game after the first withdraw & a chance for a Blackjack
            multiplyFactor = 21 - playerName.sum;
            break;
        case "low risk": 
            //sum <= 13
            //outOfGame chance if (sum = 13) => 1 / 9 = 11 %
            multiplyFactor = 9;
            break;
        case "medium risk":
            //sum <= 15
            //outOfGame chance if (sum = 15) => 2 / 8 = 25 %
            multiplyFactor = 8;
            break;
        case "high risk":
            //sum > 15
            //Critical Time. with high risk > 15 + criticalChoice = ??
            //criticalChoice random number between (1 & 3)
            let criticalChoice = Math.floor(Math.random() * 3 + 1);
            if (criticalChoice === 1) {
                //Got lucky
                multiplyFactor = 2;
            } else if (criticalChoice === 2) {
                //Highly risky
                multiplyFactor = 8;
            } else {
                //We will miss you ;)
                multiplyFactor = 13;
            }
            break;

        default:
            
            break;
    }
    return multiplyFactor;
}

function betFunction(playerName) {
    if (playerName.name.text() === userNameHtml.text()){
        userBetFunction();
        
    } else {
        const index = (min, max) => Math.floor(Math.random() * (max - min)) + min;
            if (playerName.sum <= 15) {
                bet = betArr[index(1 , 10)];
            } else {
                bet = betArr[index(10 , 21)];
            }
        playerName.betInput.val(bet);
        playerName.betHtml.html(bet);
    }
    playerName.chipsHtml.html(`Chips = $ ${playerName.chips}`);
}

function userBetFunction() {
    let userBetInputInNumbers = Number(userBetInput.val());
    let userBetHtmlInNumbers = Number(userBetHtml.text());
    //To Avoide the first input shaking in the betFunction (while firstWithdraw = true)
    if (firstWithdraw === false) {
        if (userBetInput.val() === "" || 
        userBetInputInNumbers > 100 || 
        userBetInputInNumbers < 1 || 
        userBetInputInNumbers < userBetHtml.text()) {
        userBetInput.effect("shake", {times:1}, 100);
        userWithdrawCardAllowness = false;
    } else {
        userBetHtml.html(userBetInputInNumbers);
        userWithdrawCardAllowness = true;
        if (userBetInputInNumbers > userBetHtmlInNumbers) {
            betSound.play();
        }
    }
    return userWithdrawCardAllowness
    }
}

function checkAlive(playerName){
    if (playerName.sum > 21) {
        if (playerName.name.text() === userNameHtml.text()) {
            userControlBtns.fadeOut(100);
            userBetContainer.fadeOut(100);
        } else {
            playerName.withdrawCardBtn.fadeOut(100);
            playerName.betContainer.fadeOut(100);
        }
        playerName.isAlive = false;
        timeOut(playerName);
    }
}

function winning() {
    let winImg = `<img src="images/win.png" alt="" class="win win-lose-img">`
    let loseImg = `<img src="images/lose.png" alt="" class="lose win-lose-img">`
    let highestSum = 0;
    let totalBet = 0;

    for (let i = 0; i < playersArray.length; i++) {
        //Checking if the player is alive and if his sum > highestSum
        if (playersArray[i].sum > highestSum && playersArray[i].sum <= 21) {
            //Finding the winner
            highestSum = playersArray[i].sum;
            winner = playersArray[i].name.text();
        }
        //totalBet must be outside the if, calculate all the bets & not only if the player isAlive === true
        totalBet += Number(playersArray[i].betHtml.text());
    }

    //If 2 of the remaining players got the same highestSum
    let sameSum = 0;
    for (let i = 0; i < playersArray.length; i++) {
        if (playersArray[i].sum === highestSum) {
            sameSum ++;
        }
    }

    if (sameSum === 2) {
        let onlyPlayerLostBet = 0;
        for (let i = 0; i < playersArray.length; i++) {
            if (playersArray[i].sum !== highestSum) {
                onlyPlayerLostBet = Number(playersArray[i].betHtml.text());
                playersArray[i].chips -= onlyPlayerLostBet;
                playersArray[i].chipsHtml.html(`Chips = $ ${playersArray[i].chips} ${loseImg}`);
            }
        }
        for (let i = 0; i < playersArray.length; i++) {
            if (playersArray[i].sum === highestSum) {
                playersArray[i].chips += (onlyPlayerLostBet / 2);
                playersArray[i].chipsHtml.html(`Chips = $ ${playersArray[i].chips} ${winImg}`);
            }
        }

    } else {
        //Loop to find the winner and adjust the score
        for (let i = 0; i < playersArray.length; i++) {
            if (playersArray[i].name.text() === winner) {
                //Winner
                let winnnerBetValue = Number(playersArray[i].betHtml.text());
                //Remove the winner bet from totalBet
                totalBet -= winnnerBetValue;
                playersArray[i].chips += totalBet;
                playersArray[i].chipsHtml.html(`Chips = $ ${playersArray[i].chips} ${winImg}`);
            } else {
                //Lost player
                //Remove the lost players bet from their chips
                playersArray[i].chips -= Number(playersArray[i].betHtml.text());
                playersArray[i].chipsHtml.html(`Chips = $ ${playersArray[i].chips} ${loseImg}`);
            }
        }
    }
}

function timeOut(playerName) {
    if (playerName.name.text() === userNameHtml.text()) {
        setTimeout(() => {
            playerName.block.animate({opacity: '0.5'}, "slow");
            playerName.block.html('<div class="outOfGame">Out Of Game</div>');
            userBlock.fadeOut(7000);
            pc1Block.fadeOut(7000);
            pc2Block.fadeOut(7000);
            restGameBtn.fadeIn(8000);
        }, 3000);

    } else {
        setTimeout(() => {
            playerName.block.animate({opacity: '0.5'}, "slow");
        }, 3000);
    }
}

function generateBetArray() {
    if (betArr.length === 0) {
        for (let i = 5; i <= chipsValue; i+=5) {
            betArr.push(i);
        }
    }
}
