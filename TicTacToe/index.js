let player = 1
let p1 = null
let p2 = null
let nl = '\n  -------------\n'
let board = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' '],
]
let gameInit = false
let isComputerGame = false
let computerSymbol = 'O'

let input = process.stdin

function print(out) {
    process.stdout.write(out)
}

function printBoard() {
    let res = '    1   2   3 \n' + nl
    for (let row in board) {
        res += (1 - -row) + " | " + board[row].join(' | ') + ' |\n' + nl
    }
    print(res)
}

function main() {
    if (!gameInit) {
        print("Please enter Player 1 name: ")
    }
}

function prompt() {
    print(`\nIt's ${clr(player == 1 ? p1 : p2, 'yellow')}'s turn. \nPlease enter the position of row and column you like to play: `)
}

function check(data) {
    data = data.toString().replace(/\n/, '').trim()
    if (/^(1|2|3)\s+(1|2|3)$/gi.test(data)) {
        return data.toString().replace(/\s+/g, ' ').split(' ')
    }
    print(clr("Wrong input!\n", 'red'))
    prompt()
    return false
}

function isWinner(p) {
    let m = p == 1 ? 'X' : 'O'
    return checkDiagonals(m) || checkRows(m) || checkColumns(m)
}

function isStuck() {
    let isStuck = true
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == ' ') {
                isStuck = false
            }
        }
    }
    return isStuck
}

function checkRows(m) {
    for (let row of board) {
        if (row[0] == m && row[1] == m && row[2] == m) return true
    }
    return false
}

function checkColumns(m) {
    for (let col in board) {
        if (board[0][col] === m && board[1][col] === m && board[2][col] === m) return true
    }
    return false
}

function checkDiagonals(m) {
    return (board[0][0] === m && board[1][1] === m && board[2][2] === m) || (board[2][0] === m && board[1][1] === m && board[0][2] === m)
}

/*Coloring function by Salif*/
function clr(text, color) {
    const code = { red: 91, green: 92, blue: 34, cian: 96, yellow: 93 }[color]
    if (code) return "\x1b[" + code + "m" + text + "\x1b[0m"
}

function minimax(board, depth, isMaximizing) {
    // Check terminal states
    if (isWinner(2)) return -10 + depth  // Computer wins
    if (isWinner(1)) return 10 - depth   // Player wins
    if (isStuck()) return 0              // Draw

    if (isMaximizing) {
        let bestScore = -Infinity
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === ' ') {
                    board[i][j] = 'X'
                    let score = minimax(board, depth + 1, false)
                    board[i][j] = ' '
                    bestScore = Math.max(score, bestScore)
                }
            }
        }
        return bestScore
    } else {
        let bestScore = Infinity
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === ' ') {
                    board[i][j] = 'O'
                    let score = minimax(board, depth + 1, true)
                    board[i][j] = ' '
                    bestScore = Math.min(score, bestScore)
                }
            }
        }
        return bestScore
    }
}

function findBestMove() {
    let bestScore = Infinity // Infinity since computer is minimizing
    let move = { row: -1, col: -1 }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === ' ') {
                board[i][j] = 'O'  // Computer plays 'O'
                let score = minimax(board, 0, true)  // true since next move is player's
                board[i][j] = ' '
                if (score < bestScore) {  // Changed to < since we're minimizing
                    bestScore = score
                    move.row = i
                    move.col = j
                }
            }
        }
    }
    return move
}

function makeComputerMove() {
    const move = findBestMove()
    board[move.row][move.col] = computerSymbol
    printBoard()
    
    if (isWinner(2)) {
        print(clr(`Computer wins!\n`, 'green'))
        process.exit()
    }
    if (isStuck()) {
        print(clr(`Nobody wins\n`, 'yellow'))
        process.exit()
    }
    
    player = 1
    prompt()
}

/**LISTENERS**/

input.on('data', data => {
    if (!gameInit) {
        if (!p1) {
            p1 = data.toString().replace(/\n/g, '')
            print("Please enter Player 2 name (or 'computer' to play against AI): ")
        }
        else if (!p2) {
            p2 = data.toString().replace(/\n/g, '')
            if (p2.toLowerCase() === 'computer') {
                isComputerGame = true
                p2 = 'Computer'
            }
            gameInit = true
            printBoard()
            prompt()
        }
    } else {
        if (check(data)) {
            let i = check(data).map(x => parseInt(x) - 1)
            if (board[i[0]][i[1]] !== ' ') {
                print(clr('Invalid move! Somebody has already marked it down\n', 'red'))
                prompt()
            } else {
                board[i[0]][i[1]] = player == 1 ? 'X' : 'O'
                if (isWinner(player)) {
                    printBoard()
                    print(clr(`Congrats! ${player == 1 ? p1 : p2} is the winner!!!\n`, 'green'))
                    process.exit()
                }
                if (isStuck()) {
                    printBoard()
                    print(clr(`Nobody wins\n`, 'yellow'))
                    process.exit()
                }
                player = player == 1 ? 2 : 1
                printBoard()
                
                if (isComputerGame && player === 2) {
                    print(clr("Computer is thinking...\n", 'yellow'))
                    setTimeout(makeComputerMove, 1000)
                } else {
                    prompt()
                }
            }
        }
    }
})

main()
