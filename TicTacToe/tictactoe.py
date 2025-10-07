gamemat = [0] * 4
for i in range(4):
    gamemat[i] = [0] * 4
player = 1
gameEnd = False
gameResult = None
isComputerGame = False
computerPlayer = 2

def isBoardFull():
    for i in range(1, 4):
        for j in range(1, 4):
            if gamemat[i][j] == 0:
                return False
    return True

def minimax(board, depth, isMaximizing):
    result = checkWinningConditions()
    if result != 0:
        # If computer wins, return positive score
        # If opponent wins, return negative score
        return 10 if result == computerPlayer else -10
    
    if isBoardFull():
        return 0
    
    if isMaximizing:
        bestScore = float('-inf')
        for i in range(1, 4):
            for j in range(1, 4):
                if board[i][j] == 0:
                    board[i][j] = computerPlayer
                    score = minimax(board, depth + 1, False)
                    board[i][j] = 0
                    bestScore = max(score, bestScore)
        return bestScore
    else:
        bestScore = float('inf')
        for i in range(1, 4):
            for j in range(1, 4):
                if board[i][j] == 0:
                    board[i][j] = 3 - computerPlayer  # opponent's number
                    score = minimax(board, depth + 1, True)
                    board[i][j] = 0
                    bestScore = min(score, bestScore)
        return bestScore

def getComputerMove():
    bestScore = float('-inf')
    bestMove = None
    
    for i in range(1, 4):
        for j in range(1, 4):
            if gamemat[i][j] == 0:
                gamemat[i][j] = computerPlayer
                score = minimax(gamemat, 0, False)
                gamemat[i][j] = 0
                
                if score > bestScore:
                    bestScore = score
                    bestMove = (i, j)
    
    return bestMove

def readInput(currentPlayer):
    global player
    if isComputerGame and currentPlayer == computerPlayer:
        # Computer's turn
        x, y = getComputerMove()
        gamemat[x][y] = currentPlayer
        player = int(not bool(currentPlayer-1)) + 1
        print("Computer played at position", x, y)
        renderGamemat()
        return

    print("Player " + str(currentPlayer) + " (input x and y, seperated with a space): ", end = "")
    try:
        x,y = input().split()
        x = int(x)
        y = int(y)
    except ValueError:
        print("Invalid move")
        readInput(currentPlayer)
        return
    if x >= 4 or y >= 4 or x <= 0 or y <= 0:
        print("Invalid move")
        readInput(currentPlayer)
        return
    if gamemat[x][y] != 0:
        # Occupied
        print("Invalid move")
        readInput(currentPlayer)
        return
    else:
        gamemat[x][y] = currentPlayer # 0 => blank / 1 => player 1 / 2 => player 2
    player = int(not bool(currentPlayer-1)) + 1

    print("player: " + str(player))
    renderGamemat()


def printPos(x, y):
    toPrint = None
    if gamemat[x][y]:
        toPrint = "X" if gamemat[x][y] == 1 else "O"
    else:
        toPrint = " "
    return str(toPrint)

def renderGamemat():
    print("     1 | 2 | 3 => x-axis")
    print("   -------------")
    print(" 1 | " + printPos(1, 1) + " | " + printPos(2, 1) + " | " + printPos(3 ,1) + " |")
    print("   -------------")
    print(" 2 | " + printPos(1, 2) + " | " + printPos(2, 2) + " | " + printPos(3, 2) + " |")
    print("   -------------")
    print(" 3 | " + printPos(1, 3) + " | " + printPos(2, 3) + " | " + printPos(3, 3) + " |")
    print(" |")
    print("y-axis")
    print()

def checkWinningConditions():
    g = gamemat
    # Check rows
    for i in range(1, 4):
        if g[i][1] != 0 and g[i][1] == g[i][2] == g[i][3]:
            return g[i][1]
    
    # Check columns
    for i in range(1, 4):
        if g[1][i] != 0 and g[1][i] == g[2][i] == g[3][i]:
            return g[1][i]
    
    # Check diagonals
    if g[1][1] != 0 and g[1][1] == g[2][2] == g[3][3]:
        return g[1][1]
    if g[1][3] != 0 and g[1][3] == g[2][2] == g[3][1]:
        return g[1][3]
    
    return 0


def resetAllVar():
    global gamemat, player, gameEnd, gameResult, isComputerGame, computerPlayer
    gamemat = [0] * 4
    for i in range(4):
        gamemat[i] = [0] * 4
    player = 1
    gameEnd = False
    gameResult = None
    isComputerGame = False
    computerPlayer = 2

def gameInit():
    global isComputerGame, computerPlayer, gameEnd, gameResult
    resetAllVar()
    
    print("Choose game mode:")
    print("1. Two players")
    print("2. Play against computer")
    choice = input("Enter your choice (1 or 2): ")
    
    if choice == "2":
        isComputerGame = True
        print("You will be Player 1 (X)")
        print("Computer will be Player 2 (O)")
    
    gameEnd = False
    while not gameEnd:
        for i in range(5):
            print()
        renderGamemat()
        readInput(player)
        gameResult = checkWinningConditions()
        if gameResult != 0:
            gameEnd = True
        elif isBoardFull():
            gameEnd = True
            gameResult = 0
    
    # Game ends
    if gameResult == 0:
        print("It's a draw!")
    else:
        if isComputerGame and gameResult == computerPlayer:
            print("Computer wins!")
        else:
            print("Player " + str(gameResult) + " wins!")
    
    print()
    print("Do you want to play again? Yes/No/Y/N")
    tmp = input().lower()
    if tmp == "yes" or tmp == "y":
        main()
        return
    else:
        exit()




def main():
    for i in range(10):
        print()
    print("Welcome to Tic Tac Toe")
    print("This game needs 2 players")
    print("Press enter to start!")
    input()
    gameInit()

main()