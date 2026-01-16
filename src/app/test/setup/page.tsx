"use client";


import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Ruler, Monitor, User } from 'lucide-react';
import { useVision } from '@/lib/store/vision-context';

export default function TestSetupPage() {
    const router = useRouter();
    const { calibrationPxMm } = useVision();

    if (!calibrationPxMm) {
        // If refreshed, redirect to calibration
        // In dev we might want to skip this check or provide a default
        // router.push('/calibration'); 
        // But keeping it strict for now.
    }

    const handleStart = () => {
        router.push('/test/run');
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
            <div className="max-w-xl w-full text-center space-y-8">
                <h1 className="text-3xl font-bold text-slate-900">Viewing Distance</h1>

                <Card>
                    <CardContent className="pt-6 space-y-8">
                        <div className="flex items-center justify-center gap-4 text-slate-400">
                            <User className="h-12 w-12" />
                            <div className="h-px bg-slate-200 flex-1 relative">
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-mono font-medium text-slate-500">
                                    40 cm (16 in)
                                </span>
                                <Ruler className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-white" />
                            </div>
                            <Monitor className="h-12 w-12" />
                        </div>

                        <div className="space-y-4 text-left">
                            <div className="flex gap-3">
                                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                                <p className="text-slate-600">Position yourself approximately <strong className="text-slate-900">40 cm (16 inches)</strong> from the screen. This is roughly typical arm&apos;s length.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                                <p className="text-slate-600">Ensure the screen brightness is comfortable and incorrect glare is minimized.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                                <p className="text-slate-600">We will test one eye at a time. Be ready to cover your eye with your hand.</p>
                            </div>
                        </div>

                        <Button size="lg" className="w-full" onClick={handleStart}>
                            I&apos;m at 40cm — Start Test
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
