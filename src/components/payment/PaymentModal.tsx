"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Lock, ShieldCheck, CheckCircle2, Loader2, Clock } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    onSuccess: () => void;
}

export function PaymentModal({ isOpen, onSuccess }: PaymentModalProps) {
    const router = useRouter();
    const [step, setStep] = useState<'scan' | 'verify' | 'success'>('scan');
    const [txnId, setTxnId] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(40);

    // UPI Details
    const UPI_ID = "8077213785@superyes";
    const AMOUNT = "9";
    const NAME = "IrisVision Premium";
    // Dynamic transaction note to ensure "randomness" / uniqueness in the QR data
    const [qrData, setQrData] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Reset state on open
            setStep('scan');
            setTxnId('');
            setError('');
            setTimeLeft(40);

            // Generate QR
            const refId = Math.random().toString(36).substring(7).toUpperCase();
            const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(NAME)}&am=${AMOUNT}&cu=INR&tn=Ref-${refId}`;
            setQrData(upiLink);
        }
    }, [isOpen]);

    // Timer Logic
    useEffect(() => {
        if (isOpen && step !== 'success') {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        router.push('/'); // Redirect to home on timeout
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isOpen, step, router]);

    // Validation Helper
    const validateUTR = (id: string) => {
        // 1. Length check: Must be exactly 12 digits
        if (!/^\d{12}$/.test(id)) {
            return "Transaction ID must be exactly 12 digits (numeric).";
        }

        // 2. Anti-cheat: Check for repeated digits (e.g. 111111111111)
        if (/^(\d)\1+$/.test(id)) {
            return "Please enter a valid, non-repeated Transaction ID.";
        }

        // 3. Anti-cheat: Check for sequential digits (e.g. 123456789012)
        const sequential = "01234567890123456789";
        if (sequential.includes(id)) {
            return "Please enter a valid Transaction ID.";
        }

        return null; // Valid
    };

    const handleVerify = () => {
        const validationError = validateUTR(txnId);
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsVerifying(true);
        setError('');

        // Simulate API verification delay
        setTimeout(() => {
            setIsVerifying(false);
            // In a real app, we would verify against backend here.
            // For this demo, we verify format.
            setStep('success');

            // Auto close after success animation
            setTimeout(() => {
                localStorage.setItem('is_iris_premium', 'true');
                onSuccess();
            }, 2000);
        }, 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-md bg-white text-slate-900 border-none shadow-2xl" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        {step === 'success' ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : <Lock className="w-6 h-6 text-blue-600" />}
                    </div>
                    <DialogTitle className="text-2xl font-bold">
                        {step === 'success' ? 'Payment Successful!' : 'Premium Feature Access'}
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        {step === 'success'
                            ? 'Thank you for subscribing. Unlocking features...'
                            : 'This premium tool requires active access.'}
                    </DialogDescription>
                    {step !== 'success' && (
                        <div className="flex items-center justify-center gap-2 mt-2 text-red-500 font-bold bg-red-50 py-1 rounded-full text-xs w-fit mx-auto px-4">
                            <Clock className="w-3 h-3" />
                            Session Expires in: {timeLeft}s
                        </div>
                    )}
                </DialogHeader>

                {step === 'scan' || step === 'verify' ? (
                    <div className="space-y-6 py-4">
                        {/* Plan Details */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-900">Monthly Access</h3>
                                <p className="text-xs text-slate-500">Unlocks all advanced vision tests</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black text-blue-600">₹9</span>
                                <span className="text-xs text-slate-400">/mo</span>
                            </div>
                        </div>

                        {/* Scanner Area */}
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-blue-200 shadow-sm relative group">
                                {qrData && (
                                    <QRCodeSVG
                                        value={qrData}
                                        size={180}
                                        level="H"
                                        includeMargin={true}
                                        imageSettings={{
                                            src: "https://cdn-icons-png.flaticon.com/512/10129/10129033.png", // Generic UPI icon
                                            x: undefined,
                                            y: undefined,
                                            height: 24,
                                            width: 24,
                                            excavate: true,
                                        }}
                                    />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/90">
                                    <span className="text-xs font-bold text-blue-600">Scan with any UPI App</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 text-center max-w-[200px]">
                                Scan QR to pay <strong>₹9</strong> to <strong>{UPI_ID}</strong>
                            </p>
                        </div>

                        {/* Verification Input */}
                        <div className="space-y-3 pt-2">
                            <label className="text-sm font-medium text-slate-700 block">
                                Enter UPI Transaction ID (UTR)
                            </label>
                            <Input
                                placeholder="e.g. 4028391..."
                                value={txnId}
                                onChange={(e) => setTxnId(e.target.value)}
                                className="text-center tracking-widest font-mono"
                            />
                            {error && <p className="text-xs text-red-500 text-center animate-pulse">{error}</p>}

                            <Button
                                className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20"
                                onClick={handleVerify}
                                disabled={isVerifying || !txnId}
                            >
                                {isVerifying ? (
                                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Verifying...</>
                                ) : (
                                    <><ShieldCheck className="w-5 h-5 mr-2" /> Verify & Unlock</>
                                )}
                            </Button>
                        </div>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
