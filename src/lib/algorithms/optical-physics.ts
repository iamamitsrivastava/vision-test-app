/**
 * Optical Physics Simulation for Web Vision Testing
 * Maps clinical Diopter values to CSS filters.
 */

// Approximate mapping: 0.25 Diopter difference ~ 1-2px blur radius on standard screens depending on distance.
// We assume calibration has established a "Pixels Per MM".
// If not, we use intelligent defaults.

export const BASE_BLUR_FACTOR = 4; // Multiplier for Diopters to PX

export function getBlurPixels(dioptersMismatch: number): number {
    // 0 diopters (perfect) = 0px
    // The further from 0, the blurrier.
    // Use absolute value because + and - both cause blur.

    const blur = Math.abs(dioptersMismatch) * BASE_BLUR_FACTOR;

    // Cap blur to avoid unreadable mess? Or let it be messy?
    // Let's soft cap at 10px.
    return Math.min(15, Number(blur.toFixed(2)));
}

export function getScaleFactor(dioptersMismatch: number): number {
    // Physics:
    // Plus lenses (Hyperopia correction) Magnify
    // Minus lenses (Myopia correction) Minify

    // Scale starts at 1.0
    // Factor: 1.0 + (D * 0.05)

    const factor = 1.0 + (dioptersMismatch * 0.03);

    // Safety caps
    return Math.max(0.5, Math.min(1.5, Number(factor.toFixed(3))));
}

export function generateOptotype(): string {
    const chars = "CDHKNORSVZ";
    return chars.charAt(Math.floor(Math.random() * chars.length));
}
