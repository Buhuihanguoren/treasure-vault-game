import { Game } from './Game';

window.addEventListener('load', async () => {
    console.log('Initializing game...');
    const game = new Game();
    await game.start();
});