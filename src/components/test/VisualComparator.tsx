"use client";

import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Minus } from 'lucide-react';

interface VisualComparatorProps {
    referenceBlur: number;
    referenceScale: number;
    testBlur: number;
    testScale: number;
    content: string; // The letter to show
    onSelection: (choice: 'REF' | 'TEST' | 'SAME') => void;
}

export function VisualComparator({
    referenceBlur,
    referenceScale,
    testBlur,
    testScale,
    content,
    onSelection
}: VisualComparatorProps) {

    // Add keydown listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') onSelection('REF');
            if (e.key === 'ArrowRight') onSelection('TEST');
            if (e.key === 'ArrowDown') onSelection('SAME');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onSelection]);

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">

            {/* Split Screen View */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-stretch justify-center h-[50vh] min-h-[400px]">

                {/* Left Panel: Reference */}
                <div
                    className="flex-1 relative group cursor-pointer"
                    onClick={() => onSelection('REF')}
                >
                    <div className="absolute top-4 left-4 z-10 bg-slate-900/10 text-slate-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-white/20">
                        Lens 1 (Left)
                    </div>

                    <Card className="h-full w-full flex items-center justify-center bg-white border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden">
                        <div
                            className="font-mono text-9xl md:text-[12rem] text-slate-900 transition-all duration-300 ease-out"
                            style={{
                                filter: `blur(${referenceBlur}px)`,
                                transform: `scale(${referenceScale})`
                            }}
                        >
                            {content}
                        </div>
                    </Card>

                    {/* Mobile Tap Indicator */}
                    <div className="absolute bottom-4 left-0 w-full text-center text-slate-400 text-sm md:hidden">
                        Tap if clearer
                    </div>
                </div>

                {/* Divider (Visual only) */}
                <div className="hidden md:flex flex-col items-center justify-center gap-2 text-slate-300">
                    <div className="w-px h-1/3 bg-slate-200"></div>
                    <span className="text-xs font-medium text-slate-400">VS</span>
                    <div className="w-px h-1/3 bg-slate-200"></div>
                </div>

                {/* Right Panel: Test */}
                <div
                    className="flex-1 relative group cursor-pointer"
                    onClick={() => onSelection('TEST')}
                >
                    <div className="absolute top-4 right-4 z-10 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-blue-200">
                        Lens 2 (Right)
                    </div>

                    <Card className="h-full w-full flex items-center justify-center bg-white border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden">
                        <div
                            className="font-mono text-9xl md:text-[12rem] text-slate-900 transition-all duration-300 ease-out"
                            style={{
                                filter: `blur(${testBlur}px)`,
                                transform: `scale(${testScale})`
                            }}
                        >
                            {content}
                        </div>
                    </Card>

                    <div className="absolute bottom-4 left-0 w-full text-center text-slate-400 text-sm md:hidden">
                        Tap if clearer
                    </div>
                </div>
            </div>

            {/* Controls / Question */}
            <div className="flex flex-col items-center gap-6">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center">
                    Which lens looks clearer?
                </h2>

                <div className="flex flex-wrap justify-center gap-4 w-full max-w-lg">
                    <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 h-16 text-lg hover:bg-slate-50 hover:border-slate-300"
                        onClick={() => onSelection('REF')}
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Lens 1
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 h-16 text-lg hover:bg-slate-50 hover:border-slate-300"
                        onClick={() => onSelection('SAME')}
                    >
                        <Minus className="mr-2 h-5 w-5" />
                        About Same
                    </Button>

                    <Button
                        variant="default" // Primary action usually implies "Change" or "Next", but here both are equal choices. Let's make Right visually distinct? No, neutral.
                        size="lg"
                        className="flex-1 h-16 text-lg bg-blue-600 hover:bg-blue-700"
                        onClick={() => onSelection('TEST')}
                    >
                        Lens 2
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>

                <div className="text-slate-400 text-sm">
                    Use <span className="font-bold border px-1 rounded bg-white">←</span> <span className="font-bold border px-1 rounded bg-white">↓</span> <span className="font-bold border px-1 rounded bg-white">→</span> keys
                </div>
            </div>
        </div>
    );
}
