// initialization for the game
import { Game } from './Game';

// Start the game when page loads
window.addEventListener('load', async () => {
    console.log('Initializing game...');
    const game = new Game();
    await game.start();
});