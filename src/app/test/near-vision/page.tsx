"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Check, X, Info, Mic, MicOff } from 'lucide-react';
import { useVoiceRecognition } from '@/hooks/use-voice-recognition';

// --- DATA: NEAR VISION SENTENCES ---
// Progression: J1 (Smallest) -> J2 -> J5 -> J7 -> J10 (Largest)
// We will simply display them as text blocks with increasing font sizes.
const TEST_STAGES = [
    {
        id: "J1",
        label: "Visual Acuity J1 (Very Fine Print)",
        fontSize: "text-[9px]", // Approx J1 equivalent on screen
        text: "The quick brown fox jumps over the lazy dog. Reading this line requires excellent near vision.",
        question: "Can you read this sentence clearly without squinting?"
    },
    {
        id: "J3",
        label: "Visual Acuity J3 (Small Print)",
        fontSize: "text-[12px]", // Approx J3
        text: "Pack my box with five dozen liquor jugs. This size is typical for newspapers.",
        question: "Is this text clear and legible to you?"
    },
    {
        id: "J5",
        label: "Visual Acuity J5 (Medium Print)",
        fontSize: "text-[16px]", // Approx J5 (Normal reading size)
        text: "How vexingly quick daft zebras jump! This is standard book font size.",
        question: "Can you read this comfortably?"
    },
    {
        id: "J7",
        label: "Visual Acuity J7 (Large Print)",
        fontSize: "text-[20px]", // Approx J7
        text: "Sphinx of black quartz, judge my vow.",
        question: "Is this large text clear to you?"
    },
    {
        id: "J10",
        label: "Visual Acuity J10 (Very Large Print)",
        fontSize: "text-[28px]", // Approx J10 (Headlines)
        text: "The five boxing wizards jump quickly.",
        question: "Can you read this very large text?"
    }
];

