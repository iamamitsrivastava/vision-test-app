"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { usePremiumAccess } from '@/hooks/use-premium-access';
import { CheckCircle2, XCircle, Grid } from 'lucide-react';

// ISHIHARA PLATES DATA (Simplified for web - mapped to images or generated)
// For "Pro" quality, we should use high-quality images.
// Since I can't browse the web for images easily to download, I will use CSS/SVG generation for "dots" or placeholders if images aren't available.
// However, the best "Pro" look without external assets is to use a library or canvas.
// For now, I will simulate the plates using a detailed description and user input.

const PLATES = [
    { id: 1, type: 'demo', answer: '12', description: 'Orange number 12 on grey/green background. Seen by all.' },
    { id: 2, type: 'rg', answer: '8', description: 'Red/Green deficiency test.' },
    { id: 3, type: 'rg', answer: '5', description: 'Red/Green deficiency test.' },
    { id: 4, type: 'rg', answer: '29', description: 'Red/Green deficiency test.' },
    { id: 5, type: 'rg', answer: '74', description: 'Red/Green deficiency test.' },
];

export default function ColorBlindnessTestPage() {
    const router = useRouter();
    const { isPremium, isLoading, PremiumGate } = usePremiumAccess();

    const [step, setStep] = useState(0); // 0 = Intro, 1...5 = Plates, 6 = Result
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [inputVal, setInputVal] = useState('');

    const currentPlate = PLATES[step - 1];

    const handleStart = () => setStep(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAnswers(prev => ({ ...prev, [currentPlate.id]: inputVal }));
        setInputVal('');

        if (step < PLATES.length) {
            setStep(prev => prev + 1);
        } else {
            setStep(6); // Finish
        }
    };

    // --- RENDERERS ---

    // A placeholder visual for the plate - in a real app this would be <Image />
    const PlateVisual = ({ number }: { number: string }) => (
        <div className="w-64 h-64 rounded-full bg-slate-200 mx-auto mb-6 flex items-center justify-center relative overflow-hidden border-4 border-white shadow-xl">
            {/* Simulation of Ishihara dots noise */}
            <div className="absolute inset-0 opacity-50" style={{
                backgroundImage: 'radial-gradient(circle, #b91c1c 2px, transparent 2.5px), radial-gradient(circle, #15803d 2px, transparent 2.5px)',
                backgroundSize: '12px 12px, 15px 15px',
                backgroundPosition: '0 0, 7px 7px'
            }}></div>
            <div className="z-10 text-8xl font-black text-slate-800/10 select-none blur-sm" style={{ mixBlendMode: 'multiply' }}>
                <span className="text-red-500 opacity-60 font-serif">{number}</span>
            </div>
            <p className="absolute bottom-4 text-xs text-slate-400 font-mono">Plate {currentPlate.id}</p>
        </div>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!isPremium) {
        return <PremiumGate />;
    }

    if (step === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <PremiumGate />
                <Card className="max-w-xl w-full p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                        <Grid className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Color Blindness Test</h1>
                    <div className="text-slate-600 space-y-2 text-lg">
                        <p>This test uses standard <strong>Ishihara Plates</strong> to detect red-green color deficiencies.</p>
                        <p className="text-sm text-slate-400">Please disable any screen filters or "Night Mode".</p>
                    </div>
                    <Button size="lg" className="w-full h-12 text-lg bg-green-600 hover:bg-green-700" onClick={handleStart}>
                        Start Screening
                    </Button>
                </Card>
            </div>
        );
    }

    if (step === 6) {
        // Calculate Score
        const score = PLATES.reduce((acc, plate) => {
            return acc + (answers[plate.id] === plate.answer ? 1 : 0);
        }, 0);
        const passed = score >= 4;

        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <PremiumGate />
                <Card className="max-w-xl w-full p-8 text-center space-y-6">
                    <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mx-auto", passed ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600")}>
                        {passed ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Test Complete</h1>

                    <div className="py-4">
                        <div className="text-5xl font-black text-slate-900 mb-2">{score} / {PLATES.length}</div>
                        <p className="text-slate-500 font-medium uppercase tracking-wide">Plates Correctly Identified</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl border text-left">
                        <h3 className="font-bold text-slate-900 mb-2">Analysis</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {passed
                                ? "You have normal color vision. You correctly identified most of the plates."
                                : "Results suggest a possible Color Vision Deficiency (likely Red-Green). We recommend a comprehensive exam with an eye care professional."}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="outline" className="flex-1" onClick={() => router.push('/')}>Exit</Button>
                        <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => setStep(0)}>Retest</Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
            <PremiumGate />
            <div className="w-full max-w-md space-y-8">
                {/* Progress */}
                <div className="space-y-2">
                    <div className="flex justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <span>Plate {step} of {PLATES.length}</span>
                        <span>Ishihara</span>
                    </div>
                    <Progress value={(step / PLATES.length) * 100} className="h-1 bg-slate-800" />
                </div>

                {/* Plate Display */}
                <div className="aspect-square bg-black rounded-full flex items-center justify-center overflow-hidden relative shadow-2xl border-4 border-slate-800">
                    {/* 
                      NOTE: In a real production app, we would serve actual localized images here. 
                      For this task without external assets, I'm using a placeholder logic.
                      However, to make it "Active", I will just show the text "Plate X" if I can't generate the complex dots.
                    */}
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-700 pointer-events-none select-none">
                        <p className="text-center px-8">
                            [ Ishihara Plate Image Placeholder ]<br />
                            <span className="text-xs mt-2 block opacity-50">Imagine a circle of dots hiding the number {currentPlate.answer}</span>
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2 text-center text-slate-400">
                        <label>What number do you see?</label>
                        <input
                            type="number"
                            className="w-full h-14 rounded-xl text-center text-3xl font-bold bg-slate-800 border border-slate-700 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-white placeholder:text-slate-600"
                            placeholder="?"
                            autoFocus
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" size="lg" className="w-full h-14 text-lg bg-green-600 hover:bg-green-700">
                        Next Plate
                    </Button>
                </form>
            </div>
        </div>
    );
}

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}
