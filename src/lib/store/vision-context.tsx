"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    name: string | null;
    image?: string | null;
}

interface VisionState {
    calibrationPxMm: number | null;
    setCalibrationPxMm: (val: number) => void;
    leftEyeResult: any | null;
    rightEyeResult: any | null;
    setLeftEyeResult: (val: any) => void;
    setRightEyeResult: (val: any) => void;

    // V2 Fields
    astigmatismResult: { left?: number, right?: number } | null;
    setAstigmatismResult: (val: { left?: number, right?: number }) => void;
    visionScore: number | null;
    setVisionScore: (val: number) => void;
    contrastResult: { score: number, label: string, sensitivity: string } | null;
    setContrastResult: (val: { score: number, label: string, sensitivity: string }) => void;

    resetTest: () => void;

    // Auth
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

const VisionContext = createContext<VisionState | undefined>(undefined);

export function VisionProvider({ children }: { children: ReactNode }) {
    const [calibrationPxMm, setCalibrationPxMm] = useState<number | null>(null);
    const [leftEyeResult, setLeftEyeResult] = useState<any | null>(null);
    const [rightEyeResult, setRightEyeResult] = useState<any | null>(null);
    const [astigmatismResult, setAstigmatismResult] = useState<{ left?: number, right?: number } | null>(null);
    const [visionScore, setVisionScore] = useState<number | null>(null);
    const [contrastResult, setContrastResult] = useState<{ score: number, label: string, sensitivity: string } | null>(null);

    // Auth State
    const [user, setUser] = useState<User | null>(null);

    // Load user from localStorage on mount
    React.useEffect(() => {
        const storedUser = localStorage.getItem('iris_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('iris_user', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true'); // Keep legacy flag for now
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('iris_user');
        localStorage.removeItem('isLoggedIn');
    };

    const resetTest = () => {
        setLeftEyeResult(null);
        setRightEyeResult(null);
        setAstigmatismResult(null);
        setVisionScore(null);
        setContrastResult(null);
        // Keep calibration
    };

    return (
        <VisionContext.Provider
            value={{
                calibrationPxMm,
                setCalibrationPxMm,
                leftEyeResult,
                rightEyeResult,
                setLeftEyeResult,
                setRightEyeResult,
                astigmatismResult,
                setAstigmatismResult,
                visionScore,
                setVisionScore,
                contrastResult,
                setContrastResult,
                resetTest,
                user,
                login,
                logout
            }}
        >
            {children}
        </VisionContext.Provider>
    );
}

export function useVision() {
    const context = useContext(VisionContext);
    if (context === undefined) {
        throw new Error('useVision must be used within a VisionProvider');
    }
    return context;
}
