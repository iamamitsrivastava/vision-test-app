"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVision } from '@/lib/store/vision-context';
import { CreditCard, CheckCircle } from 'lucide-react';

const STANDARD_CARD_WIDTH_MM = 85.6;
const DEFAULT_PX = 300; // Arbitrary start

export function ScreenCalibrator() {
    const router = useRouter();
    const { setCalibrationPxMm } = useVision();
    const [sliderValue, setSliderValue] = useState(DEFAULT_PX);

    const handleSave = () => {
        const pxPerMm = sliderValue / STANDARD_CARD_WIDTH_MM;
        setCalibrationPxMm(pxPerMm);
        // Ideally save to DB here if user is logged in

        // Navigate to test setup
        setTimeout(() => {
            router.push('/test/setup');
        }, 500);
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                        Calibrate Screen Size
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-slate-600">
                        Place a standard credit card (or any ID card) against your screen.
                        Adjust the slider until the blue box below exactly matches the width of your card.
                    </p>

                    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-lg border border-slate-100 min-h-[200px]">
                        {/* The Resizable Box */}
                        <div
                            style={{ width: `${sliderValue}px` }}
                            className="h-48 bg-blue-500 rounded-xl shadow-lg flex items-center justify-center text-white/90 relative transition-all duration-75 ease-out"
                        >
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="font-mono font-bold tracking-widest text-lg opacity-50">CREDIT CARD</span>
                            </div>
                            <div className="absolute bottom-2 right-4 text-xs opacity-70">Standard Size</div>

                            {/* Measurement lines */}
                            <div className="absolute -bottom-6 w-full flex justify-between text-slate-400 text-xs">
                                <span>|</span>
                                <span className="w-full border-b border-slate-300 h-[10px] mb-[5px]"></span>
                                <span>|</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium text-slate-700">Adjust Width:</label>
                        <input
                            type="range"
                            min="200"
                            max="600"
                            step="1"
                            value={sliderValue}
                            onChange={(e) => setSliderValue(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="text-center text-xs text-slate-400 font-mono">
                            {sliderValue}px
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button size="lg" onClick={handleSave} className="w-full sm:w-auto">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm Calibration
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
