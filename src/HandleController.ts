import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

export class HandleController {
    private handle: PIXI.Sprite;
    private isRotating: boolean = false;
    private currentRotation: number = 0;
    private onRotationCallback?: (direction: 'CW' | 'CCW') => void;

    constructor(handle: PIXI.Sprite) {
        this.handle = handle;
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
                console.log('Already rotating, wait...');
                return;
            }

            this.handleClick(event);
        });
    }

    private handleClick(event: PIXI.FederatedPointerEvent): void {
        // Use global coords so rotation doesn't mess up detection
        const clickX = event.global.x;
        const handleGlobalPos = this.handle.getGlobalPosition();
        const handleX = handleGlobalPos.x;
        
        const direction = clickX < handleX ? 'CCW' : 'CW';
        
        console.log(`Click X: ${clickX.toFixed(0)}, Handle X: ${handleX.toFixed(0)}, Direction: ${direction}`);
        
        this.rotate(direction);
    }

    private async rotate(direction: 'CW' | 'CCW'): Promise<void> {
        this.isRotating = true;

        // 60 degrees in radians
        const rotationAmount = Math.PI / 3;
        
        if (direction === 'CW') {
            this.currentRotation += rotationAmount;
        } else {
            this.currentRotation -= rotationAmount;
        }

        await gsap.to(this.handle, {
            rotation: this.currentRotation,
            duration: 0.3,
            ease: 'power2.out'
        });

        this.isRotating = false;
        
        if (this.onRotationCallback) {
            this.onRotationCallback(direction);
        }
    }

    public getCurrentPosition(): number {
        return Math.round(this.currentRotation / (Math.PI / 3));
    }
}