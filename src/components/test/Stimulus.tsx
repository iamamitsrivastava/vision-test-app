"use client";

import React from 'react';
import { useVision } from '@/lib/store/vision-context';

interface StimulusProps {
    logMAR: number;
    type: 'E' | 'C'; // Stimulus type (Tumbling E or Landolt C)
    orientation: number; // 0, 90, 180, 270 degrees
    distanceMm?: number; // Default 400mm
}

export function Stimulus({ logMAR, type, orientation, distanceMm = 400 }: StimulusProps) {
    const { calibrationPxMm } = useVision();

    if (!calibrationPxMm) {
        return <div className="text-red-500">Not Calibrated</div>;
    }

    // Calculate scaling
    // MAR (Minimum Angle of Resolution) in minutes = 10^logMAR
    const mar = Math.pow(10, logMAR);

    // Letter height is usually 5 * MAR (for Snellen E, the gap is 1 MAR, total height 5 MAR)
    // Height in radians approx: height_mm / distance_mm  (small angle)
    // Angle in degrees = (5 * mar) / 60
    // Height mm = distance_mm * tan(radians)
    const angleDegrees = (5 * mar) / 60;
    const angleRadians = angleDegrees * (Math.PI / 180);
    const letterHeightMm = distanceMm * Math.tan(angleRadians);

    const letterHeightPx = letterHeightMm * calibrationPxMm;

    return (
        <div
            className="flex items-center justify-center transition-all duration-300"
            style={{
                width: `${letterHeightPx}px`,
                height: `${letterHeightPx}px`,
                transform: `rotate(${orientation}deg)`
            }}
        >
            {/* 
         We can use an SVG for perfect scaling.
         Snellen E is a 5x5 grid.
      */}
            {type === 'E' ? (
                <svg viewBox="0 0 5 5" fill="currentColor" className="w-full h-full text-slate-900">
                    <path d="M0 0 H5 V1 H1 V2 H4 V3 H1 V4 H5 V5 H0 Z" />
                </svg>
            ) : (
                // Landolt C
                <svg viewBox="0 0 5 5" fill="currentColor" className="w-full h-full text-slate-900">
                    {/* Ring with gap. Gap is 1 unit. Outer radius 2.5, Inner 1.5? Usually 5 units high. Gap is 1/5 height.*/}
                    <circle cx="2.5" cy="2.5" r="2.5" mask="url(#c-mask)" />
                    <mask id="c-mask">
                        <rect x="0" y="0" width="5" height="5" fill="white" />
                        <circle cx="2.5" cy="2.5" r="1.5" fill="black" />
                        {/* Gap at right (0 deg for SVG usually right is 0? standard logic varies. lets assume gap at right) */}
                        <rect x="2.5" y="2" width="2.5" height="1" fill="black" />
                    </mask>
                </svg>
            )}
        </div>
    );
}
