import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

//HandleAnimator
//Does the crazy spin animation when player messes up

export class HandleAnimator {
	//Spin handle like crazy (multiple full rotations)
    // Like when you fail a lockpick in Skyrim
	 
    static async crazySpin(handle: PIXI.Sprite): Promise<void> {
        // Save current rotation so we can go back to 0 after
        const currentRotation = handle.rotation;

        // Spin 5 full rotations (5 * 2π radians)
        const spinAmount = Math.PI * 2 * 5;

        await gsap.to(handle, {
            rotation: currentRotation + spinAmount,
            duration: 1.5, // seconds of spinning
            ease: 'power2.inOut'
        });

        // Reset to 0 rotation after crazy spin
        handle.rotation = 0;
        
        console.log('Handle reset after crazy spin');
    }
}