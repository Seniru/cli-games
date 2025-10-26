# 🐍 Snake Game

A classic Snake game implementation for the terminal with progressive difficulty and an intuitive menu system.

## Features

- 🎮 **Smooth Gameplay**: Responsive arrow key controls
- ⚡ **Progressive Speed**: Game speed increases as you score more points
- 📊 **Visual Speed Indicator**: Real-time display of current difficulty level
- 🎯 **Main Menu**: Professional welcome screen with instructions
- 🔄 **Multiple Options**: Restart, return to menu, or quit after game over
- 🎨 **Colorful Interface**: Beautiful ANSI colors for enhanced visual experience

## How to Install

```bash
# Navigate to the Snake directory
cd Snake

# Install dependencies
npm install
```

## How to Play

```bash
# Run the game
npm run play
```

## Controls

### Main Menu
- `S` - Start Game
- `Q` - Quit
- `Ctrl+Z` - Exit anytime

### During Game
- `↑` - Move Up
- `↓` - Move Down
- `←` - Move Left
- `→` - Move Right
- `Ctrl+Z` - Quit Game

### Game Over Screen
- `R` - Restart Game
- `M` - Return to Main Menu
- `Q` - Quit

## Gameplay

1. **Objective**: Eat the hearts (❤) to grow your snake and increase your score
2. **Avoid**: Don't hit the walls (▉) or eat yourself
3. **Challenge**: The snake moves faster as you score more points!

## Speed Levels

The game features 5 progressive speed levels:

| Level | Speed | Visual Indicator |
|-------|-------|-----------------|
| Slow | 500-420ms | Slow ●○○○○ |
| Medium | 420-340ms | Medium ●●○○○ |
| Fast | 340-260ms | Fast ●●●○○ |
| Very Fast | 260-180ms | Very Fast ●●●●○ |
| Maximum | 180-80ms | Maximum ●●●●● |

Speed increases by **10ms** for every point you score!

## Game Elements

- `⬤` (Yellow/Green) - Your snake
- `❤` (Red) - Food to collect
- `▉` - Walls (don't touch!)

## Technical Details

- **Language**: JavaScript (Node.js)
- **Dependencies**: 
  - `ansi-escapes` - Terminal control and cursor manipulation
- **Controls**: Native readline and keypress events

## Recent Improvements

### Version 2.0 Updates
- ✅ Added main menu system with game instructions
- ✅ Enhanced progressive speed with visual indicator
- ✅ Added "Return to Main Menu" option from game over screen
- ✅ Improved UI with better color scheme and formatting
- ✅ Real-time speed level display during gameplay

## Tips for High Scores

1. **Plan Ahead**: Think about where you'll move next as the speed increases
2. **Use the Edges**: Circle around the edges for easier navigation
3. **Stay Calm**: Don't panic when the speed reaches maximum level
4. **Practice**: The more you play, the better you'll get at high speeds!

## Contributing

Want to contribute? Here are some ideas:
- Add different game modes (e.g., obstacles, power-ups)
- Implement high score tracking
- Add difficulty settings
- Create different map sizes
- Add sound effects

## License

This game is part of the cli-games collection and follows the repository's MIT License.

## Credits

- Original game by: Seniru
- Improvements by: pankajydv07
- Part of the [cli-games](https://github.com/salif/cli-games) collection

---

Enjoy playing! 🐍🎮
