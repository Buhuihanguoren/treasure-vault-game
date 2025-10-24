// CombinationManager
// Generates secret codes and checks player input
 

// Single step in the combination
interface CombinationStep {
    amount: number;      // how many times to rotate
    direction: 'CW' | 'CCW';
}

export class CombinationManager {
    private secretCode: CombinationStep[] = [];
    private currentStepIndex: number = 0;
    private currentStepProgress: number = 0;

    constructor() {
        this.generateCode();
    }

    // Generate random 3-step code
    private generateCode(): void {
        this.secretCode = [];

        for (let i = 0; i < 3; i++) {
            const amount = Math.floor(Math.random() * 9) + 1;
            
            // Alternate CW, CCW, CW
            const direction = i % 2 === 0 ? 'CW' : 'CCW';
            
            this.secretCode.push({ amount, direction });
        }

        // Show code in console
        const codeString = this.secretCode
            .map(step => `${step.amount} ${step.direction}`)
            .join(', ');
        
        console.log(`Secret Code: ${codeString}`);
    }
	
    // Check if player's move is correct
    public checkInput(direction: 'CW' | 'CCW'): 'correct' | 'wrong' | 'unlocked' {
        const currentStep = this.secretCode[this.currentStepIndex];

        if (direction !== currentStep.direction) {
            console.log('Wrong direction!');
            return 'wrong';
        }

        this.currentStepProgress++;
        console.log(`Correct! Progress: ${this.currentStepProgress}/${currentStep.amount}`);

        if (this.currentStepProgress >= currentStep.amount) {
            console.log(`Step ${this.currentStepIndex + 1} complete!`);
            
            this.currentStepIndex++;
            this.currentStepProgress = 0;

            if (this.currentStepIndex >= this.secretCode.length) {
                console.log('UNLOCKED!');
                return 'unlocked';
            }
        }

        return 'correct';
    }

    public reset(): void {
        this.currentStepIndex = 0;
        this.currentStepProgress = 0;
        this.generateCode();
    }

    public getCurrentStepInfo(): string {
		if (this.currentStepIndex >= this.secretCode.length) {
            return 'All steps complete!';
        }
        
        const step = this.secretCode[this.currentStepIndex];
        return `Step ${this.currentStepIndex + 1}: ${this.currentStepProgress}/${step.amount} ${step.direction}`;
    }
}