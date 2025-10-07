import random
import time
import os

SYMBOLS = ["🍒", "🍋", "🔔", "⭐", "7️⃣", "💎"]

print("""
🎰 Welcome to the ASCII Slot Machine! 🎰

Rules:
- You start with 200 points.
- Enter the number of points you want to bet each round.
- Enter 0 to quit the game.
- The slot machine will spin and reveal 3 symbols one by one.

Scoring:
- 🎉 Three identical symbols → JACKPOT! → You win 10x your bet.
- ✨ Two identical symbols → You win 2x your bet.
- 🙁 No match → You lose your bet.

The game ends when you quit or run out of points.
Good luck!
""")

def spin():
    return [random.choice(SYMBOLS) for _ in range(3)]

def show_roller(slots):
    print("+---+---+---+")
    print(f"| {slots[0]} | {slots[1]} | {slots[2]} |")
    print("+---+---+---+")

def calculate_points(slots, mise):
    if slots[0] == slots[1] == slots[2]:
        print("🎉 JACKPOT !")
        return mise * 10
    elif slots[0] == slots[1] or slots[1] == slots[2] or slots[0] == slots[2]:
        print("✨ Two identical symbols !")
        return mise * 2
    else:
        print("🙁 Nothing ...")
        return 0

def clear():
    os.system("cls" if os.name == "nt" else "clear")

def slot_machine():
    nbPoints = 200
    
    while nbPoints > 0:
        print(f"💰 Current points : {nbPoints} Points")
        try:
            pointsChoosed = int(input("How many points do you want to put ? (0 to quitt) "))
            if pointsChoosed == 0:
                break
            if pointsChoosed > nbPoints or pointsChoosed < 0:
                print("⛔ Invalid number of points.")
                continue
        except ValueError:
            print("⛔ Please enter a number.")
            continue

        print("🔄 Roller launch...")
        slots = ["❔", "❔", "❔"]
        clear()
        show_roller(slots)
        time.sleep(0.5)

        for i in range(3):
            slots[i] = random.choice(SYMBOLS)
            clear()
            show_roller(slots)
            time.sleep(0.5)

        won = calculate_points(slots, pointsChoosed)
        nbPoints += won - pointsChoosed

    print("\n🏁 Game Over. Number of points :", nbPoints)

slot_machine()
