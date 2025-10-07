# Codle - Command Line Edition

> Made with ❤️ by [AttAditya](https://github.com/AttAditya)

## Introduction

Codle is a command-line code-breaking game inspired by Wordle.
Instead of words, you guess a 4-digit secret code. The digits can repeat, and you have a limited number of attempts to crack the code. Each guess provides feedback with colors to guide you closer to the solution.

## How to Play

1.	The game will randomly generate a 4-digit secret code (digits range from 0–9, and digits may repeat).
2.	You have 4 attempts to guess the correct code.
3.	After each guess, feedback is shown for each digit:
    -	Green (G) → Correct digit in the correct position.
    -	Yellow (Y) → Correct digit but in the wrong position.
    -	White (W) → Digit is not in the code.
4.	You win if you guess the code within 4 attempts, otherwise, you lose.

## How to Run

1.	Clone or download the project to your local machine.
2.	Ensure you have Node.js installed (preferably version 20 or above).
3.	Start the game with:
    ```
    npm run play
    ```

## Controls

- Enter your guess when prompted (must be a valid 4-digit code, e.g., `1234`).
- The game will provide colored feedback after each guess.
- Keep refining until you win or exhaust your attempts.

## Example
> _Feedback Given as colored letters (G - Green, Y - Yellow, W - White), as colors are not available in markdown, so represented as text here._

```
Welcome to CODLE!
Guess #1: 1234
+---------+
| 1 2 3 4 | (feedback: GWYW)
+---------+

Guess #2: 1567
+---------+
| 1 2 3 4 | (feedback: GWYW)
| 1 5 6 7 | (feedback: GWWW)
+---------+
```

