"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

import { usePremiumAccess } from '@/hooks/use-premium-access';

export default function GeneralScreeningPage() {
    const router = useRouter();
    const { isPremium, isLoading, PremiumGate } = usePremiumAccess();

    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const questions = [
        {
            id: 'blur',
            text: "Do you experience blurry vision?",
            options: [
                { value: 'no', label: "No, clear vision" },
                { value: 'far', label: "Yes, seeing things far away" },
                { value: 'near', label: "Yes, reading text close up" },
                { value: 'both', label: "Yes, at all distances" }
            ]
        },
        {
            id: 'strain',
            text: "Do you get headaches or eye strain after computer use?",
            options: [
                { value: 'no', label: "Rarely / Never" },
                { value: 'sometimes', label: "After few hours" },
                { value: 'always', label: "Almost immediately" }
            ]
        },
        {
            id: 'night',
            text: "Do you have trouble seeing at night or with oncoming headlights?",
            options: [
                { value: 'no', label: "No issues" },
                { value: 'glare', label: "Yes, lots of glare/halos" },
                { value: 'dim', label: "Yes, everything looks too dark" }
            ]
        }
    ];

    const handleAnswer = (qid: string, val: string) => {
        setAnswers(prev => ({ ...prev, [qid]: val }));
    };

    const nextStep = () => {
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            analyzeAndRedirect();
        }
    };

    const analyzeAndRedirect = () => {
        // Simple logic to recommend tests
        if (answers['blur'] === 'near') {
            router.push('/test/near-vision');
        } else if (answers['blur'] === 'far' || answers['night'] === 'glare') {
            router.push('/test/refraction');
        } else if (answers['night'] !== 'no') {
            router.push('/test/contrast-sensitivity');
        } else {
            router.push('/test/refraction'); // Default
        }
    };

    const currentQ = questions[step];

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

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="max-w-xl w-full shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-blue-600" />
                        General Vision Screening
                    </CardTitle>
                    <CardDescription>
                        Answer a few questions to get a recommended vision test path.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-lg font-medium text-slate-900">
                            {currentQ.text}
                        </Label>
                        <div className="grid gap-3 pt-2">
                            {currentQ.options.map((opt) => (
                                <div
                                    key={opt.value}
                                    onClick={() => handleAnswer(currentQ.id, opt.value)}
                                    className={`
                                        p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-blue-50
                                        ${answers[currentQ.id] === opt.value
                                            ? 'border-blue-600 bg-blue-50 shadow-sm'
                                            : 'border-slate-100 bg-white hover:border-blue-200'}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`
                                            w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center
                                            ${answers[currentQ.id] === opt.value ? 'border-blue-600 bg-blue-600' : ''}
                                        `}>
                                            {answers[currentQ.id] === opt.value && (
                                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                            )}
                                        </div>
                                        <span className="font-medium text-slate-700">{opt.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => setStep(Math.max(0, step - 1))}
                        disabled={step === 0}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={nextStep}
                        disabled={!answers[currentQ.id]}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {step === questions.length - 1 ? 'Get Recommendation' : 'Next Question'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
