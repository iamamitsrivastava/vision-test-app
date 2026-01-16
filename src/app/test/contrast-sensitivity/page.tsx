"use client";

import { useState, useCallback } from 'react';
import { useVision } from '@/lib/store/vision-context';
import { useVoiceRecognition } from '@/hooks/use-voice-recognition';
import { usePremiumAccess } from '@/hooks/use-premium-access';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Moon, Info, RefreshCw, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

// --- DATA & CONFIG ---
// Pelli-Robson inspired contrast levels (LogCS approx)
// Opacity values are approximate for web (assuming max brightness)
const CONTRAST_LEVELS = [
    { level: 1, opacity: 1.0, label: "100%", description: "High Contrast" },
    { level: 2, opacity: 0.60, label: "60%", description: "Medium-High" },
    { level: 3, opacity: 0.25, label: "25%", description: "Medium" },
    { level: 4, opacity: 0.10, label: "10%", description: "Low" },
    { level: 5, opacity: 0.05, label: "5%", description: "Very Low" },
    { level: 6, opacity: 0.025, label: "2.5%", description: "Ultra Low" },
    { level: 7, opacity: 0.0125, label: "1.25%", description: "Threshold" },
];

const POSSIBLE_LETTERS = ['C', 'D', 'H', 'K', 'N', 'O', 'R', 'S', 'V', 'Z'];

