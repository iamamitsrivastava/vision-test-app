"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AstigmatismDial } from '@/components/test/AstigmatismDial';
import { useVision } from '@/lib/store/vision-context';
import { useVoiceRecognition } from '@/hooks/use-voice-recognition';
import { Mic, MicOff } from 'lucide-react';

export default function AstigmatismTestPage() {
    const router = useRouter();
    const { setAstigmatismResult } = useVision();

    const [step, setStep] = useState<'INSTRUCT' | 'TEST_LEFT' | 'TEST_RIGHT' | 'RESULT'>('INSTRUCT');
    const [results, setResults] = useState<{ left?: number, right?: number }>({});
    const [isMicEnabled, setIsMicEnabled] = useState(true);

    // --- VOICE CONTROL ---
    const { isListening, transcript } = useVoiceRecognition({
        enabled: (step === 'TEST_LEFT' || step === 'TEST_RIGHT') && isMicEnabled,
        targets: ['NORMAL', 'SAME', 'ALL', 'CLEAR'],
        onTargetMatch: (word) => {
            handleAllClear();
        }
    });

    const handleSelection = (angle: number) => {
        if (step === 'TEST_LEFT') {
            setResults(prev => ({ ...prev, left: angle }));
            setStep('TEST_RIGHT');
        } else if (step === 'TEST_RIGHT') {
            const final = { ...results, right: angle };
            setResults(final);
            setAstigmatismResult(final);
            setStep('RESULT');
        }
    };

    const handleAllClear = () => {
        if (step === 'TEST_LEFT') {
            setResults(prev => ({ ...prev, left: -1 })); // -1 means No Astigmatism
            setStep('TEST_RIGHT');
        } else if (step === 'TEST_RIGHT') {
            const final = { ...results, right: -1 };
            setResults(final);
            setAstigmatismResult(final);
            setStep('RESULT');
        }
    };

    if (step === 'INSTRUCT') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <Card className="max-w-md w-full p-6 text-center space-y-4">
                    <h1 className="text-2xl font-bold">Astigmatism Check</h1>
                    <p className="text-slate-600">
                        This test checks for curvature irregularities in your eye.
                        You will see a dial with radiating lines.
                    </p>
                    <p className="text-sm font-medium">
                        If some lines appear <span className="font-bold text-black">DARKER</span> or <span className="font-bold text-black">THICKER</span> than others, select them.
                        If all look the same, click &quot;All Same&quot;.
                    </p>
                    <Button className="w-full" size="lg" onClick={() => setStep('TEST_LEFT')}>
                        Start (Cover Right Eye)
                    </Button>
                </Card>
            </div>
        );
    }

    if (step === 'RESULT') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <Card className="max-w-md w-full p-6 text-center space-y-4">
                    <h1 className="text-2xl font-bold">Results</h1>
                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="p-4 border rounded bg-slate-50">
                            <div className="font-bold text-slate-500 text-xs uppercase">Left Eye</div>
                            <div className="text-xl font-semibold">
                                {results.left === -1 ? "Normal" : `Axis: ${results.left}°`}
                            </div>
                        </div>
                        <div className="p-4 border rounded bg-slate-50">
                            <div className="font-bold text-slate-500 text-xs uppercase">Right Eye</div>
                            <div className="text-xl font-semibold">
                                {results.right === -1 ? "Normal" : `Axis: ${results.right}°`}
                            </div>
                        </div>
                    </div>
                    <Button className="w-full" onClick={() => router.push('/results')}>
                        View Full Report
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
            <h2 className="text-xl font-bold mb-8">
                {step === 'TEST_LEFT' ? "Left Eye (Right Covered)" : "Right Eye (Left Covered)"}
            </h2>

            <div className="bg-white p-8 rounded-full shadow-xl border mb-8">
                <AstigmatismDial onSelectAxis={handleSelection} />
            </div>

            <Button variant="outline" size="lg" onClick={handleAllClear}>
                All Lines Look the Same (Normal)
            </Button>

            {/* Voice Status Indicator */}
            <div className="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none z-40">
                <div className="bg-slate-900/80 backdrop-blur-sm text-white pl-1 pr-4 py-1 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg transition-all animate-in slide-in-from-bottom-2 pointer-events-auto">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMicEnabled(!isMicEnabled)}
                        className="h-8 w-8 text-white hover:text-white hover:bg-white/10 rounded-full"
                    >
                        {isMicEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>
                    {isMicEnabled ? (
                        <>
                            <div className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`}></div>
                            {transcript ? `Heard: "${transcript}"` : "Say 'Normal'"}
                        </>
                    ) : (
                        <span className="text-slate-400">Mic Off</span>
                    )}
                </div>
            </div>
        </div>
    );
}
