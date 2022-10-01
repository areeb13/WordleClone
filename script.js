import { WORDS } from "./words.js";
console.log('hello');
const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
//used to debug 
console.log(rightGuessString);

//creates gameboard of 5 x 5 boxes
function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"
        
        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

initBoard()

//checks keyboard button press
document.addEventListener("keyup", (event) => {
    //no more guesses
    if (guessesRemaining === 0) {
        return;
    }

    let pressedKey = String(event.key);
    //backspace
    if (pressedKey === "Backspace" && nextLetter != 0) {
        deleteLetter();
        return;
    }
    
    //check guess if hit enter
    if (pressedKey === "Enter") {
        checkGuess();
        return;
    }

    //check if valid letter then add
    let found = pressedKey.match(/[a-z]/gi);
    if (!found || found.length > 1) {
        return;
    } else {
        insertLetter(pressedKey)
    }
})

//for keyboard presses
function insertLetter (pressedKey) {
    //no more space
    if (nextLetter === 5) {
        return;
    }

    pressedKey = pressedKey.toLowerCase();

    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let box = row.children[nextLetter]
    animateCSS(box, "pulse")
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

//delete letter if backspace used
function deleteLetter (pressedKey) {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let box = row.children[nextLetter - 1];
    box.textContent = "";
    box.classList.remove("filled-box");
    currentGuess.pop();
    nextLetter -= 1;
}

function checkGuess() {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let guessString = '';
    let rightGuess = Array.from(rightGuessString);

    //collect string of current word
    for (const val of currentGuess) {
        guessString += val;
    }

    //check length is correct
    if (guessString.length != 5) {
        alert ("Word is not long enough!");
        return;
    }
    
    if (!WORDS.includes(guessString)) {
        alert("Not a word");
        return;
    }

    for (let i = 0; i < 5; i++) {
        let letterColor = '';
        let box = row.children[i];
        let letter = currentGuess[i];

        let letterPosition = rightGuess.indexOf(currentGuess[i]);

        //check if letter in correct guess
        if (letterPosition === -1) {
            letterColor = 'grey';
        } else {
            //check if letter in the correct index
            if (currentGuess[i] === rightGuess[i]) {
                letterColor = 'green';
            } else {
                letterColor = 'darkgoldenrod';
            }
            
            rightGuess[letterPosition] = "#";
        }

        let delay = 250 * i
        setTimeout(()=> {
            //flip box
            animateCSS(box, 'flipInX')
            //shade box
            box.style.backgroundColor = letterColor
            shadeKeyboard(letter, letterColor)
        }, delay)
    }

    //word was corrent, end game
    if (guessString === rightGuessString) {
        alert("CORRECT GUESS! GAME OVER!");
        guessesRemaining = 0;
        return;
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        //run of guesses, end of game
        if (guessesRemaining === 0 ) {
            alert("NO MORE GUESSES! GAME OVER!");
            alert(`The word was: "${rightGuessString}"`);
        }
    }
}

//shades keyboard depending on if taken letter
function shadeKeyboard(letter, color) {
    //loop through keyboard and shade
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backGroundColor;
            if (oldColor === 'green') {
                return;
            }

            if (oldColor === 'yellow' && color !== 'green') {
                return;
            }

            elem.style.backGroundColor = color;
            break;
        }
    }
}

//onscreen keyboard
document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target

    if (!target.classList.contains("keyboard-button")) {
        return
    }
    
    let key = target.textContent
    
    if (key == "Del") {
        key = "Backspace"
    }

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

//animation for wordle
const animateCSS = (element, animation, prefix = 'animate__') =>
  // create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');
    
    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

