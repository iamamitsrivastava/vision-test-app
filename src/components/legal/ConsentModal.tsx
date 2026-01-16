"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConsentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ConsentModal({ isOpen, onClose }: ConsentModalProps) {
    const router = useRouter();
    const [accepted, setAccepted] = useState(false);

    const handleContinue = () => {
        if (accepted) {
            router.push('/onboarding');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Required Safety Disclaimer">
            <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-900 text-sm flex gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                        <p className="font-bold mb-1">Not a Medical Diagnostic Tool</p>
                        <p>
                            This application is designed for educational and screening purposes only.
                            The results provided are estimates and <strong>do not replace a professional eye examination</strong>.
                        </p>
                    </div>
                </div>

                <div className="text-sm text-slate-600 space-y-2">
                    <p>By continuing, you acknowledge that:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>You understand this test may not be 100% accurate.</li>
                        <li>You will consult an optometrist if you experience vision issues.</li>
                        <li>You are responsible for ensuring your screen is calibrated correctly.</li>
                    </ul>
                </div>

                <div className="pt-4 border-t">
                    <label className="flex items-start gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                        />
                        <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                            I have read and accept the terms of use and safety disclaimer.
                        </span>
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button disabled={!accepted} onClick={handleContinue}>
                        Agree & Start Test
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
