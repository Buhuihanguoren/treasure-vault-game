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
        handle: PIXI.Sprite,
		shadow?: PIXI.Sprite
		
    ): Promise<void> {
        console.log('Opening vault door...');
		console.log('Shadow received:', shadow); //DEBUG

        // Hide handle/shadow instantly
		handle.visible = false;
		console.log('Handle hidden'); //DEBUG
		
		if (shadow) {
			shadow.visible = false;
			console.log('Shadow hidden!');
		} else { console.log('NO SHADOW TO HIDE!')
		}
		
        doorClosed.visible = false;
        doorOpen.visible = true;
        
        // Position open door same as closed
        doorOpen.position.set(doorClosed.x, doorClosed.y);
        doorOpen.anchor.set(doorClosed.anchor.x, doorClosed.anchor.y);
        doorOpen.scale.set(doorClosed.scale.x, doorClosed.scale.y);

        doorOpen.alpha = 0;

        // Animate door sliding open to the side
        await gsap.to(doorOpen, {
            x: doorClosed.x - 250, // slide to the right
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
		handle: PIXI.Sprite,
		shadow?: PIXI.Sprite	
	): Promise<void> {
		console.log('Closing vault door...');
    
    // Animate door sliding back
		await gsap.to(doorOpen, {
        x: doorClosed.x,
        alpha: 0,
        duration: 0.8,
        ease: 'power2.in'
    });

    // Show closed door and handle again
    doorOpen.visible = false;
    doorClosed.visible = true;
    
    // Show shadow again
	handle.visible = true;
    if (shadow) {
        shadow.visible = true;
    }
    
    console.log('Door closed, ready for next attempt');
}}