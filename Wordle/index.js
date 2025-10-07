// Relevant Imports
const fs = require('fs');

// Game States
const GAME_STATE = {
    NOT_STARTED: 'NOT_STARTED',
    PLAYING: 'PLAYING',
    WON: 'WON',
    LOST: 'LOST'
};

// Word Correctness States
const CORRECTNESS_STATE = {
    CORRECT: 'G',
    INCORRECT: 'B',
    PARTIAL: 'Y'
};

/**
 * Get input from the user
 * @returns {Promise} User input
 */
function getInput(message) {
    return new Promise((resolve, reject) => {
        if (message != undefined) {
            process.stdout.write(message);
        }

        process.stdin.resume();
        process.stdin.once('data', data => {
            process.stdin.pause();
            resolve(data.toString().trim());
        });
    });
};

/**
 * Salif's coloring function (modified)
 * @param {string} text Text to color
 * @param {string} color Color to apply
 * @returns {string} Colored text
 */
function coloredText(text, color) {
    const code = {
        red: 91,
        green: 92,
        blue: 34,
        cyan: 96,
        yellow: 93
    }[color];

    return code ? (`\x1b[${code}m${text}\x1b[0m`) : text;
}

/**
 * Load words from a file
 * @returns {Object} Words object
 */
function loadWords() {
    let wordsFilePath = './words.txt';

    if (!fs.existsSync(wordsFilePath)) {
        wordsFilePath = './Wordle/words.txt';
    }

    let wordsFileContent = fs.readFileSync(wordsFilePath, 'utf8');
    let wordsList = wordsFileContent.split('\n');

    let words = {};

    for (let word of wordsList) {
        word = word.trim().toUpperCase();
        words[word] = true;
    }

    return words;
}

/**
 * Wordle class
 * @returns {Object} Wordle object
 */
let Wordle = function() {
    this.gameState = GAME_STATE.NOT_STARTED;
    this.board = [];

    this.validWords = {};
    this.word = '';
    
    this.maxGuessCount = 6;
    this.guessCount = 0;
};

/**
 * Get colored title
 * @returns {string} Colored title
 */
Wordle.prototype.getColoredTitle = function() {
    let W = coloredText('W', 'green');
    let O = coloredText('O', 'green');
    let R = coloredText('R', 'green');
    let D = coloredText('D', 'green');
    let L = coloredText('L', 'white');
    let E = coloredText('E', 'yellow');

    return `${W}${O}${R}${D}${L}${E}`;
};

/**
 * Take input from the user
 * @returns {string} User input
 */
Wordle.prototype.getInput = async function(message) {
    let input = await getInput(message);
    return input;
};

/**
 * Check if a word is valid
 * @param {string} word Word to check
 * @returns {boolean} Whether the word is valid
 */
Wordle.prototype.isValidWord = function(word) {
    return !!this.validWords[word ?? ''];
};

/**
 * Get a random word
 * @returns {string} Random word
 */
Wordle.prototype.getRandomWord = function() {
    let words = Object.keys(this.validWords);
    let randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
};

/**
 * Get correctness of a word
 * @param {string} word Word to check
 * @returns {Array} Correctness array
 */
Wordle.prototype.getCorrectness = function(word) {
    let correctness = [];
    let charFreq = {};

    for (let ch of this.word) {
        charFreq[ch] = (charFreq[ch] ?? 0) + 1;
    }
    
    for (let i = 0; i < this.word.length; i++) {
        correctness.push(CORRECTNESS_STATE.INCORRECT);
    }

    for (let i = 0; i < this.word.length; i++) {
        if (this.word[i] === word[i]) {
            correctness[i] = CORRECTNESS_STATE.CORRECT;
            charFreq[word[i]]--;
        }
    }

    for (let i = 0; i < this.word.length; i++) {
        if (!this.word.includes(word[i])) {
            continue;
        }

        if (charFreq[word[i]] === 0) {
            continue;
        }

        if (correctness[i] === CORRECTNESS_STATE.CORRECT) {
            continue;
        }
        
        correctness[i] = CORRECTNESS_STATE.PARTIAL;
        charFreq[word[i]]--;
    }

    return correctness;
};

