"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { setCalibration } from '@/lib/algorithms/snellen-engine';

export default function CalibrationPage() {
    const router = useRouter();
    // Standard credit card width is 85.6mm (8.56cm)
    const CARD_WIDTH_CM = 8.56;

    // Default to ~300px (approx visual size on desktop)
    const [sliderValue, setSliderValue] = useState([300]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const currentPxWidth = sliderValue[0];

    const handleConfirm = () => {
        // Calculate Pixels Per CM
        const pxPerCm = currentPxWidth / CARD_WIDTH_CM;
        setCalibration(pxPerCm);
        router.push('/test/refraction');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-xl w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">

                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-sm">
                        <ShieldCheck className="h-4 w-4" />
                        Accuracy Calibration
                    </div>
                    <h1 className="text-3xl font-black text-slate-900">Let&apos;s Measure Your Screen</h1>
                    <p className="text-slate-500 text-lg">
                        To achieve <span className="font-bold text-slate-900">99% clinical accuracy</span>, we need to know your exact screen size.
                    </p>
                </div>

                <Card className="bg-white p-8 border-2 border-slate-200 shadow-xl overflow-hidden relative">
                    <div className="space-y-8 relative z-10">

                        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 text-center">
                            <p className="text-blue-900 font-medium mb-4">
                                Place a standard credit/debit card against the screen below.
                                <br />
                                <span className="text-sm opacity-70">We do not scan your card. This is just for size.</span>
                            </p>

                            {/* The Resizable Card Area */}
                            <div className="flex justify-center py-4">
                                <div
                                    className="h-48 rounded-xl bg-gradient-to-br from-slate-800 to-black text-white shadow-2xl flex flex-col justify-between p-6 relative transition-all duration-75 ease-out will-change-transform"
                                    style={{
                                        width: `${currentPxWidth}px`,
                                        height: `${currentPxWidth * 0.63}px` // Aspect ratio of card
                                    }}
                                >
                                    {/* Card Visuals */}
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-8 bg-amber-400 rounded-md opacity-80" />
                                        <div className="font-mono text-xs opacity-50">Standard ID-1</div>
                                    </div>
                                    <div className="font-mono text-lg tracking-widest opacity-80 mt-auto">
                                        •••• •••• •••• ••••
                                    </div>

                                    {/* Resize Handles */}
                                    <div className="absolute -right-6 top-1/2 -translate-y-1/2 text-blue-500 animate-pulse hidden md:block">
                                        <ArrowRight className="h-8 w-8" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm font-bold text-slate-500">
                                <span>Smaller</span>
                                <span>Larger</span>
                            </div>
                            <Slider
                                value={sliderValue}
                                onValueChange={setSliderValue}
                                max={600}
                                min={150}
                                step={1}
                                className="py-4 cursor-grab active:cursor-grabbing"
                            />
                            <p className="text-center text-xs text-slate-400">
                                Drag the slider until the specific card image matches your physical card width.
                            </p>
                        </div>

                        <Button
                            size="lg"
                            className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20"
                            onClick={handleConfirm}
                        >
                            It Matches Perfectly <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
