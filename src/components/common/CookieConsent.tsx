"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookieCategory');
        if (!consent) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 100);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem('cookieCategory', 'all');
        setIsVisible(false);
    };

    const handleSavePreferences = () => {
        // Ideally this would save specific preferences, but for now we just close it as "saved"
        localStorage.setItem('cookieCategory', 'custom');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] max-w-sm w-full animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 relative">

                <h2 className="text-xl font-bold text-slate-900 mb-3">
                    We value your privacy
                </h2>

                <div className="text-slate-600 text-sm space-y-3 leading-snug">
                    <p>
                        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-blue-600">
                        <Link href="#" className="hover:underline">Privacy Policy</Link>
                        <Link href="#" className="hover:underline">Cookie Policy</Link>
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-5">
                    <button
                        onClick={handleAcceptAll}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-lg transition-colors shadow-lg shadow-slate-900/10"
                    >
                        Accept All
                    </button>
                    <button
                        onClick={handleSavePreferences}
                        className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-lg transition-colors"
                    >
                        Preferences
                    </button>
                </div>

            </div>
        </div>
    );
}
