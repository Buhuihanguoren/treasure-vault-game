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
    private isPlaying: boolean = false; // block input during animations

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

        this.vaultDoor.positionElements(this.app.screen.width, this.app.screen.height);
        
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

        // Handle window resize
        window.addEventListener('resize', () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
            this.vaultDoor.positionElements(window.innerWidth, window.innerHeight);
        });

        console.log('Game Started!');
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

    // Win: open door, show treasure, wait 5s, close
    private async playSuccessSequence(): Promise<void> {
    this.isPlaying = true;
    console.log('SUCCESS! Opening vault...');

    const doorClosed = this.vaultDoor.getDoorClosed();
    const doorOpen = this.vaultDoor.getDoorOpen();
    const handle = this.vaultDoor.getHandle();
	const shadow = this.vaultDoor.getHandleShadow();

	console.log('Got shadow from vault:', shadow); //DEBUG

    if (!doorClosed || !doorOpen || !handle) return;

    // Block input during animation
    if (this.handleController) {
        this.handleController.setInteractive(false);
    }

	console.log('About to open door, passing shadow:', shadow); //DEBUG
    await DoorAnimator.openDoor(doorClosed, doorOpen, handle, shadow);

    if (this.shineEffect) {
        await this.shineEffect.play(5);
    }

    await DoorAnimator.closeDoor(doorClosed, doorOpen, handle,shadow);

    // Re-enable input
    if (this.handleController) {
        this.handleController.setInteractive(true);
    }

    this.combinationManager.reset();
    this.isPlaying = false;
}
    // Fail: spin handle, reset
    private async playFailureSequence(): Promise<void> {
    this.isPlaying = true;
    console.log('WRONG! Spinning handle...');

    const handle = this.vaultDoor.getHandle();
    const shadow = this.vaultDoor.getHandleShadow(); // shadow
    if (!handle) return;

    if (this.handleController) {
        this.handleController.setInteractive(false);
    }

    await HandleAnimator.crazySpin(handle, shadow); // pass shadow

    if (this.handleController) {
        this.handleController.setInteractive(true);
    }

    this.combinationManager.reset();
    this.isPlaying = false;
	}
}