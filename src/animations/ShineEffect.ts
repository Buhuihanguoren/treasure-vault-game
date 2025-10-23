import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

export class ShineEffect {
    private shine: PIXI.Sprite;
    private timeline: gsap.core.Timeline | null = null;

    constructor(shineTexture: PIXI.Texture) {
        this.shine = new PIXI.Sprite(shineTexture);
        this.shine.anchor.set(0.5);  // Center the sprite
        this.shine.visible = false;   // Hidden by default
    }

    // Set where the shine appears on screen
    public position(x: number, y: number, scale: number): void {
        this.shine.position.set(x, y);
        this.shine.scale.set(scale * 0.8); // Make it bigger (was 0.5)
    }

    // Get the sprite so we can add it to the game
    public getSprite(): PIXI.Sprite {
        return this.shine;
    }

    // Play the sparkle animation
    public async play(duration: number = 5): Promise<void> {
        this.shine.visible = true;
        this.shine.alpha = 0;

        // Create animation that loops forever
        this.timeline = gsap.timeline({ repeat: -1 });

        // Pulse bigger and brighter
        this.timeline.to(this.shine, {
            alpha: 0.8,
            scale: this.shine.scale.x * 1.2,
            duration: 0.5,
            ease: 'power2.out'
        });

        // Pulse smaller and dimmer
        this.timeline.to(this.shine, {
            alpha: 0.3,
            scale: this.shine.scale.x * 0.8,
            duration: 0.5,
            ease: 'power2.in'
        });

        // Wait for the specified time, then stop
        await gsap.delayedCall(duration, () => {
            this.stop();
        });
    }

    // Stop the animation
    public stop(): void {
        if (this.timeline) {
            this.timeline.kill();
            this.timeline = null;
        }
        this.shine.visible = false;
    }
}