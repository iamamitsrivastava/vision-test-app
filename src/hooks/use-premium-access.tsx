"use client";

import { useState, useEffect } from 'react';
import { PaymentModal } from '@/components/payment/PaymentModal';

const FREE_TRIAL_SECONDS = 0;

export function usePremiumAccess() {
    const [isPremium, setIsPremium] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Check local storage for persistent premium status
        const savedStatus = localStorage.getItem('is_iris_premium');
        if (savedStatus === 'true') {
            setIsPremium(true);
            setShowPaymentModal(false);
        } else {
            // Instant locking for paid features
            setIsPremium(false);
            setShowPaymentModal(true);
        }
        setIsLoading(false);
    }, []);

    // Effect to watch changes (e.g. from other tabs or actions)
    useEffect(() => {
        if (!isClient) return;
        if (isPremium) {
            setShowPaymentModal(false);
        } else {
            setShowPaymentModal(true);
        }
    }, [isClient, isPremium]);

    const unlockPremium = () => {
        setIsPremium(true);
        localStorage.setItem('is_iris_premium', 'true');
        setShowPaymentModal(false);
    };

    return {
        isPremium,
        isLoading,
        timeLeft,
        showPaymentModal,
        unlockPremium,
        PremiumGate: () => (
            <PaymentModal
                isOpen={showPaymentModal}
                onSuccess={unlockPremium}
            />
        )
    };
}
