export interface StaircaseState {
    currentLogMAR: number; // Logarithm of the Minimum Angle of Resolution (0.0 = 20/20, 1.0 = 20/200)
    stepSize: number;
    reversals: number;
    history: Array<{ logMAR: number; correct: boolean }>;
    direction: 'down' | 'up' | null; // 'down' means making it harder (smaller), 'up' means easier
    isFinished: boolean;
}

const START_LOGMAR = 1.8; // ~20/1200 (Start with MASSIVE / Full Screen)
const MIN_LOGMAR = -0.3; // ~20/10
const MAX_LOGMAR = 1.8; // 20/1200
const INITIAL_STEP = 0.3;
const MIN_STEP = 0.1;
const MAX_REVERSALS = 4; // Short test for MVP, usually 6-8

export function initializeStaircase(): StaircaseState {
    return {
        currentLogMAR: START_LOGMAR,
        stepSize: INITIAL_STEP,
        reversals: 0,
        history: [],
        direction: null,
        isFinished: false,
    };
}

export function updateStaircase(state: StaircaseState, isCorrect: boolean): StaircaseState {
    const { direction, history } = state;
    let { currentLogMAR, stepSize, reversals } = state;

    // 1-up / 1-down logic for simple threshold estimation (or 2-down/1-up for 71% accuracy)
    // Let's use 1-up/1-down for speed in MVP, targeting 50% threshold roughly, or 3-down/1-up.
    // Standard clinical is often just simple staircase. Let's do:
    // Correct -> Value decreases (harder)
    // Incorrect -> Value increases (easier)

    const newDirection: 'down' | 'up' = isCorrect ? 'down' : 'up';

    // Check reversal
    if (direction !== null && newDirection !== direction) {
        reversals++;
        // Halve step size on reversal to converge
        stepSize = Math.max(MIN_STEP, stepSize / 2);
    }

    // Update level
    if (isCorrect) {
        currentLogMAR -= stepSize;
    } else {
        currentLogMAR += stepSize;
    }

    // Clamp
    currentLogMAR = Math.max(MIN_LOGMAR, Math.min(MAX_LOGMAR, currentLogMAR));

    const newState = {
        currentLogMAR,
        stepSize,
        reversals,
        history: [...history, { logMAR: state.currentLogMAR, correct: isCorrect }],
        direction: newDirection,
        isFinished: reversals >= MAX_REVERSALS || history.length > 20, // Safety cap
    };

    return newState;
}

export function estimateThreshold(state: StaircaseState): number {
    // Average the peaks and valleys (reversals)
    // Simple approximation: average of last N trials if stable
    // Better: Average of reversal points.
    // For MVP: Just take the final logMAR.
    return state.currentLogMAR;
}

// Helper to convert logMAR to approximate Diopters (very rough rule of thumb)
// This is NOT medical. Purely heuristic for the "Myopia" screening.
// 0.0 logMAR (20/20) ~ 0 Diopters (Emmetropia)
// 0.3 logMAR (20/40) ~ -0.50 to -0.75 D
// 0.6 logMAR (20/80) ~ -1.50 D
// 1.0 logMAR (20/200) ~ -2.50 to -3.00 D
export function logMARToDiopters(logMAR: number): string {
    if (logMAR <= 0.1) return "Normal Range (0.00 to -0.25)";
    if (logMAR <= 0.3) return "Mild Myopia (-0.50 to -0.75)";
    if (logMAR <= 0.6) return "Moderate Myopia (-1.00 to -1.75)";
    if (logMAR <= 1.0) return "Significant Myopia (-2.00 to -3.00)";
    return "High Myopia (> -3.00)";
}
