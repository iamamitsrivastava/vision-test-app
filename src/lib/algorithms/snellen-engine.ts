export type SnellenLine = {
    acuity: string; // "20/20" - US
    metric: string; // "6/6" - Metric
    logMAR: number; // Clinical value
    length: number; // Number of chars to generate
};

// Reference Levels: 20/1200 (Huge), 20/600, 20/200, ...
export const SNELLEN_LEVELS: SnellenLine[] = [
    { acuity: "20/1200", metric: "6/360", logMAR: 1.8, length: 1 }, // ~26cm tall (Full Screen)
    { acuity: "20/600", metric: "6/180", logMAR: 1.5, length: 1 }, // ~13cm tall
    { acuity: "20/200", metric: "6/60", logMAR: 1.0, length: 1 },
    { acuity: "20/100", metric: "6/30", logMAR: 0.7, length: 1 },
    { acuity: "20/70", metric: "6/21", logMAR: 0.54, length: 1 },
    { acuity: "20/50", metric: "6/15", logMAR: 0.4, length: 1 },
    { acuity: "20/40", metric: "6/12", logMAR: 0.3, length: 1 },
    { acuity: "20/30", metric: "6/9", logMAR: 0.18, length: 1 },
    { acuity: "20/25", metric: "6/7.5", logMAR: 0.1, length: 1 },
    { acuity: "20/20", metric: "6/6", logMAR: 0.0, length: 1 },
];

// ... (keep generateSnellenLetters and calculateAccuracy as is) ...

export function generateSnellenLetters(length: number): string {
    const chars = "EFPTOZLDC0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        const char = chars.charAt(Math.floor(Math.random() * chars.length));
        result += char;
    }
    return result;
}

export function calculateAccuracy(expected: string, input: string): number {
    return expected === input ? 1 : 0;
}

export function estimateDiopters(logMAR: number): number {
    if (logMAR <= 0) return 0.00;
    if (logMAR <= 0.1) return -0.25;
    if (logMAR <= 0.3) return -0.75;
    if (logMAR <= 0.5) return -1.25;
    if (logMAR <= 0.7) return -1.75;
    if (logMAR <= 1.0) return -2.50;
    if (logMAR <= 1.5) return -4.00;
    return -5.00; // > 20/600
}

// ... (Calibration Logic) ...

let calibrationPxPerCm = 0;

export function setCalibration(pxPerCm: number) {
    if (pxPerCm > 0) {
        calibrationPxPerCm = pxPerCm;
        if (typeof window !== 'undefined') {
            localStorage.setItem('vision_calibration_px_per_cm', pxPerCm.toString());
        }
    }
}

export function getCalibration(): number {
    if (calibrationPxPerCm === 0 && typeof window !== 'undefined') {
        const saved = localStorage.getItem('vision_calibration_px_per_cm');
        if (saved) calibrationPxPerCm = parseFloat(saved);
    }
    return calibrationPxPerCm;
}

/**
 * Calculates pixels for a 3 METER (10 FEET) viewing distance.
 * This is standard for home/room tests. 
 * At 3m, 20/200 is approx 4.4cm tall.
 */
export function getLetterSizePixels(metricRatio: string): number {
    const pxPerCm = getCalibration();
    const scale = pxPerCm > 0 ? pxPerCm : 37.8; // Default 96 DPI

    // Distance = 3000mm (3 meters)
    // 20/20 (6/6) subtends 5 arcmin.
    // h = 2 * 3000 * tan(5/120 * PI/180)
    // h ≈ 4.363 mm = 0.4363 cm
    const baseHeight6_6_Cm = 0.4363;

    const [numerator, denominator] = metricRatio.split('/').map(Number);
    const sizeFactor = denominator / numerator;

    const targetHeightCm = baseHeight6_6_Cm * sizeFactor;

    return targetHeightCm * scale;
}
