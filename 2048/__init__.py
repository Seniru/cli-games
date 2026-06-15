import random
import os
import sys

# Cross-platform instant keyboard capture
try:
    import msvcrt
    def get_key():
        """Captures a keypress on Windows (arrow keys return two bytes)."""
        ch = msvcrt.getch()
        if ch in (b'\x00', b'\xe0'):  # Special key (e.g. arrows)
            ch2 = msvcrt.getch()
            if ch2 == b'H': return 'up'
            if ch2 == b'P': return 'down'
            if ch2 == b'K': return 'left'
            if ch2 == b'M': return 'right'
        if ch in (b'\r', b'\n'):
            return 'enter'
        try:
            return ch.decode('utf-8').lower()
        except UnicodeDecodeError:
            return None
except ImportError:
    import tty
    import termios
    def get_key():
        """Captures a keypress on Linux / macOS."""
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
        try:
            tty.setraw(sys.stdin.fileno())
            ch = sys.stdin.read(1)
            if ch == '\x1b':  # Escape sequence (e.g. arrows)
                ch2 = sys.stdin.read(1)
                if ch2 == '[':
                    ch3 = sys.stdin.read(1)
                    if ch3 == 'A': return 'up'
                    if ch3 == 'B': return 'down'
                    if ch3 == 'D': return 'left'
                    if ch3 == 'C': return 'right'
            if ch in ('\r', '\n'):
                return 'enter'
            return ch.lower()
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)


class Game2048:
    def __init__(self):
        """
        Initialises a new 2048 game.
        """
        self.grid = [[0 for _ in range(4)] for _ in range(4)]
        self.score = 0
        self.highscore = 0

        if os.path.exists(".2048_highscore"):
            with open(".2048_highscore", "r") as f:
                contenu = f.read().strip()
            if contenu.isdigit():
                self.highscore = int(contenu)
        self.colors = {
            2: "\033[97m",      # White
            4: "\033[93m",      # Yellow
            8: "\033[91m",      # Light red
            16: "\033[31m",     # Red
            32: "\033[35m",     # Magenta
            64: "\033[95m",     # Pink
            128: "\033[92m",    # Green
            256: "\033[96m",    # Cyan
            512: "\033[94m",    # Blue
            1024: "\033[34m",   # Dark blue
            2048: "\033[33m"    # Gold / dark yellow
        }

    def get_grid(self):
        """Returns the current grid."""
        return self.grid

    def add_random_tile(self):
        """
        Adds a 2 or a 4 in a random empty cell.
        """
        empty_cells = []
        for row in range(4):
            for col in range(4):
                if self.grid[row][col] == 0:
                    empty_cells.append((row, col))

        if not empty_cells:
            return False

        row, col = random.choice(empty_cells)
        self.grid[row][col] = 2 if random.random() < 0.9 else 4
        return True

    def print_board(self):
        """
        Displays the game grid with Unicode borders and the current score.
        """
        print(f"Score: {self.score}   │   Best Score: {self.highscore}\n")

        # Top border: ╔══════╦══════╦══════╦══════╗
        print("╔" + "══════╦" * 3 + "══════╗")

        for i, row in enumerate(self.grid):
            for cell in row:
                if cell == 0:
                    print("║      ", end="")
                else:
                    color = self.colors.get(cell, "\033[0m")
                    reset = "\033[0m"
                    print(f"║ {color}{cell:4d}{reset} ", end="")
            print("║")  # Close the row on the right

            # Separator line (except after the last row)
            if i < 3:
                # Middle separator: ╠══════╬══════╬══════╬══════╣
                print("╠" + "══════╬" * 3 + "══════╣")
            else:
                # Bottom border: ╚══════╩══════╩══════╩══════╝
                print("╚" + "══════╩" * 3 + "══════╝")

    def slide_ligne(self, ligne):
        """
        Slides all non-zero values to the left.
        """
        resultat = [x for x in ligne if x != 0]
        while len(resultat) < 4:
            resultat.append(0)
        return resultat

    def fusionne_ligne(self, ligne):
        """
        Merges identical adjacent cells and updates the score.
        """
        resultat = ligne.copy()
        for i in range(len(resultat) - 1):
            if resultat[i] != 0 and resultat[i] == resultat[i + 1]:
                resultat[i] *= 2
                self.score += resultat[i]  # Add the merged value to the score
                self.save_highscore()
                resultat[i + 1] = 0
        return resultat

    def move_left(self):
        """
        Applies the slide and merge to the LEFT across the whole grid.
        """
        moved = False
        for i in range(4):
            ligne_originale = self.grid[i].copy()
            etape1 = self.slide_ligne(ligne_originale)
            etape2 = self.fusionne_ligne(etape1)
            ligne_finale = self.slide_ligne(etape2)
            self.grid[i] = ligne_finale
            if ligne_originale != ligne_finale:
                moved = True
        return moved

    def move_right(self):
        """
        Applies the movement to the RIGHT by reversing the rows.
        """
        moved = False
        for i in range(4):
            ligne_originale = self.grid[i].copy()
            ligne_inversee = ligne_originale[::-1]
            etape1 = self.slide_ligne(ligne_inversee)
            etape2 = self.fusionne_ligne(etape1)
            ligne_finale_inversee = self.slide_ligne(etape2)
            ligne_finale = ligne_finale_inversee[::-1]
            self.grid[i] = ligne_finale
            if ligne_originale != ligne_finale:
                moved = True
        return moved

    def transpose_matrix(self):
        """
        Transposes the grid. Rows become columns.
        """
        self.grid = [list(row) for row in zip(*self.grid)]

    def move_up(self):
        """
        Applies the movement UP.
        """
        self.transpose_matrix()
        moved = self.move_left()
        self.transpose_matrix()
        return moved

    def move_down(self):
        """
        Applies the movement DOWN.
        """
        self.transpose_matrix()
        moved = self.move_right()
        self.transpose_matrix()
        return moved

    def est_victoire(self):
        """
        Checks whether the player has reached the 2048 tile.
        """
        for ligne in self.grid:
            if 2048 in ligne:
                return True
        return False

    def est_bloque(self):
        """
        Checks whether the grid is full and no merge is possible.
        Returns True if the player has lost (Game Over), False otherwise.
        """
        for row in range(4):
            for col in range(4):
                if self.grid[row][col] == 0:
                    return False

        for row in range(4):
            for col in range(3):
                if self.grid[row][col] == self.grid[row][col + 1]:
                    return False

        for col in range(4):
            for row in range(3):
                if self.grid[row][col] == self.grid[row + 1][col]:
                    return False

        return True

    def est_game_over(self):
        """
        Checks whether the game has ended in a loss.
        """
        return self.est_bloque()

    def clear_screen(self):
        """
        Clears the terminal.
        """
        os.system('cls' if os.name == 'nt' else 'clear')

    def save_highscore(self):
        """
        Saves the new high score if the current score is higher.
        """
        if self.score > self.highscore:
            self.highscore = self.score

            with open(".2048_highscore", "w") as f:
                f.write(str(self.highscore))


