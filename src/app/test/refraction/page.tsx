"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVision } from '@/lib/store/vision-context';
import { SNELLEN_LEVELS, generateSnellenLetters, estimateDiopters, getLetterSizePixels } from '@/lib/algorithms/snellen-engine';
import { useVoiceRecognition } from '@/hooks/use-voice-recognition';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X, Eye, ArrowRight, Monitor, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Phase = 'INSTRUCT_LEFT' | 'TEST_LEFT' | 'INTERMISSION' | 'TEST_RIGHT' | 'FINISHED';

export default function UltraSimpleSnellenTest() {
    const router = useRouter();
    const { leftEyeResult, setLeftEyeResult, setRightEyeResult, user } = useVision();

    const [phase, setPhase] = useState<Phase>('INSTRUCT_LEFT');
    const [lineIndex, setLineIndex] = useState(0); // Start at 0 (Largest)
    const [currentChar, setCurrentChar] = useState("E");
    const [failedLine, setFailedLine] = useState(false); // Track if we are re-checking a larger size
    const [isMicEnabled, setIsMicEnabled] = useState(true);

    // Generate new char whenever level changes or test restarts
    // Derived state for char (randomize on render if index changed - wait, that's unstable)
    // Actually, we should update char when lineIndex changes.
    // We can't easily sync state in render without effect if it's random.
    // Better pattern: Update char in the handlers that change lineIndex/phase.

    // Handlers
    const handleCanSee = () => {
        if (failedLine) {
            finishEye(lineIndex);
            setFailedLine(false);
        } else {
            if (lineIndex < SNELLEN_LEVELS.length - 1) {
                setLineIndex(prev => prev + 1);
                setCurrentChar(generateSnellenLetters(1));
            } else {
                finishEye(lineIndex);
            }
        }
    };

    const handleCannotSee = () => {
        if (lineIndex === 0) {
            finishEye(-1);
        } else {
            setLineIndex(prev => prev - 1);
            setFailedLine(true);
            setCurrentChar(generateSnellenLetters(1));
        }
    };

    const finishEye = async (finalIndex: number) => {
        const resultLevel = finalIndex === -1 ? SNELLEN_LEVELS[0] : SNELLEN_LEVELS[finalIndex];
        const diopters = finalIndex === -1 ? -4.00 : estimateDiopters(resultLevel.logMAR);

        const resultData = {
            logMAR: resultLevel.logMAR,
            diopters: diopters,
            acuity: resultLevel.acuity,
            metric: resultLevel.metric
        };

        if (phase === 'TEST_LEFT' || phase === 'INSTRUCT_LEFT') {
            setLeftEyeResult(resultData);
            setPhase('INTERMISSION');
        } else {
            setRightEyeResult(resultData);

            // Save to DB if logged in
            if (user && user.id) {
                try {
                    const confidence = "Medium";
                    await fetch('/api/results/save', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: user.id,
                            prediction: {
                                leftEye: leftEyeResult?.diopters?.toString() || "N/A",
                                rightEye: resultData.diopters.toString(),
                                confidence
                            }
                        })
                    });
                } catch (err) {
                    console.error("Failed to save result", err);
                }
            }

            router.push('/results');
        }
    };

    const startLeft = () => {
        setLineIndex(0);
        setFailedLine(false);
        setPhase('TEST_LEFT');
        setCurrentChar(generateSnellenLetters(1));
    };

    const startRight = () => {
        setLineIndex(0);
        setFailedLine(false);
        setPhase('TEST_RIGHT');
        setCurrentChar(generateSnellenLetters(1));
    };

    const currentLevel = SNELLEN_LEVELS[lineIndex];
    const currentSizePx = getLetterSizePixels(currentLevel.metric);

    // Voice Control
    const { isListening, transcript } = useVoiceRecognition({
        enabled: (phase === 'TEST_LEFT' || phase === 'TEST_RIGHT') && isMicEnabled,
        targets: [currentChar],
        onTargetMatch: (match) => {
            handleCanSee();
        },
        onCommand: (cmd) => {
            if (cmd === 'CANT_SEE') {
                handleCannotSee();
            }
        }
    });

    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden font-sans selection:bg-emerald-100">
            <AnimatePresence mode="wait">
                {/* --- PHASE: INSTRUCTIONS LEFT --- */}
                {phase === 'INSTRUCT_LEFT' && (
                    <motion.div
                        key="instruct-left"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="min-h-screen flex flex-col items-center justify-center p-6"
                    >
                        <Card className="max-w-md w-full p-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl">
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 mb-2">
                                    <Eye size={32} />
                                </div>

                                <div className="space-y-2">
                                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Left Eye Check</h1>
                                    <p className="text-slate-500">
                                        Cover your <span className="font-semibold text-slate-900">Right Eye</span> with your hand.
                                    </p>
                                </div>

                                <div className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100/50 text-sm text-slate-600 flex items-start gap-3 text-left">
                                    <Monitor className="shrink-0 w-5 h-5 text-indigo-500 mt-0.5" />
                                    <span>
                                        Ensure your screen is placed about <strong>10 feet (3 meters)</strong> away from you.
                                    </span>
                                </div>

                                <Button
                                    onClick={startLeft}
                                    className="w-full h-14 text-lg font-medium bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.02]"
                                >
                                    Start Test
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* --- PHASE: INTERMISSION --- */}
                {phase === 'INTERMISSION' && (
                    <motion.div
                        key="intermission"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="min-h-screen flex flex-col items-center justify-center p-6"
                    >
                        <Card className="max-w-md w-full p-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl">
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                                    <Check size={32} strokeWidth={3} />
                                </div>

                                <div className="space-y-2">
                                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Left Eye Done</h1>
                                    <p className="text-slate-500">
                                        Great job. Now cover your <span className="font-semibold text-slate-900">Left Eye</span>.
                                    </p>
                                </div>

                                <Button
                                    onClick={startRight}
                                    className="w-full h-14 text-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                                >
                                    Start Right Eye <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* --- PHASE: TESTING --- */}
                {(phase === 'TEST_LEFT' || phase === 'TEST_RIGHT') && (
                    <motion.div
                        key="testing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="min-h-screen flex flex-col"
                    >
                        {/* Header */}
                        <div className="h-16 px-6 flex items-center justify-between bg-white border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <span className={`w-2.5 h-2.5 rounded-full ${failedLine ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
                                <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                                    {phase === 'TEST_LEFT' ? "Left Eye" : "Right Eye"}
                                </span>
                            </div>
                            <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-mono font-medium text-slate-500">
                                {currentLevel.metric}
                            </div>
                        </div>

                        {/* Test Area */}
                        <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-slate-50">
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={`${lineIndex}-${currentChar}`}
                                    initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.4, ease: "backOut" }}
                                    className="font-black text-slate-900 leading-none select-none flex items-center justify-center mix-blend-multiply"
                                    style={{
                                        fontSize: `${currentSizePx}px`,
                                        height: `${currentSizePx}px`,
                                        width: '100%',
                                        maxHeight: '70vh',
                                        maxWidth: '90vw',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {currentChar}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Controls */}
                        <div className="h-auto pb-8 pt-4 px-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-10">
                            <div className="max-w-md mx-auto grid grid-cols-1 gap-3">
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleCanSee}
                                    className="h-16 flex items-center justify-center gap-3 text-lg font-bold bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
                                >
                                    <Check className="w-6 h-6" />
                                    I Can See It
                                </motion.button>

                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCannotSee}
                                    className="h-14 flex items-center justify-center gap-3 text-base font-medium text-slate-500 bg-white border-2 border-slate-100 rounded-2xl hover:border-rose-100 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                    I Can&apos;t See It
                                </motion.button>
                            </div>
                        </div>

                        {/* Voice Status Indicator */}
                        <div className="absolute bottom-28 left-0 right-0 flex justify-center pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-900/80 backdrop-blur-sm text-white pl-1 pr-4 py-1 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg pointer-events-auto"
                            >
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
                                        {transcript ? `Heard: "${transcript}"` : "Say letter or 'Can't See'"}
                                    </>
                                ) : (
                                    <span className="text-slate-400">Mic Off</span>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