export default function NearVisionTestPage() {
    const router = useRouter();
    const [phase, setPhase] = useState<'INSTRUCT' | 'TEST_LEFT' | 'TEST_RIGHT' | 'RESULT'>('INSTRUCT');
    const [stageIndex, setStageIndex] = useState(0); // Which sentence are we showing?
    const [results, setResults] = useState<{ leftJ?: string, rightJ?: string }>({});
    const [isMicEnabled, setIsMicEnabled] = useState(true);

    // --- VOICE CONTROL ---
    const { isListening, transcript } = useVoiceRecognition({
        enabled: (phase === 'TEST_LEFT' || phase === 'TEST_RIGHT') && isMicEnabled,
        targets: ['YES', 'CLEAR', 'NO', 'BLURRY'],
        onTargetMatch: (word) => {
            if (['YES', 'CLEAR'].includes(word)) handleResponse(true);
            if (['NO', 'BLURRY'].includes(word)) handleResponse(false);
        },
        onCommand: (cmd) => {
            if (cmd === 'CANT_SEE' || cmd === 'CAN_SEE') {
                handleResponse(cmd === 'CAN_SEE');
            }
        }
    });

    // --- HANDLERS ---
    // When user answers YES/NO
    const handleResponse = (canRead: boolean) => {
        const currentJ = TEST_STAGES[stageIndex].id;

        if (canRead) {
            // SUCCESS! They can read this level.
            // Record result and move to next eye OR finish.
            // Since we start from J1 (Hardest), if they can read J1, they have J1 vision (Best).
            // We verify J1 immediately. No need to show easier ones.
            registerResult(currentJ);
        } else {
            // FAILURE. They can't read this size.
            // Move to next easier stage (StageIndex + 1)
            // If this was the last stage (Largest), their vision is worse than J10.
            if (stageIndex < TEST_STAGES.length - 1) {
                setStageIndex(prev => prev + 1);
            } else {
                // Failed even the largest text
                registerResult("> J10");
            }
        }
    };

    const registerResult = (score: string) => {
        if (phase === 'TEST_LEFT') {
            setResults(prev => ({ ...prev, leftJ: score }));
            // Prepare for Right Eye
            setPhase('TEST_RIGHT');
            setStageIndex(0); // Reset to J1 for right eye
        } else {
            setResults(prev => ({ ...prev, rightJ: score }));
            // Finish
            setPhase('RESULT');
        }
    };

    // --- RENDERERS ---

    if (phase === 'INSTRUCT') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
                <Card className="max-w-xl w-full p-8 space-y-8 shadow-xl border-t-4 border-blue-600">
                    <div className="space-y-4 text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Info className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Near Vision Assessment</h1>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            This clinical evaluation assesses your <strong>Visual Acuity at close range</strong> to detect signs of early presbyopia or hyperopia.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 text-left space-y-4 shadow-sm">
                        <h3 className="font-bold text-slate-800 uppercase tracking-wide text-sm border-b border-slate-100 pb-2">Instructions</h3>
                        <p className="flex items-start gap-3 text-slate-700">
                            <span className="font-bold text-blue-600">1.</span>
                            <span>Hold your device strictly <strong>14 inches (35cm)</strong> away from your eyes.</span>
                        </p>
                        <p className="flex items-start gap-3 text-slate-700">
                            <span className="font-bold text-blue-600">2.</span>
                            <span>If you wear reading glasses or contact lenses, please <strong>keep them ON</strong>.</span>
                        </p>
                        <p className="flex items-start gap-3 text-slate-700">
                            <span className="font-bold text-blue-600">3.</span>
                            <span>We will test each eye individually. Please cover the eye not being tested.</span>
                        </p>
                    </div>

                    <Button size="lg" className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/10" onClick={() => setPhase('TEST_LEFT')}>
                        Start Left Eye Examination
                    </Button>
                </Card>
            </div>
        );
    }

    if (phase === 'RESULT') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
                <Card className="max-w-2xl w-full p-8 md:p-12 text-center space-y-8 shadow-2xl">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Assessment Report</h1>
                        <p className="text-slate-500">Clinical Near Vision Screening</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Result */}
                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Left Eye</div>
                            <div className="text-4xl font-bold text-slate-900 mb-1">{results.leftJ}</div>
                            <div className={`text-sm font-medium ${results.leftJ === 'J1' ? 'text-green-600' : 'text-amber-600'}`}>
                                {results.leftJ === 'J1' ? 'Normal Acuity' : 'Reduction Detected'}
                            </div>
                        </div>

                        {/* Right Result */}
                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Right Eye</div>
                            <div className="text-4xl font-bold text-slate-900 mb-1">{results.rightJ}</div>
                            <div className={`text-sm font-medium ${results.rightJ === 'J1' ? 'text-green-600' : 'text-amber-600'}`}>
                                {results.rightJ === 'J1' ? 'Normal Acuity' : 'Reduction Detected'}
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl text-left border border-blue-100">
                        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                            <Info className="w-5 h-5" />
                            Clinical Interpretation
                        </h4>
                        <p className="text-sm text-blue-800 leading-relaxed">
                            <strong>J1</strong> is considered normal near vision (comparable to 20/20 at distance).
                            Scores of <strong>J3 or higher</strong> indicate some degree of presbyopia or farsightedness, possibly requiring reading glasses.
                        </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button variant="outline" size="lg" className="flex-1 h-12" onClick={() => router.push('/')}>
                            Back to Home
                        </Button>
                        <Button size="lg" className="flex-1 h-12 bg-blue-600 text-white hover:bg-blue-700" onClick={() => router.push('/results')}>
                            Save to Profile
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // --- TEST UI ---
    const currentEyeLabel = phase === 'TEST_LEFT' ? 'Left Eye' : 'Right Eye';
    const otherEyeLabel = phase === 'TEST_LEFT' ? 'Right Eye' : 'Left Eye';
    const currentStage = TEST_STAGES[stageIndex];

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            {/* Context Header */}
            <div className="bg-white px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-20 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold uppercase tracking-wider">
                        {currentEyeLabel}
                    </div>
                    <span className="text-sm text-slate-500 font-medium hidden md:inline-block">Cover your <span className="text-slate-900 font-bold">{otherEyeLabel}</span> now</span>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-900" onClick={() => router.push('/')}>
                    Exit Test
                </Button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 w-full max-w-4xl mx-auto">

                {/* Visual Stimulus Area */}
                <div className="bg-white rounded-3xl shadow-xl w-full p-8 md:p-16 flex flex-col items-center justify-center min-h-[400px] mb-32 md:mb-0 relative border border-slate-100 transition-all duration-300">
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest absolute top-8">
                        {currentStage.label}
                    </p>

                    {/* The Text to Read */}
                    <p className={`font-serif text-slate-900 text-center leading-relaxed max-w-2xl ${currentStage.fontSize}`}>
                        {currentStage.text}
                    </p>
                </div>

                {/* Response Bar */}
                <div className="fixed bottom-0 left-0 right-0 p-6 pb-20 md:pb-6 bg-white/90 backdrop-blur-lg border-t border-slate-200 flex flex-col md:flex-row items-center justify-center gap-6 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-bold text-slate-900">{currentStage.question}</h3>
                        <p className="text-xs text-slate-500">Hold device 14 inches away</p>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <Button
                            variant="outline"
                            className="flex-1 md:w-40 h-14 text-base border-2 border-slate-200 text-slate-900 hover:border-red-200 hover:bg-red-50 hover:text-red-700 transition-all rounded-xl"
                            onClick={() => handleResponse(false)}
                        >
                            <X className="mr-2 h-5 w-5" /> No, Blurry
                        </Button>
                        <Button
                            className="flex-1 md:w-40 h-14 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all rounded-xl"
                            onClick={() => handleResponse(true)}
                        >
                            <Check className="mr-2 h-5 w-5" /> Yes, Clear
                        </Button>
                    </div>
                </div>
                {/* Voice Status Indicator */}
                <div className="fixed bottom-24 md:bottom-24 left-0 right-0 flex justify-center pointer-events-none z-40">
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
                                {transcript ? `Heard: "${transcript}"` : "Say 'Yes' or 'No'"}
                            </>
                        ) : (
                            <span className="text-slate-400">Mic Off</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
