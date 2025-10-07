# Wordle - Command Line Edition

> Made with ❤️ by [AttAditya](https://github.com/AttAditya)

## Introduction
This is a command-line version of the popular word-guessing game, **Wordle**. The objective is to guess a secret word within a limited number of attempts. Each guess provides feedback on how close your guess is to the secret word using colored letters to represent correctness.

## How to Play
1. The game will randomly select a 5-letter word from a pre-defined word list.
2. You have **6 attempts** to guess the correct word.
3. After each guess, the letters of the word are colored to show how accurate your guess is:
   - **Green (G)**: The letter is correct and in the correct position.
   - **Yellow (Y)**: The letter is correct but in the wrong position.
   - **White (B)**: The letter is not in the word.

4. You win if you guess the word within 6 attempts, otherwise, you lose.

## Game Setup
Make sure you have the word list file in one of the following paths:
- `./words.txt`
- `./Wordle/words.txt`

Each line in the file should contain a valid 5-letter word.

## How to Run
1. Clone or download the project to your local machine.
2. Ensure you have Node.js installed (preferably version 20 or above).
3. Run the game using:
   ```bash
   npm run play
   ```

## Controls
- Input your guess when prompted (make sure it's a 5-letter word).
- The game will show feedback after each guess, and you'll know if you won or lost after the sixth attempt.

## Example
```
Welcome to WORDLE!
Guess #1: HELLO
+-----------+
| H E L L O | (feedback: colored letters)
| - - - - - |
| - - - - - |
| - - - - - |
| - - - - - |
| - - - - - |
+-----------+

Guess #2: ...
```

Good luck, and enjoy playing Wordle!