/**
 * Color a character based on correctness
 * @param {string} ch Character
 * @param {string} correctness Correctness state
 * @returns {string} Colored character
 */
Wordle.prototype.colorCharFromCorrectness = function(ch, correctness) {
    if (correctness === CORRECTNESS_STATE.CORRECT) {
        return coloredText(ch, 'green');
    } else if (correctness === CORRECTNESS_STATE.PARTIAL) {
        return coloredText(ch, 'yellow');
    } else {
        return coloredText(ch, 'white');
    }
};

/**
 * Print the board
 * @returns {void} Print the board
 */
Wordle.prototype.printBoard = function() {
    console.log(`+-----------+`);

    for (let guess of this.board) {
        let word = guess.word;
        let correctness = guess.correctness;

        let coloredWord = word.split('');
        coloredWord = coloredWord.map((ch, i) => {
            return this.colorCharFromCorrectness(ch, correctness[i]);
        });

        console.log(`| ${coloredWord.join(' ')} |`);
    }

    for (let i = this.guessCount + 1; i <= this.maxGuessCount; i++) {
        console.log(`| - - - - - |`);
    }

    console.log(`+-----------+`);
    console.log();
};

/**
 * Initialize the game
 * @returns {void} Initialize the game
 */
Wordle.prototype.init = function() {
    this.validWords = loadWords();
    this.word = this.getRandomWord();
    this.gameState = GAME_STATE.PLAYING;
    this.board = [];
};

/**
 * Update the game state
 * @returns {void} Update the game state
 */
Wordle.prototype.updateGameState = function() {
    let lastGuess = this.board[this.board.length - 1];
    let correctness = lastGuess.correctness;

    if (correctness.every(c => c === CORRECTNESS_STATE.CORRECT)) {
        this.gameState = GAME_STATE.WON;
    } else if (this.guessCount >= this.maxGuessCount) {
        this.gameState = GAME_STATE.LOST;
    }
}

/**
 * Make a guess
 * @returns {Promise} Make a guess
 */
Wordle.prototype.makeGuess = async function() {
    let guess = await this.getInput(`Guess #${this.guessCount + 1}: `);
    guess = guess.toUpperCase();

    if (!this.isValidWord(guess)) {
        let warningText = coloredText('WARNING', 'yellow');
        let invalidText = coloredText('Invalid word!', 'red');

        console.log(`${warningText}: ${invalidText}`);
        return;
    }

    let correctness = this.getCorrectness(guess);
    this.board.push({
        word: guess,
        correctness: correctness
    });

    this.guessCount++;
};

/**
 * Game loop
 * @returns {Promise} Game loop
 */
Wordle.prototype.gameLoop = async function() {
    this.printBoard();
    while (this.gameState === GAME_STATE.PLAYING) {
        await this.makeGuess();

        this.updateGameState();
        this.printBoard();

        if (this.gameState === GAME_STATE.WON) {
            let winText = coloredText('Congratulations! You won!', 'green');

            console.log(winText);
            console.log(`Guess Count: ${this.guessCount}`);
        } else if (this.gameState === GAME_STATE.LOST) {
            let loseText = coloredText('Sorry! You lost!', 'red');

            console.log(loseText);
            console.log(`The word was: ${this.word}`);
        }
    }
};

/**
 * Play the game
 * @returns {Promise} Play the game
 */
Wordle.prototype.play = async function() {
    console.log(`Welcome to ${this.getColoredTitle()}!`);
    this.init();
    await this.gameLoop();
};

// Run the game
(async () => {
    let game = new Wordle();
    await game.play();
})();

