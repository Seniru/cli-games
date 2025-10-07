import os
import sys

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    script_path = os.path.join(script_dir, "hangman.py")
    os.system(f"python3 {script_path}")