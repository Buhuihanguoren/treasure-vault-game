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
    private gameContainer: PIXI.Container;

    constructor() {
        this.app = new PIXI.Application();
        this.vaultDoor = new VaultDoor();
        this.combinationManager = new CombinationManager();
        this.gameContainer = new PIXI.Container();
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

        await this.vaultDoor.load();

        const shineTexture = await PIXI.Assets.load('shine.png');
        this.shineEffect = new ShineEffect(shineTexture);
        
        // Add everything to game container
        this.gameContainer.addChild(this.vaultDoor.getContainer());
        this.gameContainer.addChild(this.shineEffect.getContainer());

        // Create counter at fixed position
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
        this.tryCountText.position.set(-462, -41); // Fixed position
        this.gameContainer.addChild(this.tryCountText);

        // Add game container to stage
        this.app.stage.addChild(this.gameContainer);

        // Position everything at FIXED reference size
        const REFERENCE_SIZE = 800;
        this.vaultDoor.positionElements(REFERENCE_SIZE, REFERENCE_SIZE);
        
        if (this.shineEffect) {
            this.shineEffect.position(0, 0, 1);
        }

        // Scale the ENTIRE parent container to fit screen
        this.resizeGame();

        const handle = this.vaultDoor.getHandle();
        const shadow = this.vaultDoor.getHandleShadow();
        
        if (handle) {
            this.handleController = new HandleController(handle, shadow);
            
            handle.on('rotated', (direction: 'CW' | 'CCW') => {
                this.onHandleRotated(direction);
            });
        }

        window.addEventListener('resize', () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
            this.resizeGame(); // Only scale the parent
        });
    }

    // Scale parent container to fit any screen
    private resizeGame(): void {
        const REFERENCE_SIZE = 800;
        const scaleX = this.app.screen.width / REFERENCE_SIZE;
        const scaleY = this.app.screen.height / REFERENCE_SIZE;
        const scale = Math.min(scaleX, scaleY);
        
        this.gameContainer.scale.set(scale);
        this.gameContainer.position.set(
            this.app.screen.width / 2,
            this.app.screen.height / 2
        );
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