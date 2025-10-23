import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

export class HandleAnimator {
    static async crazySpin(handle: PIXI.Sprite, shadow?: PIXI.Sprite): Promise<void> {
        const currentRotation = handle.rotation;
        const spinAmount = Math.PI * 2 * 5;

        // Spin both handle and shadow
        const animations = [
            gsap.to(handle, {
                rotation: currentRotation + spinAmount,
                duration: 1.5,
                ease: 'power2.inOut'
            })
        ];

        if (shadow) {
            animations.push(
                gsap.to(shadow, {
                    rotation: currentRotation + spinAmount,
                    duration: 1.5,
                    ease: 'power2.inOut'
                })
            );
        }

        await Promise.all(animations);

        // Reset both to 0
        handle.rotation = 0;
        if (shadow) {
            shadow.rotation = 0;
        }
        
        console.log('Handle reset after crazy spin');
    }
}