export interface RefractionState {
    currentLogMAR: number; // The current "best guess" threshold
    stepSize: number;      // How much we change LogMAR
    reversals: number;     // How many times user switched direction
    history: Array<{ choice: 1 | 2, value: number }>;
    isFinished: boolean;
    confidence: number;    // 0-100 score

    // New props for Algo v2.6
    lastDirection: 'BETTER' | 'WORSE' | null; // BETTER = moving down (smaller), WORSE = moving up (larger)
    reversalValues: number[]; // Store LogMAR values at reversal points
}

export interface RefractionOptions {
    option1: { logMAR: number; blur: number; label: string };
    option2: { logMAR: number; blur: number; label: string };
}

export function initializeRefraction(): RefractionState {
    return {
        currentLogMAR: 1.0, // Start at 20/200
        stepSize: 0.3,      // Start with larger jumps for speed
        reversals: 0,
        history: [],
        isFinished: false,
        confidence: 0,
        lastDirection: null,
        reversalValues: []
    };
}

export function getRefractionOptions(state: RefractionState): RefractionOptions {
    // Option 1: Current ("Best known")
    // Option 2: Challenge (Smaller / Improved)

    // Dynamic Step Sizing is handled in update, but here we just render
    const challengeLogMAR = Math.max(-0.3, state.currentLogMAR - state.stepSize);

    return {
        option1: {
            logMAR: state.currentLogMAR,
            blur: 0,
            label: "Option 1"
        },
        option2: {
            logMAR: challengeLogMAR,
            blur: 0,
            label: "Option 2"
        }
    };
}

export function updateRefraction(state: RefractionState, selectedOption: 1 | 2): RefractionState {
    // Logic:
    // Option 1 = Current Base (Larger)
    // Option 2 = Challenge (Smaller)

    const newState = { ...state, history: [...state.history, { choice: selectedOption, value: state.currentLogMAR }] };
    const currentDirection: 'BETTER' | 'WORSE' = selectedOption === 2 ? 'BETTER' : 'WORSE';

    // 1. Detect Reversal
    // Reversal happens if Current Direction != Last Direction (and Last Direction is not null)
    let isReversal = false;
    if (newState.lastDirection && newState.lastDirection !== currentDirection) {
        isReversal = true;
        newState.reversals += 1;

        // Record the value where we turned around.
        // If we were going BETTER and now hit WORSE (Option 1 selected), it means the PREVIOUS Challenge was too hard.
        // So the "Reversal Point" is roughly between Current and Challenge.
        // For simplicity, let's track the Current LogMAR as the anchor.
        newState.reversalValues = [...newState.reversalValues, newState.currentLogMAR];
    }

    // 2. Update Thresholds & Step Sizes
    if (selectedOption === 2) {
        // User picked Option 2 (Smaller). They CAN see it.
        // Move "Current" to "Challenge"
        newState.currentLogMAR = Math.max(-0.3, state.currentLogMAR - state.stepSize);

        // Dynamic Speed: If we are cruising (no recent reversals), keep step size large or accelerate?
        if (!isReversal && newState.lastDirection === 'BETTER') {
            // Accelerate if very confident? Or keep steady. 0.3 is efficient.
        }
    } else {
        // User picked Option 1. Option 2 was too small/blurry.
        // We stay at Current LogMAR for now (it's the last known good).
        // But we need to find a simpler challenge next time.
    }

    // 3. Step Refinement (Binary Search / Halving)
    if (isReversal) {
        // We hit a wall. Logic:
        // If we were going BETTER (Steps down) and hit WORSE (Can't see), we need to step back UP?
        // Or just reduce step size and try a smaller increment from the Current Base?

        // Algorithm: Halve the step size to refine resolution.
        newState.stepSize = Math.max(0.05, newState.stepSize / 2);
    }

    // 4. Convergence Check & Statistics
    const { sd } = calculateStats(newState.reversalValues);

    // Calculate Confidence Score (0-100)
    // Ideal SD is < 0.05. If SD is 0.2, score is low.
    // 0.05 -> 100
    // 0.20 -> 0
    if (newState.reversalValues.length >= 2) {
        const rawScore = 100 - ((sd - 0.05) / 0.15) * 100; // Linear map
        newState.confidence = Math.max(0, Math.min(100, Math.round(rawScore)));
    }

    // Early Exit Criteria
    // 1. At least 3 reversals (Classic psychophysics rule)
    // 2. Standard Deviation is low (Consistent user)
    // 3. OR Max reversals reached (Time limit)
    if (newState.reversals >= 3 && sd < 0.08) {
        newState.isFinished = true;
    }

    if (newState.reversals >= 5) {
        newState.isFinished = true; // Hard stop
    }

    // Safety valve
    if (newState.history.length > 20) {
        newState.isFinished = true;
    }

    newState.lastDirection = currentDirection;
    return newState;
}

export function estimateRefractionResult(state: RefractionState): number {
    // Best estimate is the MEAN of the modification reversals? 
    // Or just the last currentLogMAR?
    // Mean of reversals is statistically robust.
    if (state.reversalValues.length >= 2) {
        const { mean } = calculateStats(state.reversalValues);
        return Number(mean.toFixed(2));
    }
    return state.currentLogMAR;
}

function calculateStats(values: number[]) {
    if (values.length === 0) return { mean: 0, sd: 0 };
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return { mean, sd: Math.sqrt(variance) };
}
