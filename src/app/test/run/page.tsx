"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useVision } from '@/lib/store/vision-context';
import { initializeSmartStaircase, updateSmartStaircase, SmartStaircaseState } from '@/lib/algorithms/smart-staircase';
import { estimateThreshold, logMARToDiopters } from '@/lib/algorithms/staircase';
import { Stimulus } from '@/components/test/Stimulus';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

type TestPhase = 'SETUP_LEFT' | 'TEST_LEFT' | 'INTERMISSION' | 'SETUP_RIGHT' | 'TEST_RIGHT' | 'FINISHED';

export default function TestRunnerPage() {
    const router = useRouter();
    const { setLeftEyeResult, setRightEyeResult, calibrationPxMm } = useVision();

    const [phase, setPhase] = useState<TestPhase>('SETUP_LEFT');
    // Initialize with Smart Staircase
    const [staircase, setStaircase] = useState<SmartStaircaseState>(initializeSmartStaircase());
    const [orientation, setOrientation] = useState(0);
    const [isStimulusVisible, setIsStimulusVisible] = useState(false);

    // Timing refs
    const stimulusShownTime = useRef<number>(0);

    useEffect(() => {
        if (!calibrationPxMm) {
            router.push('/calibration');
        }
    }, [calibrationPxMm, router]);

    const randomize = useCallback(() => {
        const dirs = [0, 90, 180, 270];
        const nextDir = dirs[Math.floor(Math.random() * dirs.length)];
        setOrientation(nextDir);
        setIsStimulusVisible(true);
        stimulusShownTime.current = Date.now();
    }, []);



    const finishPhase = useCallback((finalState: SmartStaircaseState) => {
        const resultLogMAR = estimateThreshold(finalState);
        const resultDiopter = logMARToDiopters(resultLogMAR);

        const resultData = {
            logMAR: resultLogMAR,
            result: resultDiopter,
            consistency: finalState.consistencyScore,
            avgReactionTime: finalState.trialsCount > 0 ? Math.round(finalState.totalReactionTime / finalState.trialsCount) : 0
        };

        if (phase === 'TEST_LEFT') {
            setLeftEyeResult(resultData);
            setPhase('INTERMISSION');
        } else if (phase === 'TEST_RIGHT') {
            setRightEyeResult(resultData);
            setPhase('FINISHED');
            router.push('/results');
        }
    }, [phase, setLeftEyeResult, setRightEyeResult, router]);

    const handleResponse = useCallback((selectedDir: number) => {
        const reactionTime = Date.now() - stimulusShownTime.current;

        // Check correctness (-1 means skipped/can't see)
        // If selectedDir is -1, it's incorrect by default
        const isCorrect = selectedDir === orientation;

        // Update Staircase
        // If skipped, we treat as incorrect but maybe with less penalty on consistency?
        // For now, treat as standard incorrect
        const nextState = updateSmartStaircase(staircase, isCorrect, reactionTime);
        setStaircase(nextState);

        if (nextState.isFinished) {
            finishPhase(nextState);
        } else {
            setIsStimulusVisible(false);
            setTimeout(() => {
                randomize();
            }, 400);
        }
    }, [orientation, staircase, randomize, finishPhase]);



    const startTest = (nextPhase: 'TEST_LEFT' | 'TEST_RIGHT') => {
        setStaircase(initializeSmartStaircase());
        setPhase(nextPhase);
        randomize();
    };

    // Render Setup / Intermission
    if (phase === 'SETUP_LEFT') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
                <Card className="max-w-md w-full text-center p-6 bg-white shadow-xl border-slate-200">
                    <h2 className="text-2xl font-bold mb-4">Left Eye Test</h2>
                    <p className="mb-6 text-slate-600">
                        Cover your <strong className="text-blue-600">RIGHT EYE</strong> with your hand.
                        Keep both eyes open, but block vision from the right.
                    </p>
                    <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => startTest('TEST_LEFT')}>
                        Start Left Eye Test
                    </Button>
                </Card>
            </div>
        );
    }

    if (phase === 'INTERMISSION') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
                <Card className="max-w-md w-full text-center p-6 bg-white shadow-xl border-slate-200">
                    <h2 className="text-2xl font-bold mb-4">Right Eye Test</h2>
                    <p className="mb-6 text-slate-600">
                        Great! Now cover your <strong className="text-blue-600">LEFT EYE</strong>.
                    </p>
                    <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => startTest('TEST_RIGHT')}>
                        Start Right Eye Test
                    </Button>
                </Card>
            </div>
        );
    }

    // Testing Interface
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 relative">
            {/* Reliability Meter */}
            <div className="absolute top-4 right-4 flex flex-col items-end">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Reliability</div>
                <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${staircase.consistencyScore > 80 ? 'bg-green-500' : staircase.consistencyScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${staircase.consistencyScore}%` }}
                    />
                </div>
            </div>

            <div className="mb-8 text-center text-sm font-mono text-slate-400">
                Trial {staircase.history.length + 1} | Reversals {staircase.reversals}
            </div>

            <div className="relative w-64 h-64 bg-white rounded-xl shadow-lg border-2 border-slate-100 flex items-center justify-center mb-12 transform transition-all duration-300">
                {isStimulusVisible && (
                    <Stimulus
                        logMAR={staircase.currentLogMAR}
                        type="E"
                        orientation={orientation}
                    />
                )}
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                <div />
                <Button
                    variant="outline"
                    size="icon"
                    className="h-20 w-20 rounded-full border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm"
                    onClick={() => handleResponse(270)}
                >
                    <ArrowUp className="h-8 w-8 text-slate-700" />
                </Button>
                <div />

                <Button
                    variant="outline"
                    size="icon"
                    className="h-20 w-20 rounded-full border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm"
                    onClick={() => handleResponse(180)}
                >
                    <ArrowLeft className="h-8 w-8 text-slate-700" />
                </Button>

                <div className="flex items-center justify-center">
                    {/* Center spacer */}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    className="h-20 w-20 rounded-full border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm"
                    onClick={() => handleResponse(0)}
                >
                    <ArrowRight className="h-8 w-8 text-slate-700" />
                </Button>

                <div />
                <Button
                    variant="outline"
                    size="icon"
                    className="h-20 w-20 rounded-full border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm"
                    onClick={() => handleResponse(90)}
                >
                    <ArrowDown className="h-8 w-8 text-slate-700" />
                </Button>
                <div />
            </div>

            <div className="mt-8">
                <Button variant="ghost" className="text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={() => handleResponse(-1)}>
                    I can&apos;t see it (Skip)
                </Button>
            </div>
        </div>
    );
}
