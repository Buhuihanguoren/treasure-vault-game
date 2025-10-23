import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

export class DoorAnimator {
    static async openDoor(
        doorClosed: PIXI.Sprite,
        doorOpen: PIXI.Sprite,
        handle: PIXI.Sprite,
        shadow?: PIXI.Sprite
    ): Promise<void> {
        console.log('Opening vault door...');
        console.log('Shadow received:', shadow);

        // Hide the handle
        handle.visible = false;
        console.log('Handle hidden');
        
        // Hide the shadow if it exists
        if (shadow) {
            shadow.visible = false;
            console.log('Shadow hidden!');
        } else { 
            console.log('NO SHADOW TO HIDE!')
        }
        
        // Switch from closed door to open door
        doorClosed.visible = false;
        doorOpen.visible = true;
        
        // Copy position and size from closed door
        doorOpen.position.set(doorClosed.x, doorClosed.y);
        doorOpen.anchor.set(doorClosed.anchor.x, doorClosed.anchor.y);
        doorOpen.scale.set(doorClosed.scale.x, doorClosed.scale.y);

        // Start invisible
        doorOpen.alpha = 0;

        // Animate door sliding to the right
        await gsap.to(doorOpen, {
            x: doorClosed.x + 400,  // Move 400 pixels right
            alpha: 1,               // Fade in
            duration: 1,            // Takes 1 second
            ease: 'power2.out'
        });

        handle.visible = false;
    }

    static async closeDoor(
        doorClosed: PIXI.Sprite,
        doorOpen: PIXI.Sprite,
        handle: PIXI.Sprite,
        shadow?: PIXI.Sprite	
    ): Promise<void> {
        console.log('Closing vault door...');
        
        // Animate door sliding back and fading out
        await gsap.to(doorOpen, {
            x: doorClosed.x,      // Move back to original position
            alpha: 0,             // Fade out
            duration: 0.8,        // Takes 0.8 seconds
            ease: 'power2.in'
        });

        // Switch back to closed door
        doorOpen.visible = false;
        doorClosed.visible = true;
        
        // Show handle and shadow again
        handle.visible = true;
        if (shadow) {
            shadow.visible = true;
        }
        
        console.log('Door closed, ready for next attempt');
    }
}