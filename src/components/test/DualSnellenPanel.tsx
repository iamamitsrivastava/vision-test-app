"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, Check, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SnellenLine, getLetterSizePixels } from '@/lib/algorithms/snellen-engine';

interface DualSnellenPanelProps {
    blurLeft: number; // usually 0
    blurRight: number; // variable
    snellenLine: SnellenLine;
    letters: string;
    mode: 'READING' | 'COMPARING';
    onReadSubmit?: (input: string) => void;
    onCompare?: (choice: 'LEFT' | 'RIGHT' | 'SAME') => void;
}

export function DualSnellenPanel({
    blurLeft,
    blurRight,
    snellenLine,
    letters,
    mode,
    onReadSubmit,
    onCompare
}: DualSnellenPanelProps) {
    const [inputVal, setInputVal] = useState("");
    const [refRevealed, setRefRevealed] = useState(false);

    const [prevLetters, setPrevLetters] = useState(letters);

    if (letters !== prevLetters) {
        setPrevLetters(letters);
        setInputVal("");
    }

    const handleInputSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (onReadSubmit) onReadSubmit(inputVal);
    };

    // Format letters with spaces for display
    const displayLetters = letters.split('').join(' ');

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">

            {/* Split Screen View */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-stretch justify-center h-[50vh] min-h-[400px]">

                {/* Left Panel: Reference */}
                <div
                    className="flex-1 relative group cursor-pointer"
                    onMouseDown={() => mode === 'COMPARING' && setRefRevealed(true)}
                    onMouseUp={() => setRefRevealed(false)}
                    onMouseLeave={() => setRefRevealed(false)}
                    onTouchStart={() => mode === 'COMPARING' && setRefRevealed(true)}
                    onTouchEnd={() => setRefRevealed(false)}
                >
                    <div className="absolute top-4 left-4 z-10 bg-slate-900/5 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-900/10">
                        Reference
                    </div>

                    <Card className={cn(
                        "h-full w-full flex items-center justify-center border-2 overflow-hidden select-none relative transition-all duration-200",
                        refRevealed ? "border-slate-800 bg-white shadow-xl" : "bg-white border-slate-200"
                    )}>
                        {mode === 'COMPARING' && !refRevealed ? (
                            <div className="absolute inset-0 z-20 flex items-center justify-center flex-col gap-3">
                                {/* Blurred Backdrop */}
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px]"></div>

                                {/* Pill Button Interaction Hint */}
                                <div className="relative z-30 bg-white border border-slate-200 shadow-lg px-6 py-3 rounded-full flex items-center gap-3">
                                    <Eye className="h-5 w-5 text-slate-900" />
                                    <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Hold to Reveal</span>
                                </div>
                            </div>
                        ) : null}

                        <div
                            className="font-mono font-bold text-slate-900 text-center leading-none"
                            style={{
                                filter: `blur(${blurLeft}px)`,
                                fontSize: `${getLetterSizePixels(snellenLine.metric)}px`,
                                letterSpacing: '0.5em'
                            }}
                        >
                            {displayLetters}
                        </div>
                    </Card>
                </div>

                {/* Divider */}
                <div className="hidden md:flex flex-col items-center justify-center gap-2 text-slate-200">
                    <div className="w-px h-24 bg-slate-200"></div>
                </div>

                {/* Right Panel: Test */}
                <div className="flex-1 relative group">
                    <div className="absolute top-4 right-4 z-10 bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                        Test Lens
                    </div>

                    <Card className="h-full w-full flex items-center justify-center bg-white border-2 border-slate-200 overflow-hidden select-none relative">
                        <div
                            className="font-mono font-bold text-slate-900 text-center leading-none transition-all duration-200"
                            style={{
                                filter: `blur(${blurRight}px)`,
                                fontSize: `${getLetterSizePixels(snellenLine.metric)}px`,
                                letterSpacing: '0.5em'
                            }}
                        >
                            {displayLetters}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Controls Area */}
            <div className="flex flex-col items-center gap-6 animate-in slide-in-from-bottom-4">
                {mode === 'READING' && (
                    <form onSubmit={handleInputSubmit} className="w-full max-w-md space-y-4 text-center">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                            Read the line
                        </h2>
                        <div className="flex gap-2">
                            <Input
                                autoFocus
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value.toUpperCase())}
                                placeholder="Type letters..."
                                className="text-center text-xl tracking-[0.5em] font-mono h-12 uppercase border-slate-300 focus:border-slate-900"
                                maxLength={letters.length}
                            />
                            <Button type="submit" size="lg" className="h-12 w-16 bg-slate-900 hover:bg-slate-800 text-white border-0">
                                <Check className="h-5 w-5" />
                            </Button>
                        </div>
                    </form>
                )}

                {mode === 'COMPARING' && (
                    <div className="w-full max-w-xl space-y-6 text-center">
                        <h2 className="text-xl font-medium text-slate-500 uppercase tracking-widest">
                            Which is clearer?
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                            <Button
                                variant="outline"
                                className="h-16 text-lg border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-50 text-slate-900 transition-all font-medium"
                                onClick={() => onCompare?.('LEFT')}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Left
                            </Button>

                            <Button
                                variant="outline"
                                className="h-16 text-sm border border-slate-100 text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-white transition-all"
                                onClick={() => onCompare?.('SAME')}
                            >
                                Same
                            </Button>

                            <Button
                                variant="default"
                                className="h-16 text-lg bg-slate-900 hover:bg-slate-800 text-white transition-all font-medium"
                                onClick={() => onCompare?.('RIGHT')}
                            >
                                Right <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
