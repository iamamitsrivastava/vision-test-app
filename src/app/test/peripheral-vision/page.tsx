"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useVision } from '@/lib/store/vision-context'; // Assuming we have this or similar
import { Eye, Check, X, RotateCcw, AlertCircle } from 'lucide-react';

import { usePremiumAccess } from '@/hooks/use-premium-access';

export default function PeripheralVisionPage() {
    const router = useRouter();
    const { isPremium, isLoading, PremiumGate } = usePremiumAccess();

    const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
    const [score, setScore] = useState(0);
    const [totalDots, setTotalDots] = useState(0);
    const [dotPosition, setDotPosition] = useState<{ top: string, left: string } | null>(null);
    const [message, setMessage] = useState("");

    // Game params
    const MAX_TRIALS = 15;
    const SHOW_DURATION = 600; // ms dot is visible
    const INTERVAL_BASE = 1500; // base time between dots

    // Logic
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (gameState === 'playing' && totalDots < MAX_TRIALS) {
            // Schedule next dot
            const delay = INTERVAL_BASE + Math.random() * 1000;
            timeoutId = setTimeout(() => {
                showDot();
            }, delay);
        } else if (gameState === 'playing' && totalDots >= MAX_TRIALS) {
            setGameState('result');
        }
        return () => clearTimeout(timeoutId);
    }, [gameState, totalDots]);

    const showDot = () => {
        // Random position, biased towards edges for "peripheral"
        const isLeft = Math.random() > 0.5;
        const isTop = Math.random() > 0.5;

        // Randomize 5-20% from edge
        const edgeOffsetX = 5 + Math.random() * 25;
        const edgeOffsetY = 5 + Math.random() * 25;

        // Coordinates in %
        const top = isTop ? `${edgeOffsetY}%` : `${100 - edgeOffsetY}%`;
        const left = isLeft ? `${edgeOffsetX}%` : `${100 - edgeOffsetY}%`;

        setDotPosition({ top, left });
        setTotalDots(prev => prev + 1);

        // Hide dot after duration
        setTimeout(() => {
            setDotPosition(null);
        }, SHOW_DURATION);
    };

    const handleInput = () => {
        if (dotPosition) {
            setScore(prev => prev + 1);
            setDotPosition(null); // Immediate feedback: disappear
            setMessage("Good!");
            setTimeout(() => setMessage(""), 500);
        }
    };

    // Keyboard spacebar listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && gameState === 'playing') {
                handleInput();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, dotPosition]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isPremium) {
        return <PremiumGate />;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 overflow-hidden relative select-none">

            {/* Fixation Point */}
            {gameState === 'playing' && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center">
                        <div className="w-1 h-1 bg-red-500 rounded-full" />
                    </div>
                </div>
            )}

            {/* The Dot */}
            {gameState === 'playing' && dotPosition && (
                <div
                    className="absolute w-6 h-6 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] cursor-pointer z-10 animate-pulse"
                    style={{ top: dotPosition.top, left: dotPosition.left }}
                    onMouseDown={handleInput}
                />
            )}

            {/* Messages */}
            {gameState === 'playing' && (
                <div className="absolute top-10 text-slate-500 text-sm font-bold uppercase tracking-widest">
                    Focus on the Center Cross • Press SPACE when you see a dot
                </div>
            )}

            {/* Intro */}
            {gameState === 'intro' && (
                <Card className="max-w-md w-full bg-slate-800 border-slate-700 text-slate-100 p-6 shadow-2xl">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <Eye className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold">Peripheral Vision Check</h1>
                        <p className="text-slate-300">
                            This test checks your side vision functionality.
                        </p>
                        <div className="text-left bg-slate-900/50 p-4 rounded-lg text-sm space-y-2 w-full">
                            <p>1. Sit about 50-60cm (arm's length) from screen.</p>
                            <p>2. Keep your eyes fixed on the <span className="text-red-400 font-bold">Red Cross</span> in the center.</p>
                            <p>3. Do NOT look around.</p>
                            <p>4. Press <span className="font-bold border px-1 rounded border-slate-600">SPACE</span> or Click immediately when you see a flashing white dot appear.</p>
                        </div>
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-500 text-lg py-6"
                            onClick={() => setGameState('playing')}
                        >
                            Start Test
                        </Button>
                    </div>
                </Card>
            )}

            {/* Results */}
            {gameState === 'result' && (
                <Card className="max-w-md w-full bg-slate-800 border-slate-700 text-slate-100 p-6">
                    <div className="flex flex-col items-center text-center space-y-6">
                        {score / MAX_TRIALS > 0.8 ? (
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="w-8 h-8 text-white" />
                            </div>
                        ) : (
                            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-8 h-8 text-white" />
                            </div>
                        )}

                        <h2 className="text-2xl font-bold">Test Complete</h2>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="bg-slate-900 p-4 rounded-xl">
                                <span className="text-slate-400 text-xs uppercase">Detected</span>
                                <div className="text-3xl font-bold text-white">{score} <span className="text-sm text-slate-500">/ {MAX_TRIALS}</span></div>
                            </div>
                            <div className="bg-slate-900 p-4 rounded-xl">
                                <span className="text-slate-400 text-xs uppercase">Accuracy</span>
                                <div className="text-3xl font-bold text-blue-400">{Math.round((score / MAX_TRIALS) * 100)}%</div>
                            </div>
                        </div>

                        <p className="text-slate-300 text-sm">
                            {score / MAX_TRIALS > 0.8
                                ? "Great! Your peripheral detection seems normal within the screen's field of view."
                                : "You missed a few cues. Ensure your room is dark and you are focusing strictly on the center."}
                        </p>

                        <div className="flex gap-3 w-full">
                            <Button variant="outline" className="flex-1" onClick={() => { setScore(0); setTotalDots(0); setGameState('playing'); }}>
                                <RotateCcw className="w-4 h-4 mr-2" /> Retry
                            </Button>
                            <Button className="flex-1 bg-blue-600 hover:bg-blue-500" onClick={() => router.push('/dashboard')}>
                                Finish
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
