import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

//DoorAnimator
//Opens and closes the vault door

export class DoorAnimator {
    //Open door to the side
    //Reveals treasure inside

    static async openDoor(
        doorClosed: PIXI.Sprite,
        doorOpen: PIXI.Sprite,
        handle: PIXI.Sprite
    ): Promise<void> {
        console.log('Opening vault door...');

        // Hide closed door, show open door
        doorClosed.visible = false;
        doorOpen.visible = true;
        
        // Position open door same as closed
        doorOpen.position.set(doorClosed.x, doorClosed.y);
        doorOpen.anchor.set(doorClosed.anchor.x, doorClosed.anchor.y);
        doorOpen.scale.set(doorClosed.scale.x, doorClosed.scale.y);

        // Start slightly to the left
        doorOpen.x = doorClosed.x - 50;
        doorOpen.alpha = 0;

        // Animate door sliding open to the side
        await gsap.to(doorOpen, {
            x: doorClosed.x + 200, // slide to the right
            alpha: 1,
            duration: 1,
            ease: 'power2.out'
        });

        // Hide handle when door opens (it's part of closed door)
        handle.visible = false;
    }

    //Close door back
    //Resets everything
    static async closeDoor(
        doorClosed: PIXI.Sprite,
        doorOpen: PIXI.Sprite,
        handle: PIXI.Sprite
    ): Promise<void> {
        console.log('Closing vault door...');

        // Animate door sliding back
        await gsap.to(doorOpen, {
            x: doorClosed.x - 50,
            alpha: 0,
            duration: 0.8,
            ease: 'power2.in'
        });

        // Show closed door again
        doorOpen.visible = false;
        doorClosed.visible = true;
        handle.visible = true;

        console.log('Door closed, ready for next attempt');
    }
}