const readline = require('readline');
const esc = require('ansi-escapes');
const { maps, symbols } = require('./maps.json');
const Hero = require('./Hero');
const { generateRandomMaze } = require('./generateRandomMap');

let round = 0;
let map = null;
let hero = null;
let gameStart = false;
let useRandom = false;
let moveCount = 0;
let totalMoves = 0;

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
    if (!gameStart) {
        if (key.name === '1') {
            useRandom = false;
            startGame();
        } else if (key.name === '2') {
            useRandom = true;
            startGame();
        }
        return;
    }

    if (key.name === 'q' || (key.name === 'z' && key.ctrl)) {
        console.log("Thank you for playing!");
        console.log(esc.cursorShow);
        process.exit(0);
    }

    if (hero.hasWon()) {
        if (!useRandom && round + 1 < maps.length) {
            round++;
            map = maps[round];
            hero.nextMap(map);
        } else if (useRandom) {
            console.log(clr("🎉 Congratulations! You escaped the maze!", "green"));
            console.log(esc.cursorShow);
            process.exit(0);
        } else {
            console.log(clr("🎉 Congratulations! You've completed all the maps", "green"));
            console.log(clr("Your number of moves is " + totalMoves, "blue"));
            console.log(esc.cursorShow);
            process.exit(0);
        }
        draw();
        return;
    }

    switch (key.name) {
        case "up":
            hero.moveUp(); break;
        case "down":
            hero.moveDown(); break;
        case "left":
            hero.moveLeft(); break;
        case "right":
            hero.moveRight(); break;
        default:
            return;
    }

    moveCount++;
    totalMoves++;
    draw();
});

function startGame() {
    if (useRandom) {
        map = generateRandomMaze(15, 15);
    } else {
        map = maps[round];
    }
    hero = new Hero(map);
    gameStart = true;
    welcome();
    draw();
}

function draw() {
    let res = "    " + (symbols.wall + " ").repeat(map[0].length) + "\n";
    for (let row of map) {
        res += "  " + symbols.wall + " ";
        for (let col of row) res += col + " ";
        res += symbols.wall + "\n";
    }
    res += "    " + (symbols.wall + " ").repeat(map[0].length) + "\n";
    res = res.replace("♟", clr("♟", "yellow")).replace(/▣/g, clr("▣", "green"));

    res += `\n${clr("Moves:", "blue")} ${moveCount}\n`;
    res += `${clr("Total Moves:", "blue")} ${totalMoves}\n`;

    print(res);

    if (hero.hasWon()) {
        console.log(clr("Press any key to continue", "cian"));
    }
}

function welcome() {
    const logo = `
         __  __    __    ____  ____    ____  ___   ___    __    ____  ____
        (  \\/  )  /__\\  (_   )( ___)  ( ___)/ __) / __)  /__\\  (  _ \\( ___)
         )    (  /(__)\\  / /_  )__)    )__) \\__ \\( (__  /(__)\\  )___/ )__)
        (_/\\/\\_)(__)(__)(____)(____)  (____)(___/ \\___)(__)(__)(__)  (____)
    `;
    print(`
    Welcome to
    ${clr(logo, 'yellow')}
    Maze escape game for Salif's CLI game collection.

    ${clr('Help', 'green')}
     - This is you: ♟
     - This is your goal: ▣

     Move your character using arrow keys and reach your goal while avoiding walls.

    ${clr('Select game mode:', 'blue')}
     ${clr('1.', 'cian')} Play with existing maps (from maps.json)
     ${clr('2.', 'cian')} Play with random maze (increasing size)

    ${clr('Press 1 or 2 to start...', 'yellow')}
    `);
}

function clr(text, color) {
    const code = { red: 91, green: 92, blue: 34, cian: 96, yellow: 93 }[color];
    return code ? `\x1b[${code}m${text}\x1b[0m` : text;
}

function print(str, hide = true) {
    console.log(esc.clearTerminal);
    console.log(str);
    console.log(hide ? esc.cursorHide : esc.cursorShow);
}

function main() {
    welcome();
}

main();
