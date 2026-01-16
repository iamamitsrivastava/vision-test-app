"use client";

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { usePremiumAccess } from '@/hooks/use-premium-access';

export default function VisionSimulatorPage() {
    const { PremiumGate } = usePremiumAccess();
    const [blur, setBlur] = useState(0); // 0-10px
    const [astigmatism, setAstigmatism] = useState(0); // 0-10px (directional)
    const [mode, setMode] = useState<'normal' | 'simulated'>('simulated');

    const handleCompare = () => {
        setMode(prev => prev === 'normal' ? 'simulated' : 'normal');
    };

    const handleReset = () => {
        setBlur(0);
        setAstigmatism(0);
        setMode('simulated');
    };

    // Calculate filters
    const blurVal = mode === 'normal' ? 0 : blur;
    const astigVal = mode === 'normal' ? 0 : astigmatism;

    // Astigmatism simulation: distinct horizontal/vertical blur overlap
    // Simple CSS implementation: blur is standard. Astigmatism is harder with just CSS.
    // We can simulate astigmatism by duplicating the image with a slight offset and opacity (ghosting).

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
            <PremiumGate />
            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8 h-[80vh]">

                {/* Controls */}
                <div className="lg:col-span-1 bg-slate-900 p-8 rounded-2xl border border-slate-800 flex flex-col gap-8 shadow-2xl">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Vision Simulator</h1>
                        <p className="text-slate-400 text-sm">Experience the world through someone else's eyes.</p>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <label className="font-bold text-blue-400">Myopia (Nearsighted)</label>
                                <span className="text-slate-500 font-mono">-{blur.toFixed(1)} D</span>
                            </div>
                            <Slider
                                value={[blur]}
                                min={0}
                                max={10}
                                step={0.1}
                                onValueChange={(val) => setBlur(val[0])}
                                className="py-2"
                            />
                            <p className="text-xs text-slate-500">Increases general blurriness of distant objects.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <label className="font-bold text-rose-400">Astigmatism</label>
                                <span className="text-slate-500 font-mono">{astigmatism.toFixed(1)} cyl</span>
                            </div>
                            <Slider
                                value={[astigmatism]}
                                min={0}
                                max={10}
                                step={0.1}
                                onValueChange={(val) => setAstigmatism(val[0])}
                                className="py-2"
                            />
                            <p className="text-xs text-slate-500">Adds directional ghosting and light streaks.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            onClick={handleCompare}
                            size="lg"
                            className={`flex-1 ${mode === 'normal' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {mode === 'normal' ? <><Eye className="mr-2 w-4 h-4" /> 20/20 View</> : <><EyeOff className="mr-2 w-4 h-4" /> Simulated</>}
                        </Button>
                        <Button onClick={handleReset} variant="outline" size="icon">
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Visualizer */}
                <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-2xl bg-black group border border-slate-800">
                    {/* Base Image (Sharp) */}
                    <div className="absolute inset-0 z-10">
                        {/* Using a high quality night city street image for best effect */}
                        <img
                            src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2864&auto=format&fit=crop"
                            alt="City Street"
                            className="w-full h-full object-cover transition-all duration-300 transform"
                            style={{
                                filter: `blur(${blurVal}px)`
                            }}
                        />
                    </div>

                    {/* Astigmatism Layer (Ghosting) - Only visible if astigVal > 0 */}
                    {astigVal > 0 && mode === 'simulated' && (
                        <>
                            {/* Ghost 1 - Horizontal Shift */}
                            <div className="absolute inset-0 z-20 mix-blend-screen opacity-50 pointer-events-none">
                                <img
                                    src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2864&auto=format&fit=crop"
                                    alt="Astigmatism Ghost"
                                    className="w-full h-full object-cover"
                                    style={{
                                        filter: `blur(${blurVal + 2}px)`,
                                        transform: `translate(${astigVal * 2}px, ${astigVal}px)`
                                    }}
                                />
                            </div>
                            {/* Ghost 2 - Vertical Shift */}
                            <div className="absolute inset-0 z-20 mix-blend-screen opacity-30 pointer-events-none">
                                <img
                                    src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2864&auto=format&fit=crop"
                                    alt="Astigmatism Ghost"
                                    className="w-full h-full object-cover"
                                    style={{
                                        filter: `blur(${blurVal + 2}px)`,
                                        transform: `translate(-${astigVal}px, -${astigVal * 2}px)`
                                    }}
                                />
                            </div>
                        </>
                    )}

                    {/* Overlay Label */}
                    <div className="absolute top-6 left-6 z-30 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/10">
                        {mode === 'normal' ? '20/20 Vision (Corrected)' : `Simulated: -${blur.toFixed(1)} / ${astigmatism.toFixed(1)}`}
                    </div>
                </div>
            </div>
        </div>
    );
}
