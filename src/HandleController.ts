import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

export class HandleController {
    private handle: PIXI.Sprite;
    private shadow: PIXI.Sprite | null = null;
    private isRotating: boolean = false;
    private currentRotation: number = 0;

    constructor(handle: PIXI.Sprite, shadow?: PIXI.Sprite) {
        this.handle = handle;
        this.shadow = shadow || null;
        this.setupInteraction();
    }

    private setupInteraction(): void {
        this.handle.eventMode = 'static';
        this.handle.cursor = 'pointer';

        this.handle.on('pointerdown', (event: PIXI.FederatedPointerEvent) => {
            if (this.isRotating) return;
            this.handleClick(event);
        });
    }

    private handleClick(event: PIXI.FederatedPointerEvent): void {
        // Use parent container for coordinate conversion (not the rotating handle itself)
        const parent = this.handle.parent;
        if (!parent) return;
        
        const localPos = parent.toLocal(event.global);
        const handlePos = this.handle.position;
        
        // Compare click position to handle position
        const direction = localPos.x > handlePos.x ? 'CW' : 'CCW';
        
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

        const animations = [
            gsap.to(this.handle, {
                rotation: this.currentRotation,
                duration: 0.3,
                ease: 'power2.out'
            })
        ];

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
        
        this.handle.emit('rotated', direction);
    }

    public setInteractive(enabled: boolean): void {
        this.handle.eventMode = enabled ? 'static' : 'none';
    }
}