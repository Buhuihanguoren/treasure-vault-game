import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

export class ShineEffect {
    private shines: PIXI.Sprite[] = [];
    private container: PIXI.Container;
    private timelines: gsap.core.Timeline[] = [];

    constructor(shineTexture: PIXI.Texture) {
        this.container = new PIXI.Container();
        this.container.visible = false;
        
        // Create 25 shines
        const numShines = 25;
        
        for (let i = 0; i < numShines; i++) {
            const shine = new PIXI.Sprite(shineTexture);
            shine.anchor.set(0.5);
            
            // Random position around center
            const angle = (Math.PI * 2 * i) / numShines; // Spread evenly in circle
            const radius = 50 + Math.random() * 100; // Random distance from center
            
            shine.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius
            );
            
            shine.visible = false;
            shine.alpha = 0;
            
            this.shines.push(shine);
            this.container.addChild(shine);
        }
    }

    // Set where the shine appears on screen
    public position(x: number, y: number, scale: number): void {
        this.container.position.set(x, y);
        
        // Scale each shine individually
        this.shines.forEach(shine => {
            shine.scale.set(scale * 0.4); // Smaller shines
        });
    }

    // Get the container so we can add it to the game
    public getContainer(): PIXI.Container {
        return this.container;
    }

    // Play the sparkle animation
    public async play(duration: number = 5): Promise<void> {
        this.container.visible = true;
        
        // Stop any existing animations
        this.timelines.forEach(t => t.kill());
        this.timelines = [];
        
        // Animate each shine
        this.shines.forEach((shine, index) => {
            shine.visible = true;
            shine.alpha = 0;
            
            const baseScale = shine.scale.x;
            
            // Create animation that loops forever
            const timeline = gsap.timeline({ 
                repeat: -1,
                delay: index * 0.1 // Stagger start times
            });
            
            // Pulse bigger and brighter
            timeline.to(shine, {
                alpha: 0.8,
                scale: baseScale * 1.3,
                duration: 0.5,
                ease: 'power2.out'
            });
            
            // Pulse smaller and dimmer
            timeline.to(shine, {
                alpha: 0.3,
                scale: baseScale * 0.7,
                duration: 0.5,
                ease: 'power2.in'
            });
            
            this.timelines.push(timeline);
        });
        
        // Wait for the specified time, then stop
        return new Promise(resolve => {
            gsap.delayedCall(duration, () => {
                this.stop();
                resolve();
            });
        });
    }

    // Stop the animation
    public stop(): void {
        this.timelines.forEach(timeline => {
            timeline.kill();
        });
        this.timelines = [];
        
        this.shines.forEach(shine => {
            shine.visible = false;
            shine.alpha = 0;
        });
        
        this.container.visible = false;
    }
}