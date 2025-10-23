import * as PIXI from 'pixi.js';

export class VaultDoor {
    private container: PIXI.Container;
    private background: PIXI.Sprite | null = null;
    private doorClosed: PIXI.Sprite | null = null;
    private doorOpen: PIXI.Sprite | null = null; // NEW
    private doorHandle: PIXI.Sprite | null = null;
    private handleShadow: PIXI.Sprite | null = null;

    constructor() {
        this.container = new PIXI.Container();
    }

    async load(): Promise<void> {
        const bgTexture = await PIXI.Assets.load('background.png');
        const doorClosedTexture = await PIXI.Assets.load('door-closed.png');
        const doorOpenTexture = await PIXI.Assets.load('door-open.png'); // NEW
        const handleTexture = await PIXI.Assets.load('door-handle.png');
        const shadowTexture = await PIXI.Assets.load('door-handle-shadow.png');

        this.background = new PIXI.Sprite(bgTexture);
        this.doorClosed = new PIXI.Sprite(doorClosedTexture);
        this.doorOpen = new PIXI.Sprite(doorOpenTexture); // NEW
        this.handleShadow = new PIXI.Sprite(shadowTexture);
        this.doorHandle = new PIXI.Sprite(handleTexture);

        // Hide open door initially
        this.doorOpen.visible = false; // NEW

        this.container.addChild(this.background);
        this.container.addChild(this.doorClosed);
        this.container.addChild(this.doorOpen); // NEW (add but hidden)
        this.container.addChild(this.handleShadow);
        this.container.addChild(this.doorHandle);

        console.log('Vault assets loaded');
    }

    public positionElements(screenWidth: number, screenHeight: number): void {
        if (!this.background) return;

        const bgScale = Math.max(
            screenWidth / this.background.texture.width,
            screenHeight / this.background.texture.height
        );
        this.background.scale.set(bgScale);
        this.background.position.set(
            (screenWidth - this.background.width) / 2,
            (screenHeight - this.background.height) / 2
        );

        if (this.doorClosed) {
            this.doorClosed.anchor.set(0.5);
            this.doorClosed.position.set(screenWidth / 2, screenHeight / 2);
            
            const doorScale = Math.min(screenWidth, screenHeight) / 800;
            this.doorClosed.scale.set(doorScale);
        }

        // NEW: Position open door same as closed (will move during animation)
        if (this.doorOpen && this.doorClosed) {
            this.doorOpen.anchor.set(0.5);
            this.doorOpen.position.set(this.doorClosed.x, this.doorClosed.y);
            this.doorOpen.scale.set(this.doorClosed.scale.x);
        }

        if (this.doorHandle && this.doorClosed) {
            this.doorHandle.anchor.set(0.5);
            this.doorHandle.position.set(screenWidth / 2, screenHeight / 2);
            this.doorHandle.scale.set(this.doorClosed.scale.x);
        }

        // Position shadow SLIGHTLY offset (bottom-right of handle)
		if (this.handleShadow && this.doorClosed) {
			this.handleShadow.anchor.set(0.5);
			
			this.handleShadow.position.set(
			screenWidth / 2 + 5,  // 5px right
			screenHeight / 2 + 5  // 5px down
			);
			
			this.handleShadow.scale.set(this.doorClosed.scale.x);
			this.handleShadow.alpha = 0.7; // slightly transparent
    }	}

    public getContainer(): PIXI.Container {
        return this.container;
    }

    public getHandle(): PIXI.Sprite | null {
        return this.doorHandle;
    }

    // NEW: Getters for animations
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