export default function ContrastSensitivityTestPage() {
    const router = useRouter();
    const { setContrastResult } = useVision();
    const { isPremium, isLoading, PremiumGate } = usePremiumAccess();

    const [phase, setPhase] = useState<'INSTRUCT' | 'TEST' | 'RESULT'>('INSTRUCT');
    const [isMicEnabled, setIsMicEnabled] = useState(true);

    // Test State
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [targetLetter, setTargetLetter] = useState('');
    const [choices, setChoices] = useState<string[]>([]);
    const [score, setScore] = useState(0);

    // New Accuracy Logic: Track performance within the *current level*
    const [correctInLevel, setCorrectInLevel] = useState(0);
    const [trialsInLevel, setTrialsInLevel] = useState(0);

    const [history, setHistory] = useState<{ level: number, correct: boolean }[]>([]);

    // Initialize round
    const startRound = useCallback(() => {
        // Pick random letter
        const letter = POSSIBLE_LETTERS[Math.floor(Math.random() * POSSIBLE_LETTERS.length)];
        setTargetLetter(letter);

        // Generate choices (Target + 3 Random distinct)
        const distractors = POSSIBLE_LETTERS.filter(l => l !== letter)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        const options = [...distractors, letter].sort(() => 0.5 - Math.random());
        setChoices(options);
    }, []);

    const completeTest = (finalScore: number) => {
        setScore(finalScore);
        const finalLevel = finalScore > 0 ? CONTRAST_LEVELS[finalScore - 1] : null;
        const isGood = finalScore >= 5;

        setContrastResult({
            score: finalScore,
            label: finalLevel?.label || "N/A",
            sensitivity: isGood ? "Normal" : "Reduced"
        });
        setPhase('RESULT');
    };

    const handleAnswer = (selectedLetter: string) => {
        const isCorrect = selectedLetter === targetLetter;
        const newCorrectCount = isCorrect ? correctInLevel + 1 : correctInLevel;
        const newTrialCount = trialsInLevel + 1;

        // Update state asynchronously, but verify logic with "new" values
        setCorrectInLevel(newCorrectCount);
        setTrialsInLevel(newTrialCount);

        const newHistory = [...history, { level: currentLevelIndex + 1, correct: isCorrect }];
        setHistory(newHistory);

        // --- 2 out of 3 RULE ---
        if (newCorrectCount >= 2) {
            // PASSED: They got 2 right at this level.
            setScore(currentLevelIndex + 1); // Score is this level

            if (currentLevelIndex < CONTRAST_LEVELS.length - 1) {
                // Next Level
                setCurrentLevelIndex(prev => prev + 1);
                // Reset counters for next level
                setCorrectInLevel(0);
                setTrialsInLevel(0);
                startRound();
            } else {
                // Finished all levels
                completeTest(currentLevelIndex + 1);
            }
        } else if (newTrialCount >= 3 || (newTrialCount === 2 && newCorrectCount === 0)) {
            // FAILED:
            // 3 trials done, didn't reach 2 correct (so 0 or 1 correct).
            // OR 2 trials done, 0 correct (can't reach 2/3 anymore).
            completeTest(score);
        } else {
            // CONTINUE:
            // e.g. 1/1 correct, or 0/1 wrong. Continue testing at this level.
            startRound();
        }
    };

    // Voice Control
    const { isListening, transcript } = useVoiceRecognition({
        enabled: phase === 'TEST' && isMicEnabled,
        targets: choices, // Listen for all available choices, including distractors
        onTargetMatch: (match) => {
            // If they said the letter, treat as click
            handleAnswer(match);
        },
        onCommand: (cmd) => {
            if (cmd === 'CANT_SEE') {
                handleAnswer("SKIP");
            }
        }
    });

    const startTest = () => {
        setCurrentLevelIndex(0);
        setScore(0);
        setCorrectInLevel(0);
        setTrialsInLevel(0);
        setHistory([]);
        setPhase('TEST');
        startRound();
    };

    // --- RENDERERS ---

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!isPremium) {
        return <PremiumGate />;
    }

    if (phase === 'INSTRUCT') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-slate-50">
                <PremiumGate />
                <Card className="max-w-xl w-full p-8 space-y-8 bg-slate-800 border-slate-700 shadow-2xl">
                    <div className="space-y-4 text-center">
                        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Moon className="w-8 h-8 text-purple-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Contrast Sensitivity</h1>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            This test measures your ability to distinguish faint objects from their background, which is crucial for <strong>night driving</strong> and reading in <strong>low light</strong>.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 text-left space-y-4">
                        <h3 className="font-bold text-purple-300 uppercase tracking-wide text-sm border-b border-slate-700 pb-2">Preparation</h3>
                        <div className="space-y-3">
                            <p className="flex items-center gap-3 text-slate-300">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-xs font-bold">1</span>
                                <span>Set your screen brightness to <strong>MAXIMUM</strong>.</span>
                            </p>
                            <p className="flex items-center gap-3 text-slate-300">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-xs font-bold">2</span>
                                <span>Sit comfortably at arm&apos;s length (approx 20-25 inches).</span>
                            </p>
                            <p className="flex items-center gap-3 text-slate-300">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-xs font-bold">3</span>
                                <span>If you wear glasses/contacts, keep them ON.</span>
                            </p>
                        </div>
                    </div>

                    <Button size="lg" className="w-full h-14 text-lg font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all" onClick={startTest}>
                        Start Calibration & Test
                    </Button>
                </Card>
            </div>
        );
    }

    if (phase === 'RESULT') {
        const finalLevel = score > 0 ? CONTRAST_LEVELS[score - 1] : null;
        const isGood = score >= 5; // Level 5 (5%) is decent normal functionality

        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 py-12 bg-slate-900 text-slate-50 overflow-y-auto">
                <Card className="max-w-2xl w-full p-8 md:p-12 text-center space-y-8 bg-white text-slate-900 shadow-2xl my-auto">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-slate-900">Contrast Score</h1>
                        <p className="text-slate-500">Your visual contrast sensitivity result</p>
                    </div>

                    <div className="py-8 pb-12">
                        <div className="relative inline-flex items-center justify-center flex-col">
                            <div className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
                                {finalLevel?.label || "N/A"}
                            </div>
                            <div className="mt-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
                                Minimum Contrast Detected
                            </div>
                        </div>
                    </div>

                    <div className={cn(
                        "p-6 rounded-xl text-left border",
                        isGood ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"
                    )}>
                        <h4 className={cn("font-bold mb-2 flex items-center gap-2", isGood ? "text-green-800" : "text-amber-800")}>
                            <Info className="w-5 h-5" />
                            {isGood ? "Good Sensitivity" : "Reduced Sensitivity Detected"}
                        </h4>
                        <p className={cn("text-sm leading-relaxed", isGood ? "text-green-700" : "text-amber-700")}>
                            {isGood
                                ? "You were able to identify very faint letters. This indicates healthy contrast sensitivity function."
                                : "You had difficulty distinguishing low-contrast letters. This can be an early sign of conditions like cataracts or glaucoma, or simply a dirty screen/low brightness."}
                        </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button variant="outline" size="lg" className="flex-1 h-12" onClick={() => router.push('/results')}>
                            View Report
                        </Button>
                        <Button size="lg" className="flex-1 h-12 bg-purple-600 text-white hover:bg-purple-700" onClick={startTest}>
                            <RefreshCw className="mr-2 h-4 w-4" /> Retest
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // --- TEST PHASE UI ---
    const currentSettings = CONTRAST_LEVELS[currentLevelIndex];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <PremiumGate />
            {/* Header / Progress */}
            <div className="bg-white px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-20">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contrast Level</span>
                    <span className="font-bold text-slate-900">{currentLevelIndex + 1} / {CONTRAST_LEVELS.length}</span>
                </div>
                <div className="w-32 md:w-48">
                    <Progress value={(currentLevelIndex / CONTRAST_LEVELS.length) * 100} className="h-2" />
                </div>
                <Button variant="ghost" size="sm" onClick={() => router.push('/')}>Exit</Button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 w-full max-w-2xl mx-auto space-y-12">

                {/* STIMULUS */}
                <div className="flex items-center justify-center w-64 h-64 bg-white rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
                    {/* The Letter */}
                    <span
                        className="font-sans font-bold text-9xl select-none"
                        style={{
                            // Using rgba to control contrast against white background
                            color: `rgba(0, 0, 0, ${currentSettings.opacity})`
                        }}
                    >
                        {targetLetter}
                    </span>

                    {/* Noise texture overlay (optional, adds realism/difficulty) */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
                </div>

                {/* CONTROLS */}
                <div className="w-full space-y-6">
                    <h2 className="text-center text-slate-500 font-medium">Which letter do you see?</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {choices.map((letter, i) => (
                            <Button
                                key={i}
                                variant="outline"
                                className="h-16 text-2xl font-bold border-2 text-slate-900 bg-white hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-all rounded-2xl"
                                onClick={() => handleAnswer(letter)}
                            >
                                {letter}
                            </Button>
                        ))}
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        onClick={() => handleAnswer("SKIP")}
                    >
                        I can&apos;t see any letter
                    </Button>
                </div>

                {/* Level Progress Indicator */}
                <div className="text-sm text-slate-400 font-medium">
                    Level Progress: {correctInLevel} Correct / {trialsInLevel} Attempts
                    <span className="block text-xs text-slate-300 mt-1">Need 2 correct to pass</span>
                </div>
                {/* Voice Status */}
                <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-400">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMicEnabled(!isMicEnabled)}
                        className={cn("gap-2 px-3", isMicEnabled ? "text-purple-400 bg-purple-400/10 hover:bg-purple-400/20" : "text-slate-500")}
                    >
                        {isMicEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                        {isMicEnabled ? "Mic On" : "Mic Off"}
                    </Button>

                    {isMicEnabled && (
                        <>
                            <div className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`}></div>
                            <span>{transcript ? `Heard: "${transcript}"` : "Say letter or 'Skip'"}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
