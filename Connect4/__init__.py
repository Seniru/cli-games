import random
import os
import sys

RED = "\033[91m"
YELLOW = "\033[93m"
RESET = "\033[0m"

# Cross-platform instant keyboard capture
try:
    import msvcrt
    def get_key():
        """Captures a keypress on Windows (arrow keys return two bytes)."""
        ch = msvcrt.getch()
        if ch in (b'\x00', b'\xe0'):  # Special key (e.g. arrows)
            ch2 = msvcrt.getch()
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
                    if ch3 == 'D': return 'left'
                    if ch3 == 'C': return 'right'
            if ch in ('\r', '\n'):
                return 'enter'
            return ch.lower()
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)


class Connect4:
    def __init__(self):
        """
        Initialises a Connect 4 game.
        """
        self.grid = [[0 for _ in range(7)] for _ in range(6)]
        self.current_player = "X"
        self.winning_cells = []

        # STORY-04 - Task 1: Score system
        self.score_j1 = 0  # Player X score
        self.score_j2 = 0  # Player O score

    def get_grid(self):
        """Returns the grid."""
        return self.grid

    def get_current_player(self):
        """Returns the current player."""
        return self.current_player

    def switch_player(self):
        """Switches the active player: X <-> O"""
        if self.current_player == "X":
            self.current_player = "O"
        else:
            self.current_player = "X"

    def clear_screen(self):
        """Clears the terminal screen."""
        os.system('cls' if os.name == 'nt' else 'clear')

    def reinitialiser_manche(self):
        """
        Task 2: Resets only the grid and winning cells for a new round,
        while preserving the session scores.
        """
        self.grid = [[0 for _ in range(7)] for _ in range(6)]
        self.winning_cells = []
        self.current_player = "X"  # Player X starts the new round

    def afficher_grille(self, col_curseur=-1):
        """
        Displays the expanded grid (square-like) to fix the terminal aspect ratio
        and perfectly aligns the ▼ cursor at the centre of the column.
        """
        # Magic formula: the centre of column 'c' is exactly at index (2 + 4 * c)
        if col_curseur != -1:
            print(" " * (2 + 4 * col_curseur) + "▼")
        else:
            print()

        # Top border (3 horizontal units per cell)
        print("┌───┬───┬───┬───┬───┬───┬───┐")

        for i, row in enumerate(self.grid):
            ligne = []
            for j, cell in enumerate(row):
                if (i, j) in self.winning_cells:
                    token = f"\033[92m●{RESET}"  # Green for winning cells
                elif cell == "X":
                    token = f"{RED}●{RESET}"
                elif cell == "O":
                    token = f"{YELLOW}●{RESET}"
                else:
                    token = " "  # Empty cell

                # Pad the token with one space on each side to keep a square shape
                ligne.append(f" {token} ")

            # Assemble the row with vertical separators
            print("│" + "│".join(ligne) + "│")

            # Internal separator rows
            if i < 5:
                print("├───┼───┼───┼───┼───┼───┼───┤")

        # Bottom border
        print("└───┴───┴───┴───┴───┴───┴───┘")
        # Column numbers spaced to match the new design
        print("  0   1   2   3   4   5   6 ")

    def placer_jeton(self, colonne):
        """
        Places the current player's token in the chosen column.
        """
        if colonne < 0 or colonne >= 7:
            return False

        for ligne in range(5, -1, -1):
            if self.grid[ligne][colonne] == 0:
                self.grid[ligne][colonne] = self.current_player
                return True
        return False

    def verifier_victoire(self):
        joueur = self.current_player

        # Horizontal check
        for ligne in range(6):
            for col in range(4):
                if (
                    self.grid[ligne][col] == joueur and
                    self.grid[ligne][col + 1] == joueur and
                    self.grid[ligne][col + 2] == joueur and
                    self.grid[ligne][col + 3] == joueur
                ):
                    self.winning_cells = [
                        (ligne, col),
                        (ligne, col + 1),
                        (ligne, col + 2),
                        (ligne, col + 3)
                    ]
                    return True

        # Vertical check
        for ligne in range(3):
            for col in range(7):
                if (
                    self.grid[ligne][col] == joueur and
                    self.grid[ligne + 1][col] == joueur and
                    self.grid[ligne + 2][col] == joueur and
                    self.grid[ligne + 3][col] == joueur
                ):
                    self.winning_cells = [
                        (ligne, col),
                        (ligne + 1, col),
                        (ligne + 2, col),
                        (ligne + 3, col)
                    ]
                    return True

        # Descending diagonal check (\)
        for ligne in range(3):
            for col in range(4):
                if (
                    self.grid[ligne][col] == joueur and
                    self.grid[ligne + 1][col + 1] == joueur and
                    self.grid[ligne + 2][col + 2] == joueur and
                    self.grid[ligne + 3][col + 3] == joueur
                ):
                    self.winning_cells = [
                        (ligne, col),
                        (ligne + 1, col + 1),
                        (ligne + 2, col + 2),
                        (ligne + 3, col + 3)
                    ]
                    return True

        # Ascending diagonal check (/)
        for ligne in range(3, 6):
            for col in range(4):
                if (
                    self.grid[ligne][col] == joueur and
                    self.grid[ligne - 1][col + 1] == joueur and
                    self.grid[ligne - 2][col + 2] == joueur and
                    self.grid[ligne - 3][col + 3] == joueur
                ):
                    self.winning_cells = [
                        (ligne, col),
                        (ligne - 1, col + 1),
                        (ligne - 2, col + 2),
                        (ligne - 3, col + 3)
                    ]
                    return True

        return False

    def verifier_match_nul(self):
        """Checks whether the grid is full."""
        for ligne in self.grid:
            if 0 in ligne:
                return False
        return True

    def jouer(self):
        """
        Updated main game loop.
        Handles successive rounds and the restart prompt (Task 2).
        """
        while True:  # <-- OUTER LOOP (Sessions / Rounds)
            colonne_actuelle = 3
            msg_status = ""
            manche_terminee = False

            while True:  # <-- INNER LOOP (Turns within a round)
                self.clear_screen()
                print("=== CONNECT 4 — ARCADE MODE ===")
                print(f"SCORES | Player X (Red): {self.score_j1} - Player O (Yellow): {self.score_j2}")
                print("-" * 33)
                print(f"Current player: {self.current_player}")
                print("Use ◄ and ► to move, ENTER to drop, 'q' to quit.")

                if msg_status:
                    print(msg_status)
                    msg_status = ""
                else:
                    print()

                self.afficher_grille(colonne_actuelle)
                touche = get_key()

                if touche == 'left':
                    colonne_actuelle = max(0, colonne_actuelle - 1)
                elif touche == 'right':
                    colonne_actuelle = min(6, colonne_actuelle + 1)
                elif touche == 'q':
                    print("\nGame aborted. Thanks for playing!")
                    return  # Exits the program entirely
                elif touche == 'enter':
                    if self.placer_jeton(colonne_actuelle):
                        if self.verifier_victoire():
                            if self.current_player == "X":
                                self.score_j1 += 1
                            else:
                                self.score_j2 += 1

                            self.clear_screen()
                            print("=== END OF ROUND ===")
                            print(f"SCORES | Player X: {self.score_j1} - Player O: {self.score_j2}")
                            self.afficher_grille()
                            print(f"🏆 Congratulations! Player {self.current_player} wins the round!")
                            manche_terminee = True
                            break  # Exits the turn loop

                        if self.verifier_match_nul():
                            self.clear_screen()
                            print("=== END OF ROUND ===")
                            print(f"SCORES | Player X: {self.score_j1} - Player O: {self.score_j2}")
                            self.afficher_grille()
                            print("🤝 Draw! The grid is full.")
                            manche_terminee = True
                            break  # Exits the turn loop

                        self.switch_player()
                    else:
                        msg_status = "⚠️ Error: Column is full! Please choose another one."

            # End-of-round choice screen
            if manche_terminee:
                print("\n👉 Press 'r' to play another round or 'q' to quit.")
                while True:
                    choix = get_key()
                    if choix == 'r':
                        self.reinitialiser_manche()
                        break  # Exits the wait loop and loops back to the outer loop
                    elif choix == 'q':
                        print("Thanks for playing!")
                        return  # Closes the application entirely


# --- ENTRY POINT ---
if __name__ == "__main__":
    jeu = Connect4()
    jeu.jouer()