"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils'; // Ensure utils exists

interface AstigmatismDialProps {
    onSelectAxis: (angle: number) => void;
    className?: string;
}

export function AstigmatismDial({ onSelectAxis, className }: AstigmatismDialProps) {
    const [hoveredAngle, setHoveredAngle] = useState<number | null>(null);

    // Generate lines every 10 degrees (1 to 18)
    const lines = Array.from({ length: 18 }, (_, i) => i * 10); // 0, 10, ... 170

    return (
        <div className={cn("relative w-80 h-80 flex items-center justify-center", className)}>
            {/* Center Hub */}
            <div className="absolute w-4 h-4 bg-black rounded-full z-10" />

            {lines.map((angle) => {
                const isHovered = hoveredAngle === angle;
                return (
                    <div
                        key={angle}
                        className="absolute w-full h-full flex items-center justify-center cursor-pointer group"
                        style={{ transform: `rotate(${angle}deg)` }}
                        onMouseEnter={() => setHoveredAngle(angle)}
                        onMouseLeave={() => setHoveredAngle(null)}
                        onClick={() => onSelectAxis(angle)}
                    >
                        {/* The Line Segment */}
                        <div
                            className={cn(
                                "w-[45%] h-1 bg-black transition-all duration-200",
                                isHovered ? "h-2 bg-blue-600 shadow-lg" : "bg-slate-800"
                            )}
                        />

                        {/* Label (Optional, maybe on hover) */}
                        {isHovered && (
                            <div
                                className="absolute left-[85%] text-xs font-bold text-blue-600 bg-white px-1 rounded shadow transform -rotate-90"
                                style={{ transform: `rotate(-${angle}deg)` }}
                            >
                                {angle}°
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