if __name__ == "__main__":
    jeu = Game2048()

    # Classic initialisation: 2 starting tiles
    jeu.add_random_tile()
    jeu.add_random_tile()

    print("=== WELCOME TO 2048 ===")

    # Task 2: Game loop using get_key()
    while True:
        jeu.print_board()

        # Check end-of-game conditions
        if jeu.est_victoire():
            print("🏆 You win! You reached 2048!")
            break

        if jeu.est_game_over():
            print("❌ Game Over! The grid is full and no moves are left.")
            break

        # Safe user input
        print("Move (w/↑=up, s/↓=down, a/←=left, d/→=right) or 'q' to quit.")
        action = get_key()

        moved = False
        msg_erreur = ""

        if action in ('w', 'up'):
            moved = jeu.move_up()
        elif action in ('s', 'down'):
            moved = jeu.move_down()
        elif action in ('a', 'left'):
            moved = jeu.move_left()
        elif action in ('d', 'right'):
            moved = jeu.move_right()
        elif action == 'q':
            print("Game aborted.")
            break
        else:
            msg_erreur = "⚠️ Unknown command. Use w/a/s/d or arrow keys."

        # Clear the screen just before potentially adding a tile and looping back
        jeu.clear_screen()

        # Re-display the welcome banner at the top
        print("=== WELCOME TO 2048 ===")

        if msg_erreur:
            print(msg_erreur)
            continue

        # If the move was valid, add a new tile
        if moved:
            jeu.add_random_tile()
        elif action in ('w', 's', 'a', 'd', 'up', 'down', 'left', 'right'):  # Valid key pressed but nothing moved
            print("👉 No movement possible in that direction.\n")