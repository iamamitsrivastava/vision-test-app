"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Eye, Activity, Moon, Grid, Move, Target, Scan, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { usePremiumAccess } from '@/hooks/use-premium-access';

// --- DATA: TEST CATEGORIES ---
const TEST_CATEGORIES = [
    {
        title: "Distance Vision",
        description: "Snellen / Tumbling E / Landolt C",
        icon: <Eye className="w-5 h-5" />,
        color: "bg-blue-100 text-blue-600",
        isFree: true,
        conditions: [
            "Myopia (Near-sightedness)",
            "Hypermetropia (Far-sightedness)",
            "General blurred vision",
            "Low visual acuity"
        ]
    },
    {
        title: "Near Vision",
        description: "Jaeger Chart",
        icon: <Scan className="w-5 h-5" />,
        color: "bg-amber-100 text-amber-600",
        isFree: true,
        conditions: [
            "Presbyopia (Age-related)",
            "Reading difficulty"
        ]
    },
    {
        title: "Contrast Sensitivity",
        description: "Contrast Sensitivity Test",
        icon: <Moon className="w-5 h-5" />,
        color: "bg-purple-100 text-purple-600",
        isFree: false,
        conditions: [
            "Cataract",
            "Glaucoma",
            "Diabetic Retinopathy",
            "Night vision problems"
        ]
    },
    {
        title: "Astigmatism",
        description: "Clock Dial Test",
        icon: <Activity className="w-5 h-5" />,
        color: "bg-rose-100 text-rose-600",
        isFree: true,
        conditions: [
            "Astigmatism (Cornea curve)",
            "Keratoconus (Advanced)"
        ]
    },
    {
        title: "Color Blindness",
        description: "Ishihara Test",
        icon: <Grid className="w-5 h-5" />,
        color: "bg-green-100 text-green-600",
        isFree: false,
        conditions: [
            "Red-Green Deficiency",
            "Blue-Yellow Deficiency",
            "Total Color Vision Defect"
        ]
    },
    {
        title: "Peripheral Vision",
        description: "Visual Field Test",
        icon: <Move className="w-5 h-5" />,
        color: "bg-indigo-100 text-indigo-600",
        isFree: false,
        conditions: [
            "Glaucoma",
            "Retinal Detachment",
            "Optic Neuritis / Stroke"
        ]
    },
    {
        title: "Amsler Grid",
        description: "Amsler Grid Test",
        icon: <Grid className="w-5 h-5" />,
        color: "bg-cyan-100 text-cyan-600",
        isFree: false,
        conditions: [
            "Macular Degeneration",
            "Diabetic Macular Edema",
            "Central vision distortion"
        ]
    },
    {
        title: "Depth Perception",
        description: "Stereopsis Test",
        icon: <Target className="w-5 h-5" />,
        color: "bg-orange-100 text-orange-600",
        isFree: false,
        conditions: [
            "Amblyopia (Lazy Eye)",
            "Strabismus (Crossed eye)",
            "Binocular vision problems"
        ]
    },
    {
        title: "General Screening",
        description: "Digital Eye Strain Test",
        icon: <Activity className="w-5 h-5" />,
        color: "bg-teal-100 text-teal-600",
        isFree: false,
        conditions: [
            "Eye fatigue",
            "Digital eye strain",
            "Early refractive errors"
        ]
    },
    {
        title: "Vision Simulator",
        description: "Visualize refractive errors",
        icon: <Wand2 className="w-5 h-5" />,
        color: "bg-pink-100 text-pink-600",
        isFree: true,
        conditions: [
            "Experience Myopia",
            "Experience Astigmatism",
            "Empathy Tool"
        ]
    }
];

interface TestCatalogModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TestCatalogModal({ isOpen, onClose }: TestCatalogModalProps) {
    const router = useRouter();
    const { isPremium, unlockPremium } = usePremiumAccess();
    const [showDirectPayment, setShowDirectPayment] = useState(false);

    if (!isOpen) return null;

    const handleTestSelect = (test: typeof TEST_CATEGORIES[0]) => {
        // Direct navigation - Premium checks are handled on the specific test pages
        const title = test.title;
        if (title === "Distance Vision") {
            router.push('/test/calibration');
        } else if (title === "Near Vision") {
            router.push('/test/near-vision');
        } else if (title === "Astigmatism") {
            router.push('/test/astigmatism');
        } else if (title === "Contrast Sensitivity") {
            router.push('/test/contrast-sensitivity');
        } else if (title === "Color Blindness") {
            router.push('/test/color-blindness');
        } else if (title === "Amsler Grid") {
            router.push('/test/amsler-grid');
        } else if (title === "Vision Simulator") {
            router.push('/tools/simulator');
        } else if (title === "General Screening") {
            router.push('/test/general-screening');
        } else if (title === "Peripheral Vision") {
            router.push('/test/peripheral-vision');
        } else if (title === "Depth Perception") {
            router.push('/test/depth-perception');
        } else {
            alert(`The ${title} is coming soon!`);
        }
    };

    const handleBadgeClick = (e: React.MouseEvent, isFree: boolean) => {
        if (isFree) return;
        e.stopPropagation();
        if (!isPremium) {
            setShowDirectPayment(true);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div
                className="bg-slate-50 w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 md:p-8 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Select a Specific Test</h2>
                        <p className="text-slate-500 mt-1">Choose a targeted screening based on your symptoms or needs.</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-10 w-10 rounded-full hover:bg-slate-100"
                    >
                        <X className="h-6 w-6 text-slate-500" />
                    </Button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {TEST_CATEGORIES.map((test, idx) => (
                            <Card
                                key={idx}
                                className={cn(
                                    "group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer bg-white border-slate-200",
                                    !test.isFree ? "opacity-90 hover:opacity-100" : "hover:border-blue-200"
                                )}
                                onClick={() => handleTestSelect(test)}
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={cn("p-3 rounded-2xl transition-colors", test.color)}>
                                            {test.icon}
                                        </div>
                                        <div
                                            onClick={(e) => handleBadgeClick(e, test.isFree)}
                                            className={cn("px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-transform active:scale-95",
                                                test.isFree ? "bg-green-100 text-green-700 border border-green-200" : "bg-slate-50 text-slate-500 border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-200 hover:text-slate-700")}
                                        >
                                            {test.isFree ? "Free" : (isPremium ? "Unlocked" : "Paid")}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                                        {test.title}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-500 mb-4">
                                        {test.description}
                                    </p>

                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            Screens for:
                                        </p>
                                        <ul className="space-y-1">
                                            {test.conditions.map((cond, i) => (
                                                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                                    {cond}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Hover Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </Card>
                        ))}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 text-center text-blue-800 text-sm">
                        <span className="font-bold">Note:</span> These online screenings are for informational purposes only and do not replace a comprehensive medical eye exam by a professional.
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={showDirectPayment}
                onSuccess={() => {
                    unlockPremium();
                    setShowDirectPayment(false);
                }}
            />
        </div>
    );
}
