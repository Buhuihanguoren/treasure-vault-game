import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

 //ShineEffect
 //Makes treasure sparkle
 //Like getting loot in Diablo

export class ShineEffect {
    private shine: PIXI.Sprite;
    private timeline: gsap.core.Timeline | null = null;

    constructor(shineTexture: PIXI.Texture) {
        this.shine = new PIXI.Sprite(shineTexture);
        this.shine.anchor.set(0.5);
        this.shine.visible = false;
    }

    /**
     * Position shine over treasure location
     */
    public position(x: number, y: number, scale: number): void {
        this.shine.position.set(x, y);
        this.shine.scale.set(scale * 0.5); // smaller than door
    }

    //Get sprite so we can add it to stage

    public getSprite(): PIXI.Sprite {
        return this.shine;
    }

    //Start the shine animation
    //Loops for 5 seconds then stops

    public async play(duration: number = 5): Promise<void> {
        this.shine.visible = true;
        this.shine.alpha = 0;

        // Create repeating animation
        this.timeline = gsap.timeline({ repeat: -1 }); // -1 = infinite loop

        // Fade in, scale up
        this.timeline.to(this.shine, {
            alpha: 0.8,
            scale: this.shine.scale.x * 1.2,
            duration: 0.5,
            ease: 'power2.out'
        });

        // Fade out, scale down
        this.timeline.to(this.shine, {
            alpha: 0.3,
            scale: this.shine.scale.x * 0.8,
            duration: 0.5,
            ease: 'power2.in'
        });

        // Wait for specified duration, then stop
        await gsap.delayedCall(duration, () => {
            this.stop();
        });
    }

    //Stop the animation
    public stop(): void {
        if (this.timeline) {
            this.timeline.kill();
            this.timeline = null;
        }
        this.shine.visible = false;
    }
}