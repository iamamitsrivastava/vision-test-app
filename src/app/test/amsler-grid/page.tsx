"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePremiumAccess } from '@/hooks/use-premium-access';
import { Grid, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AmslerGridPage() {
    const router = useRouter();
    const { isPremium, isLoading, PremiumGate } = usePremiumAccess();
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [result, setResult] = useState<'normal' | 'issue' | null>(null);

    const handleAnswer = (issue: boolean) => {
        setResult(issue ? 'issue' : 'normal');
        setFinished(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isPremium) {
        return <PremiumGate />;
    }

    if (finished) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <PremiumGate />
                <Card className="max-w-xl w-full p-8 text-center space-y-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${result === 'normal' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        {result === 'normal' ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Result: {result === 'normal' ? 'Normal' : 'Potential Issue'}</h1>
                    <p className="text-slate-600 text-lg">
                        {result === 'normal'
                            ? "You reported no distortion or missing areas in your central vision."
                            : "You reported distortion or missing areas. This can be a sign of macular degeneration. Please consult an eye specialist immediately."}
                    </p>
                    <div className="flex gap-4 pt-4">
                        <Button variant="outline" className="flex-1" onClick={() => router.push('/')}>Home</Button>
                        <Button className="flex-1" onClick={() => setFinished(false)}>Retest</Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (!started) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <PremiumGate />
                <Card className="max-w-xl w-full p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600">
                        <Grid className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Amsler Grid Test</h1>
                    <p className="text-slate-600 text-lg">
                        This test evaluates your central vision and can detect early signs of Macular Degeneration.
                    </p>
                    <div className="text-left bg-blue-50 p-4 rounded-xl text-sm text-blue-800 space-y-2">
                        <p><strong>Instructions:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Wear your reading glasses if you use them.</li>
                            <li>Hold screen ~12-15 inches away.</li>
                            <li>Cover one eye.</li>
                            <li>Focus on the center black dot.</li>
                        </ul>
                    </div>
                    <Button size="lg" className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700" onClick={() => setStarted(true)}>
                        Start Test
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <PremiumGate />
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Focus on the Center Dot</h2>
                <p className="text-slate-500">While looking at the dot, answer the questions below.</p>
            </div>

            {/* THE GRID */}
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-white border-2 border-slate-900 grid grid-cols-10 grid-rows-10 shadow-2xl mb-8">
                {/* Center Dot */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-3 h-3 bg-black rounded-full z-10" />
                </div>
                {/* Horizontal Lines */}
                {Array.from({ length: 9 }).map((_, i) => (
                    <div key={`h-${i}`} className="absolute w-full h-px bg-slate-900/20 top-0" style={{ top: `${(i + 1) * 10}%` }} />
                ))}
                {/* Vertical Lines */}
                {Array.from({ length: 9 }).map((_, i) => (
                    <div key={`v-${i}`} className="absolute h-full w-px bg-slate-900/20 left-0" style={{ left: `${(i + 1) * 10}%` }} />
                ))}
            </div>

            <div className="space-y-4 max-w-md w-full">
                <p className="font-bold text-lg text-center">Do any lines look wavy, blurred, or missing?</p>
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="destructive" size="lg" className="h-16 text-lg" onClick={() => handleAnswer(true)}>
                        Yes, Distorted
                    </Button>
                    <Button variant="default" size="lg" className="h-16 text-lg bg-green-600 hover:bg-green-700" onClick={() => handleAnswer(false)}>
                        No, All Straight
                    </Button>
                </div>
            </div>
        </div>
    );
}
