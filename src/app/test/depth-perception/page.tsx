"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Layers, ArrowRight, RotateCcw } from 'lucide-react';

import { usePremiumAccess } from '@/hooks/use-premium-access';

export default function DepthPerceptionPage() {
    const router = useRouter();
    const { isPremium, isLoading, PremiumGate } = usePremiumAccess();

    const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState("");

    // In this simulation, "Closer" = Larger Size + Higher Contrast
    // We present two shapes, user picks the one that appears "closer"

    const [leftObject, setLeftObject] = useState({ size: 100, opacity: 1 });
    const [rightObject, setRightObject] = useState({ size: 100, opacity: 1 });
    const [correctSide, setCorrectSide] = useState<'left' | 'right'>('left');

    const generateLevel = (currentLevel: number) => {
        // Base size
        const base = 120;
        // Difficulty factor: decreases as level increases (easier to distinguish at L1, harder at L10)
        // Level 1: 30% diff. Level 10: 2% diff
        const difficulty = Math.max(0.02, 0.35 - (currentLevel * 0.03));

        const isLeftCloser = Math.random() > 0.5;
        setCorrectSide(isLeftCloser ? 'left' : 'right');

        const largerSize = base;
        const smallerSize = base * (1 - difficulty);

        // Add subtle opacity cue for depth (closer usually clearer/brighter/larger)
        const largerOpacity = 1;
        const smallerOpacity = 0.8 + (Math.random() * 0.1);

        if (isLeftCloser) {
            setLeftObject({ size: largerSize, opacity: largerOpacity });
            setRightObject({ size: smallerSize, opacity: smallerOpacity });
        } else {
            setLeftObject({ size: smallerSize, opacity: smallerOpacity });
            setRightObject({ size: largerSize, opacity: largerOpacity });
        }
    };

    const handleChoice = (side: 'left' | 'right') => {
        if (side === correctSide) {
            setScore(score + 1);
            setFeedback("Correct! Next...");
            if (level < 10) {
                setLevel(level + 1);
                setTimeout(() => {
                    setFeedback("");
                    generateLevel(level + 1);
                }, 400);
            } else {
                setGameState('result');
            }
        } else {
            // Wrong choice
            setFeedback("Missed! That was further away.");
            setTimeout(() => {
                setGameState('result');
            }, 800);
        }
    };

    useEffect(() => {
        if (gameState === 'playing') {
            generateLevel(1);
        }
    }, [gameState]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isPremium) {
        return <PremiumGate />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 flex flex-col items-center justify-center p-4">

            {/* Header / Progress */}
            {gameState === 'playing' && (
                <div className="absolute top-4 w-full max-w-xl flex justify-between px-4 text-slate-500 font-bold uppercase tracking-wider text-sm">
                    <span>Level {level} / 10</span>
                    <span>Score: {score}</span>
                </div>
            )}

            {/* Intro Screen */}
            {gameState === 'intro' && (
                <Card className="max-w-md w-full shadow-2xl p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/30 transform rotate-3">
                        <Layers className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Depth Perception Check</h1>
                        <p className="text-slate-500 mt-2">
                            Test your ability to judge relative distance using monocular visual cues (size and contrast).
                        </p>
                    </div>

                    <div className="text-sm bg-slate-50 p-4 rounded-xl text-left border border-slate-100 space-y-2">
                        <p className="font-semibold text-slate-800">How to play:</p>
                        <ul className="list-disc pl-5 space-y-1 text-slate-600">
                            <li>Two spheres will appear.</li>
                            <li>Select the one that looks <strong>CLOSER</strong> to you.</li>
                            <li>Closer objects typically appear <strong>larger</strong> and <strong>clearer</strong>.</li>
                            <li>It gets harder as you progress!</li>
                        </ul>
                    </div>

                    <Button onClick={() => setGameState('playing')} className="w-full h-12 text-lg font-bold bg-indigo-600 hover:bg-indigo-700">
                        Start Challenge
                    </Button>
                </Card>
            )}

            {/* Game Area */}
            {gameState === 'playing' && (
                <div className="flex flex-col items-center gap-12 w-full max-w-4xl">
                    <h2 className="text-2xl font-bold text-slate-800 animate-pulse">Which object is CLOSER?</h2>

                    <div className="flex w-full justify-center gap-20 md:gap-40 items-center h-[300px]">
                        {['left', 'right'].map((side) => {
                            const obj = side === 'left' ? leftObject : rightObject;
                            return (
                                <button
                                    key={side}
                                    onClick={() => handleChoice(side as 'left' | 'right')}
                                    className="group relative transition-all duration-300 ease-out hover:scale-105 focus:outline-none"
                                    style={{
                                        width: `${obj.size * 2}px`,
                                        height: `${obj.size * 2}px`,
                                    }}
                                >
                                    {/* Sphere CSS */}
                                    <div
                                        className="w-full h-full rounded-full shadow-2xl transition-all"
                                        style={{
                                            background: 'radial-gradient(circle at 30% 30%, #6366f1, #312e81)',
                                            opacity: obj.opacity,
                                            boxShadow: `0 20px 50px -12px rgba(49, 46, 129, ${0.5 * obj.opacity})`
                                        }}
                                    />
                                    {/* Hover Ring */}
                                    <div className="absolute -inset-4 border-2 border-indigo-400 rounded-full opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all" />
                                </button>
                            );
                        })}
                    </div>

                    <div className="h-8 text-lg font-bold text-indigo-600">
                        {feedback}
                    </div>
                </div>
            )}

            {/* Results */}
            {gameState === 'result' && (
                <Card className="max-w-md w-full shadow-2xl p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Game Over</h2>
                        <div className="text-5xl font-black text-indigo-600 my-4">{score} <span className="text-lg text-slate-400 font-medium">/ 10</span></div>
                        <p className="text-slate-500">
                            {score >= 9 ? "Excellent! Your depth perception cues are sharp." :
                                score >= 6 ? "Good job. You have average depth discrimination." :
                                    "You struggled with fine depth differences."}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="outline" className="flex-1" onClick={() => { setScore(0); setLevel(1); setGameState('playing'); }}>
                            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
                        </Button>
                        <Button className="flex-1 bg-indigo-600" onClick={() => router.push('/dashboard')}>
                            Done
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
}
