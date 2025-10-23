 # Treasure Vault Game

A minor project game where players must unlock a vault safe by rotating a wheel in a generated pre-set order.

## How to Play

1. A secret 3-step combination is generated and logged to the browser console
2. Click the left or right side of the vault handle to rotate it
3. Enter the combination correctly to unlock the vault
4. If you make a mistake, the handle spins and a new code is generated

## Technologies Used

- **PIXI.js v8** - Game rendering engine
- **GSAP** - Animation library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server

## Installation

1. Make sure you have [Node.js](https://nodejs.org/) installed (v16 or higher)

2. Install dependencies:
```
bash
npm install
```

## Running the Project

### Development Mode
```
bash
npm run dev
```
Then open your browser to `http://localhost:5173/`

### Build for Production
```
bash
npm run build
```
The built files will be in the `dist/` folder.

### Preview Production Build
```
bash
npm run preview
```

## Game Rules

- The secret combination consists of 3 steps
- Each step has a number (1-9) and direction (CW/CCW)
- Directions alternate: CW, CCW, CW
- Example: "3 CW, 7 CCW, 5 CW"
- Click the right side of the handle to rotate clockwise (CW)
- Click the left side to rotate counterclockwise (CCW)
- Each click rotates the handle 60 degrees (1 pos)

## Project Structure
```
treasure-vault-game/
	src/
		main.ts                  # Entry point
		Game.ts                  # Main game controller
		VaultDoor.ts             # Vault door rendering
		HandleController.ts      # Handle input & rotation
		CombinationManager.ts    # Code generation & validation
		animations/
			HandleAnimator.ts   # Handle animations
			DoorAnimator.ts     # Door open/close
			ShineEffect.ts      # Treasure shine effect
	assets/       # Game images
	public/       # Static files
	package.json
	tsconfig.json
	vite.config.ts
	README.md
```

## Known Issues

None currently.

## Development Notes

- All animations use GSAP with async/await (no setTimeout/setInterval)
- Click detection uses global coordinates to handle rotated sprites correctly
- Game is responsive for different screen sizes

## Update
1. Shadow now rotates.
2. Added align for Door, Handle and Shadow with basic debug for shadow in console.
3. Added slightly better doora animation. Bigger shine effect.