import { ScreenCalibrator } from '@/components/calibration/ScreenCalibrator';

export default function CalibrationPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
            <div className="mb-8 text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Screen Calibration</h1>
                <p className="text-slate-600 max-w-md mx-auto">
                    To ensure accurate results, we need to calibrate your screen size.
                </p>
            </div>

            <ScreenCalibrator />
        </main>
    );
}
