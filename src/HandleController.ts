import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

export class HandleController {
    private handle: PIXI.Sprite;
    private shadow: PIXI.Sprite | null = null;
    private isRotating: boolean = false;
    private currentRotation: number = 0;
    private onRotationCallback?: (direction: 'CW' | 'CCW') => void;

    constructor(handle: PIXI.Sprite, shadow?: PIXI.Sprite) {
        this.handle = handle;
        this.shadow = shadow || null;
        this.setupInteraction();
    }

    public setRotationCallback(callback: (direction: 'CW' | 'CCW') => void): void {
        this.onRotationCallback = callback;
    }

    private setupInteraction(): void {
        this.handle.eventMode = 'static';
        this.handle.cursor = 'pointer';

        this.handle.on('pointerdown', (event: PIXI.FederatedPointerEvent) => {
            if (this.isRotating) {
                return;
            }

            this.handleClick(event);
        });
    }

    private handleClick(event: PIXI.FederatedPointerEvent): void {
        const clickX = event.global.x;
        const handleGlobalPos = this.handle.getGlobalPosition();
        const handleX = handleGlobalPos.x;
        
        const direction = clickX < handleX ? 'CCW' : 'CW';
        
        console.log(`Click X: ${clickX.toFixed(0)}, Handle X: ${handleX.toFixed(0)}, Direction: ${direction}`);
        
        this.rotate(direction);
    }

    private async rotate(direction: 'CW' | 'CCW'): Promise<void> {
        this.isRotating = true;

        const rotationAmount = Math.PI / 3;
        
        if (direction === 'CW') {
            this.currentRotation += rotationAmount;
        } else {
            this.currentRotation -= rotationAmount;
        }

        // Rotate handle and shadow together
        const animations = [
            gsap.to(this.handle, {
                rotation: this.currentRotation,
                duration: 0.3,
                ease: 'power2.out'
            })
        ];

        // Add shadow rotation if it exists
        if (this.shadow) {
            animations.push(
                gsap.to(this.shadow, {
                    rotation: this.currentRotation,
                    duration: 0.3,
                    ease: 'power2.out'
                })
            );
        }

        await Promise.all(animations);

        this.isRotating = false;
        
        if (this.onRotationCallback) {
            this.onRotationCallback(direction);
        }
    }

    public getCurrentPosition(): number {
        return Math.round(this.currentRotation / (Math.PI / 3));
    }

    // Block input during animations
    public setInteractive(enabled: boolean): void {
        this.handle.eventMode = enabled ? 'static' : 'none';
    }
}