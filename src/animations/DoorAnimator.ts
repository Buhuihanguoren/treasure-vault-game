import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

export class DoorAnimator {
    static async openDoor(
        doorClosed: PIXI.Sprite,
        doorOpen: PIXI.Sprite,
        handle: PIXI.Sprite,
        shadow?: PIXI.Sprite
    ): Promise<void> {
        // Hide handle and shadow first
        handle.visible = false;
        if (shadow) {
            shadow.visible = false;
        }
        
        // Switch doors
        doorClosed.visible = false;
        doorOpen.visible = true;
        
        doorOpen.position.set(doorClosed.x, doorClosed.y);
        doorOpen.anchor.set(doorClosed.anchor.x, doorClosed.anchor.y);
        doorOpen.scale.set(doorClosed.scale.x, doorClosed.scale.y);
        doorOpen.alpha = 0;

        // Slide door to the right
        await gsap.to(doorOpen, {
            x: doorClosed.x + 400,
            alpha: 1,
            duration: 1,
            ease: 'power2.out'
        });
    }

    static async closeDoor(
        doorClosed: PIXI.Sprite,
        doorOpen: PIXI.Sprite,
        handle: PIXI.Sprite,
        shadow?: PIXI.Sprite	
    ): Promise<void> {
        // Slide door back
        await gsap.to(doorOpen, {
            x: doorClosed.x,
            alpha: 0,
            duration: 0.8,
            ease: 'power2.in'
        });

        doorOpen.visible = false;
        doorClosed.visible = true;
        handle.visible = true;
        
        if (shadow) {
            shadow.visible = true;
        }
    }
}