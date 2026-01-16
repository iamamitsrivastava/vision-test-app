import { StaircaseState, initializeStaircase as initBase, updateStaircase as updateBase } from './staircase';

export interface SmartStaircaseState extends StaircaseState {
    consistencyScore: number; // 0-100
    falsePositives: number; // Catch trials (showing blank and seeing something)
    falseNegatives: number; // Missing very easy targets
    confidenceSums: number; // If we track user reported confidence
    totalReactionTime: number;
    trialsCount: number;
}

export function initializeSmartStaircase(): SmartStaircaseState {
    return {
        ...initBase(),
        consistencyScore: 100,
        falsePositives: 0,
        falseNegatives: 0,
        confidenceSums: 0,
        totalReactionTime: 0,
        trialsCount: 0,
    };
}

export function updateSmartStaircase(
    state: SmartStaircaseState,
    isCorrect: boolean,
    reactionTimeMs: number
): SmartStaircaseState {
    // 1. Run base update
    const baseState = updateBase(state, isCorrect);

    // 2. Calculate Consistency
    // Rule: If user misses a very easy target (LogMAR > 0.3) -> Strike against consistency
    let consistencyDrop = 0;
    if (!isCorrect && state.currentLogMAR > 0.4) {
        consistencyDrop += 10;
    }

    // Rule: If reaction time is extremely fast (< 200ms) -> Likely guessing -> Strike
    if (reactionTimeMs < 200) {
        consistencyDrop += 5;
    }

    const newConsistency = Math.max(0, state.consistencyScore - consistencyDrop);

    return {
        ...baseState,
        consistencyScore: newConsistency,
        totalReactionTime: state.totalReactionTime + reactionTimeMs,
        trialsCount: state.trialsCount + 1,
        falsePositives: state.falsePositives, // To be updated by catch trials
        falseNegatives: state.falseNegatives + (isCorrect ? 0 : (state.currentLogMAR > 0.5 ? 1 : 0)), // Simple metric
        confidenceSums: state.confidenceSums // To be integrated
    };
}

export function calculateReliability(state: SmartStaircaseState): number {
    // Starting at 100
    // Consistency drops it
    // erratic reversals drop it (calculated from history analysis)
    const score = state.consistencyScore;

    // Check for "stuck" behavior (alternating every single time)
    // ... complex logic stub

    return score;
}
