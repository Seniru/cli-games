# CLI Games

> Games in the terminal

[![Run on Repl.it](https://repl.it/badge/github/salif/cli-games)](https://repl.it/@AllAwesome497/cli-games)

CLI Games is a community-driven collection of games that could be run in your terminal! Currently this project has many games including,
- Hangman
- Maze Escape
- Text Adventures
- Tic-Tac-Toe
- Rock, Paper, Scissors

*And more in the future!*

## How to Install?

Installation is very simple.

```bash
#Clone the repo
git clone https://github.com/salif/cli-games.git
cd cli-games
#install the dependences for the games (for Unix systems and Lunix)
bash install-games.sh
```

## How to Play?

### for Windows

After cloning, run `dir` to get a list of available directories of games. Then navigate to your favourite game using the `cd` command

**Eg:** `cd Hangman`

Read the **README** file in the respective directory to get more instruction about installation and playing.
Most of the games support different languages (including `node-js` and `python`) and the choice is yours!

### for Unix/Linux

just type
```bash
bash games.sh
```
and select the game by the number or 'e' for exit. If a game has a JS and Python version, you can choose which one you prefer you to play

**New alternative**
Type 
```bash
./menu.sh
```
and select the game using arrows or type its name to easily selecting it. If a game has a JS and Python version, you can choose which one you want to play

## Contributing

Want to contribute this project? We are happy to accept your contributions! You can do the following to contribute us

- Making / Implementing suggestions and new features
- Creating / Fixing bug reports
- Improving the performance
- [Creating new games](#creating-new-games)
- Spreading the word!

### Creating new games

Before creating a new game, please check if it is available already, or somebody is working on creating that game. Then make sure to create a new issue to make sure others are OK with it. If you got approval for your suggestion, then move one! Code your game and create a PR with the new changes. We'll be happy to introduce your new game :smile:


🛠️ For Developers

A new script, `menu.sh`, now handles the game menu, so you don’t need to manually edit `games.sh` anymore.
If you’re not using `menu.sh`, you’re free to manually add your game to `games.sh`.

Create a new folder named after your game. Use one of the following structures depending on your language:

Python:

```
YourGame/
├── __init__.py         # Main entry point
└── requirements.txt    # Python dependencies
````

JavaScript:

```
YourGame/
├── index.js            # Main entry point
├── package.json        # Project metadata and dependencies
└── package-lock.json   # Exact dependency versions
````

Make sure __init__.py (Python) or index.js (JavaScript) contains the code that runs your game.


**This project is driven on community basis. So we are happy to accept your contributions a lot!**
