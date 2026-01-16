"use client";

import React, { useEffect, useState } from 'react';
import { Activity, Brain, Eye } from 'lucide-react';

export function AIAnalysisOverlay({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);

    const steps = [
        "Initializing Retina-Scan™...",
        "Measuring Diopter Variance...",
        "Correlating Snellen Ratio...",
        "Comparing with Clinical Datasets...",
        "Finalizing Vision Health Report..."
    ];

    useEffect(() => {
        // Progress Timer
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 500); // Small delay after 100%
                    return 100;
                }
                // Varying speed for realism
                return prev + Math.random() * 3 + 0.5;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [onComplete]);

    // Derived state for purely visual step indication
    const step =
        progress > 85 ? 4 :
            progress > 60 ? 3 :
                progress > 40 ? 2 :
                    progress > 20 ? 1 : 0;

    return (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center text-white overflow-hidden font-mono">

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>

            {/* Central Scanner */}
            <div className="relative mb-12">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
                <div className="w-64 h-64 border-2 border-slate-800 rounded-full flex items-center justify-center relative bg-slate-900/50 backdrop-blur-sm">
                    {/* Rotating Rings */}
                    <div className="absolute inset-0 border border-blue-500/30 rounded-full border-t-transparent animate-[spin_3s_linear_infinite]"></div>
                    <div className="absolute inset-4 border border-cyan-500/20 rounded-full border-b-transparent animate-[spin_5s_linear_infinite_reverse]"></div>

                    {/* Icon */}
                    <div className="relative z-10 text-blue-400">
                        {progress < 40 && <Eye className="w-16 h-16 animate-pulse" />}
                        {progress >= 40 && progress < 70 && <Brain className="w-16 h-16 animate-pulse" />}
                        {progress >= 70 && <Activity className="w-16 h-16 animate-pulse" />}
                    </div>

                    {/* Scan Line */}
                    <div className="absolute inset-0 w-full h-1 bg-blue-500/50 shadow-[0_0_20px_2px_rgba(59,130,246,0.6)] animate-[scan_2s_ease-in-out_infinite] top-1/2"></div>
                </div>
            </div>

            {/* Text & Progress */}
            <div className="w-full max-w-md px-6 space-y-6 relative z-10">
                <div className="flex justify-between items-end text-sm text-blue-300/80 mb-2 font-bold tracking-wider">
                    <span>PROCESSING_DATA</span>
                    <span>{Math.min(100, Math.floor(progress))}%</span>
                </div>

                {/* Progress Bar Container */}
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-100 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: `${Math.min(100, progress)}%` }}
                    ></div>
                </div>

                {/* Status Text Carousel */}
                <div className="h-8 flex items-center justify-center">
                    <p className="text-lg text-white font-medium animate-in fade-in slide-in-from-bottom-2 duration-300 key={step}">
                        {steps[step]}
                    </p>
                </div>
            </div>

            {/* Footer Tech Decor */}
            <div className="absolute bottom-8 text-xs text-slate-600 font-sans tracking-widest opacity-50">
                AI_ENGINE_V4.2 • NEURAL_NET_ACTIVE
            </div>

        </div>
    );
}
