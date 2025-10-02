function getInput(message) {
  return new Promise((resolve) => {
    if (message !== undefined) {
      process.stdout.write(message);
    }
    
    process.stdin.resume();
    process.stdin.once("data", (data) => {
      process.stdin.pause();
      resolve(data.toString().trim());
    });
  });
}

function coloredText(text, color) {
  const code = {
    white: 97,
    green: 92,
    yellow: 93,
    red: 91,
  }[color];

  return code
    ? `\x1b[${code}m${text}\x1b[0m`
    : text;
}

const textG = (text) => coloredText(text, "green");
const textY = (text) => coloredText(text, "yellow");
const textW = (text) => coloredText(text, "white");
const textR = (text) => coloredText(text, "red");

const RULES = `
================ Codle Rules ================

What is C0DLE?

- Codle is a 4-digit code guessing game.
- Each digit ranges from 0-9 and can repeat.

How to Play:

1. You have 4 attempts to guess the correct code.
2. After each guess, you'll receive feedback:
  - ${textG("Green")}: Correct digit in the correct position.
  - ${textY("Yellow")}: Correct digit in the wrong position.
  - ${textW("White")}: Incorrect digit.
3. Use the feedback to refine your next guess.

=============================================
`;

function Game() {
  let code = "";
  let attempts = 4;
  let guesses = [];

  function displayRules() {
    console.log(RULES);
  }

  function colorCode(guess) {
    let result = [];

    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === code[i]) {
        result.push(textG(guess[i]));
        continue;
      }

      if (code.includes(guess[i])) {
        result.push(textY(guess[i]));
        continue;
      }

      result.push(textW(guess[i]));
    }

    return result;
  }
  
  function displayBoard() {
    console.log("+---------+");
    
    guesses.forEach((guess) => {
      console.log(`| ${colorCode(guess).join(" ")} |`);
    });
    
    console.log("+---------+");
  }
  
  function generateCode() {
    return Math.random().toString().slice(2, 6);
  }

  function validateGuess(guess) {
    return guess.length === 4 && guess.split("").every(
      (char) => ("0123456789".includes(char))
    );
  }
  
  async function playTurn() {
    console.log(`\nAttempts left: ${attempts}`);

    let guess = await getInput(`Enter your guess: `);
    while (!validateGuess(guess)) {
      console.log(textR("Invalid input! Please enter a 4-digit number."));
      guess = await getInput(`Enter your guess: `);
    }
    guesses.push(guess);

    displayBoard();
    attempts--;

    if (guess === code) {
      console.log(textG("Congratulations! You've guessed the code!"));
      attempts = 0;
      return;
    }

    if (attempts === 0) {
      console.log(textR("You lost!"));
      console.log(textR("Correct Code: " + code));
      
      return;
    }
  }
  
  async function playCodle() {
    displayRules();
    code = generateCode();

    while (attempts > 0)
      await playTurn();
  }

  return { playCodle };
}

(async () => {
  const game = Game();
  await game.playCodle();
})();
  
