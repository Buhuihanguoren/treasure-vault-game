import * as PIXI from 'pixi.js';
import { VaultDoor } from './VaultDoor';
import { HandleController } from './HandleController';
import { CombinationManager } from './CombinationManager';
import { HandleAnimator } from './animations/HandleAnimator';
import { DoorAnimator } from './animations/DoorAnimator';
import { ShineEffect } from './animations/ShineEffect';

export class Game {
    private app: PIXI.Application;
    private vaultDoor: VaultDoor;
    private handleController: HandleController | null = null;
    private combinationManager: CombinationManager;
    private shineEffect: ShineEffect | null = null;
    private isPlaying: boolean = false;
    private tryCount: number = 0;
    private tryCountText: PIXI.Text | null = null;

    constructor() {
        this.app = new PIXI.Application();
        this.vaultDoor = new VaultDoor();
        this.combinationManager = new CombinationManager();
    }

    public async start(): Promise<void> {
        await this.app.init({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x1a1a2e,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });

        document.body.appendChild(this.app.canvas);

        console.log('Loading assets...');
        await this.vaultDoor.load();

        const shineTexture = await PIXI.Assets.load('shine.png');
        this.shineEffect = new ShineEffect(shineTexture);
        
        this.app.stage.addChild(this.vaultDoor.getContainer());
        this.app.stage.addChild(this.shineEffect.getSprite());

        // Create counter display
        this.tryCountText = new PIXI.Text({
            text: '0',
            style: {
                fontFamily: 'Courier New, monospace',
                fontSize: 48,
                fill: 0x00ff41,
                fontWeight: 'bold'
            }
        });
        this.tryCountText.anchor.set(0.5);
        this.app.stage.addChild(this.tryCountText);

        this.vaultDoor.positionElements(this.app.screen.width, this.app.screen.height);
        
        this.positionTryCounter();
        
        if (this.shineEffect) {
            this.shineEffect.position(
                this.app.screen.width / 2,
                this.app.screen.height / 2,
                Math.min(this.app.screen.width, this.app.screen.height) / 800
            );
        }

        const handle = this.vaultDoor.getHandle();
        const shadow = this.vaultDoor.getHandleShadow();
        
        if (handle) {
            this.handleController = new HandleController(handle, shadow);
            
            this.handleController.setRotationCallback((direction) => {
                this.onHandleRotated(direction);
            });
            
            console.log('Handle is now interactive!');
        }

        window.addEventListener('resize', () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
            this.vaultDoor.positionElements(window.innerWidth, window.innerHeight);
            this.positionTryCounter();
            
            if (this.shineEffect) {
                this.shineEffect.position(
                    window.innerWidth / 2,
                    window.innerHeight / 2,
                    Math.min(window.innerWidth, window.innerHeight) / 800
                );
            }
        });

        console.log('Game Started!');
    }

    // Position counter on the keypad
    private positionTryCounter(): void {
        if (!this.tryCountText) return;
        
        const doorScale = Math.min(this.app.screen.width, this.app.screen.height) / 800;
        
        const offsetX = -462;
        const offsetY = -41;
        
        this.tryCountText.x = (this.app.screen.width / 2) + (offsetX * doorScale);
        this.tryCountText.y = (this.app.screen.height / 2) + (offsetY * doorScale);
    }

    // Update counter number
    private updateTryCounter(): void {
        if (this.tryCountText) {
            this.tryCountText.text = `${this.tryCount}`;
        }
    }

    private async onHandleRotated(direction: 'CW' | 'CCW'): Promise<void> {
        if (this.isPlaying) return;

        const result = this.combinationManager.checkInput(direction);

        if (result === 'unlocked') {
            await this.playSuccessSequence();
        } else if (result === 'wrong') {
            await this.playFailureSequence();
        } else {
            console.log(this.combinationManager.getCurrentStepInfo());
        }
    }

    // Player wins
    private async playSuccessSequence(): Promise<void> {
        this.isPlaying = true;

        const doorClosed = this.vaultDoor.getDoorClosed();
        const doorOpen = this.vaultDoor.getDoorOpen();
        const handle = this.vaultDoor.getHandle();
        const shadow = this.vaultDoor.getHandleShadow();

        if (!doorClosed || !doorOpen || !handle) return;

        if (this.handleController) {
            this.handleController.setInteractive(false);
        }

        await DoorAnimator.openDoor(doorClosed, doorOpen, handle, shadow);

        if (this.shineEffect) {
            await this.shineEffect.play(5);
        }

        await DoorAnimator.closeDoor(doorClosed, doorOpen, handle, shadow);

        if (this.handleController) {
            this.handleController.setInteractive(true);
        }

        this.combinationManager.reset();
        
        // Reset counter on win
        this.tryCount = 0;
        this.updateTryCounter();
        
        this.isPlaying = false;
    }

    // Player fails
    private async playFailureSequence(): Promise<void> {
        this.isPlaying = true;

        const handle = this.vaultDoor.getHandle();
        const shadow = this.vaultDoor.getHandleShadow();
        if (!handle) return;

        if (this.handleController) {
            this.handleController.setInteractive(false);
        }

        await HandleAnimator.crazySpin(handle, shadow);

        if (this.handleController) {
            this.handleController.setInteractive(true);
        }

        this.combinationManager.reset();
        
        // Count failed attempts
        this.tryCount++;
        this.updateTryCounter();
        
        this.isPlaying = false;
    }
}