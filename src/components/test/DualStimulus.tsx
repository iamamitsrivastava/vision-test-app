"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Stimulus } from './Stimulus'; // Assuming existing component
import { cn } from '@/lib/utils';

interface DualStimulusProps {
    option1: { logMAR: number; blur: number; label: string };
    option2: { logMAR: number; blur: number; label: string };
    onSelection: (selected: 1 | 2) => void;
}

export function DualStimulus({ option1, option2, onSelection }: DualStimulusProps) {
    const [selected, setSelected] = useState<1 | 2 | null>(null);

    const [prevOptions, setPrevOptions] = useState({ opt1: option1, opt2: option2 });

    if (option1 !== prevOptions.opt1 || option2 !== prevOptions.opt2) {
        setPrevOptions({ opt1: option1, opt2: option2 });
        setSelected(null);
    }

    const handleSelect = (choice: 1 | 2) => {
        setSelected(choice);
        // Small delay for animation?
        setTimeout(() => onSelection(choice), 200);
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-4xl">
            {/* Option 1 */}
            <div
                className={cn(
                    "relative flex-1 bg-white rounded-2xl shadow-sm border-2 p-8 flex flex-col items-center cursor-pointer transition-all hover:shadow-md",
                    selected === 1 ? "border-blue-600 ring-2 ring-blue-200" : "border-slate-100"
                )}
                onClick={() => handleSelect(1)}
            >
                <div className="absolute top-4 left-4 bg-slate-100 text-slate-500 font-bold text-xs px-2 py-1 rounded">
                    OPTION 1
                </div>

                <div className="h-48 w-full flex items-center justify-center">
                    <Stimulus logMAR={option1.logMAR} type="E" orientation={0} />
                </div>

                <Button variant={selected === 1 ? "default" : "outline"} className="mt-4 w-full">
                    Select Option 1
                </Button>
            </div>

            {/* VS Badge */}
            <div className="text-slate-300 font-black text-xl italic">VS</div>

            {/* Option 2 */}
            <div
                className={cn(
                    "relative flex-1 bg-white rounded-2xl shadow-sm border-2 p-8 flex flex-col items-center cursor-pointer transition-all hover:shadow-md",
                    selected === 2 ? "border-blue-600 ring-2 ring-blue-200" : "border-slate-100"
                )}
                onClick={() => handleSelect(2)}
            >
                <div className="absolute top-4 left-4 bg-slate-100 text-slate-500 font-bold text-xs px-2 py-1 rounded">
                    OPTION 2
                </div>

                <div className="h-48 w-full flex items-center justify-center">
                    <Stimulus logMAR={option2.logMAR} type="E" orientation={0} />
                </div>

                <Button variant={selected === 2 ? "default" : "outline"} className="mt-4 w-full">
                    Select Option 2
                </Button>
            </div>
        </div>
    );
}
