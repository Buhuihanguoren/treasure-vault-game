import * as PIXI from 'pixi.js';

export class DoorAnimator {
    static async openDoor(
        doorClosed: PIXI.Sprite,
        doorOpen: PIXI.Sprite,
        handle: PIXI.Sprite,
        shadow?: PIXI.Sprite
    ): Promise<void> {
        // Hide handle and shadow
        handle.visible = false;
        if (shadow) {
            shadow.visible = false;
        }
        
        // Simple swap
        doorClosed.visible = false;
        doorOpen.visible = true;
    }

    static async closeDoor(
        doorClosed: PIXI.Sprite,
        doorOpen: PIXI.Sprite,
        handle: PIXI.Sprite,
        shadow?: PIXI.Sprite	
    ): Promise<void> {
        // Simple swap back
        doorOpen.visible = false;
        doorClosed.visible = true;
        handle.visible = true;
        
        if (shadow) {
            shadow.visible = true;
        }
    }
}