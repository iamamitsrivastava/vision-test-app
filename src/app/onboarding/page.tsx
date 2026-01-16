"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Glasses } from 'lucide-react';

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        hasGlasses: '',
        lastExam: ''
    });

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Save profile (mock for now, or save to context)
            // For MVP V2, assume context save or skipped API
            router.push('/calibration');
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle>Create Your Vision Profile</CardTitle>
                    <div className="flex gap-2 mt-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-slate-200'}`} />
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">How old are you?</label>
                                <input
                                    type="number"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="Age"
                                    value={formData.age}
                                    onChange={(e) => handleChange('age', e.target.value)}
                                />
                                <p className="text-xs text-slate-500">Helps us adjust for presbyopia (age-related reading blur).</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Gender</label>
                                <div className="flex gap-4">
                                    <Button
                                        variant={formData.gender === 'male' ? 'default' : 'outline'}
                                        className="flex-1"
                                        onClick={() => handleChange('gender', 'male')}
                                    > Male </Button>
                                    <Button
                                        variant={formData.gender === 'female' ? 'default' : 'outline'}
                                        className="flex-1"
                                        onClick={() => handleChange('gender', 'female')}
                                    > Female </Button>
                                    <Button
                                        variant={formData.gender === 'other' ? 'default' : 'outline'}
                                        className="flex-1"
                                        onClick={() => handleChange('gender', 'other')}
                                    > Other </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Do you wear glasses or contacts?</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        variant={formData.hasGlasses === 'yes' ? 'default' : 'outline'}
                                        className="h-24 flex flex-col gap-2"
                                        onClick={() => handleChange('hasGlasses', 'yes')}
                                    >
                                        <Glasses className="h-6 w-6" />
                                        Yes
                                    </Button>
                                    <Button
                                        variant={formData.hasGlasses === 'no' ? 'default' : 'outline'}
                                        className="h-24 flex flex-col gap-2"
                                        onClick={() => handleChange('hasGlasses', 'no')}
                                    >
                                        <User className="h-6 w-6" />
                                        No
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">When was your last professional eye exam?</label>
                                <div className="space-y-2">
                                    {['Less than a year ago', '1-2 years ago', 'More than 2 years ago', 'Never'].map(opt => (
                                        <div
                                            key={opt}
                                            className={`p-3 rounded-lg border cursor-pointer hover:bg-slate-50 transition-colors ${formData.lastExam === opt ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-slate-200'}`}
                                            onClick={() => handleChange('lastExam', opt)}
                                        >
                                            <span className="text-sm font-medium">{opt}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4">
                        {step > 1 && (
                            <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>
                        )}
                        <Button onClick={handleNext}>
                            {step === 3 ? 'Complete Profile' : 'Next'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
