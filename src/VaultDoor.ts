import * as PIXI from 'pixi.js';

export class VaultDoor {
    private container: PIXI.Container;
    private background: PIXI.Sprite | null = null;
    private doorClosed: PIXI.Sprite | null = null;
    private doorOpen: PIXI.Sprite | null = null;
    private doorHandle: PIXI.Sprite | null = null;
    private handleShadow: PIXI.Sprite | null = null;

    constructor() {
        this.container = new PIXI.Container();
    }

    async load(): Promise<void> {
        const bgTexture = await PIXI.Assets.load('background.png');
        const doorClosedTexture = await PIXI.Assets.load('door-closed.png');
        const doorOpenTexture = await PIXI.Assets.load('door-open.png');
        const handleTexture = await PIXI.Assets.load('door-handle.png');
        const shadowTexture = await PIXI.Assets.load('door-handle-shadow.png');

        this.background = new PIXI.Sprite(bgTexture);
        this.doorClosed = new PIXI.Sprite(doorClosedTexture);
        this.doorOpen = new PIXI.Sprite(doorOpenTexture);
        this.handleShadow = new PIXI.Sprite(shadowTexture);
        this.doorHandle = new PIXI.Sprite(handleTexture);

        this.doorOpen.visible = false;

        this.container.addChild(this.background);
        this.container.addChild(this.doorClosed);
        this.container.addChild(this.doorOpen);
        this.container.addChild(this.handleShadow);
        this.container.addChild(this.doorHandle);

        console.log('Vault assets loaded');
    }

public positionElements(referenceWidth: number, referenceHeight: number): void {
    // Background centered at container origin
    if (this.background) {
        this.background.anchor.set(0.5);
        this.background.position.set(0, 0);
        
        const bgScale = Math.max(
            referenceWidth / this.background.texture.width,
            referenceHeight / this.background.texture.height
        );
        this.background.scale.set(bgScale);
    }

    // Closed door position
    const closedDoorX = 80;
    const closedDoorY = 0;

    // Open door position (separate from closed)
    const openDoorX = 795;
    const openDoorY = 3;

    // Closed door
    if (this.doorClosed) {
        this.doorClosed.anchor.set(0.466, 0.5);
        this.doorClosed.position.set(closedDoorX, closedDoorY);
        this.doorClosed.scale.set(1);
    }

    // Open door
    if (this.doorOpen) {
        this.doorOpen.anchor.set(0.759, 0.5);
        this.doorOpen.position.set(openDoorX, openDoorY);
        this.doorOpen.scale.set(1);
    }

    if (this.doorHandle) {
        this.doorHandle.anchor.set(0.5);
        this.doorHandle.position.set(70, 0);
        this.doorHandle.scale.set(1);
    }

    if (this.handleShadow) {
        this.handleShadow.anchor.set(0.5);
        this.handleShadow.position.set(70, 5);
        this.handleShadow.scale.set(1);
        this.handleShadow.alpha = 0.7;
    }
}

    public getContainer(): PIXI.Container {
        return this.container;
    }

    public getHandle(): PIXI.Sprite | null {
        return this.doorHandle;
    }

    public getDoorClosed(): PIXI.Sprite | null {
        return this.doorClosed;
    }

    public getDoorOpen(): PIXI.Sprite | null {
        return this.doorOpen;
    }

    public getHandleShadow(): PIXI.Sprite | null {
        return this.handleShadow;
    }
}