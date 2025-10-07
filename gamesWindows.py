import os
import subprocess

def run_game(path, command):
    os.chdir(path)
    subprocess.call(command, shell=True)

def main():
    games = [
        "[1] Hangman",
        "[2] MazeEscape",
        "[3] RockPaperScissors",
        "[4] Snake",
        "[5] TextAdventure",
        "[6] TicTacToe",
        "[7] SlotMachine",
        "[e] Exit"
    ]

    for game in games:
        print(game)

    option = input("Enter a Choice: ").strip()

    current_dir = os.path.dirname(os.path.abspath(__file__))

    if option == "1":
        game = input("Python or Javascript/JS version: ").lower()
        if "js" in game:
            run_game(os.path.join(current_dir, "Hangman"), "node index.js")
        elif "py" in game:
            run_game(os.path.join(current_dir, "Hangman"), "python hangman.py")
        else:
            print("Not valid option")

    elif option == "2":
        run_game(os.path.join(current_dir, "MazeEscape"), "npm run play")

    elif option == "3":
        run_game(os.path.join(current_dir, "RockPaperScissors"), "python rockpaperscissors.py")

    elif option == "4":
        run_game(os.path.join(current_dir, "Snake"), "npm run play")

    elif option == "5":
        run_game(os.path.join(current_dir, "TextAdventures"), "npm run play")

    elif option == "6":
        game = input("Python or Javascript/JS version: ").lower()
        if "js" in game:
            run_game(os.path.join(current_dir, "TicTacToe"), "node index.js")
        elif "py" in game:
            run_game(os.path.join(current_dir, "TicTacToe"), "python tictactoe.py")
        elif option == "7":
            run_game(os.path.join(current_dir, "SlotMachine"), "python SlotMachine.py")
        else:
            print("Not valid option")     
        
    elif option == "e":
        print("Goodbye!")
    else:
        print("Invalid argument, just select the game by the number")

if __name__ == "__main__":
    main()
