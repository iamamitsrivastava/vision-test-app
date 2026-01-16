"use client";

import { useEffect, useState } from 'react';
import { useVision } from '@/lib/store/vision-context';

import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import Link from 'next/link';
import { Eye, TrendingUp, Calendar } from 'lucide-react';

interface Session {
    id: string;
    createdAt: string;
    prediction: {
        leftEyeEst: string;
        rightEyeEst: string;
        confidence: string;
    } | null;
}

export default function DashboardPage() {
    const { user } = useVision();
    const [history, setHistory] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            // Wait a bit to check if user loads
            const timer = setTimeout(() => {
                // Redirect if still not logged in? Or show "Please login"
            }, 1000);
            return () => clearTimeout(timer);
        }

        const fetchHistory = async () => {
            try {
                const res = await fetch(`/api/results/history?userId=${user.id}`);
                const data = await res.json();
                if (data.sessions) {
                    setHistory(data.sessions);
                }
            } catch (error) {
                console.error('Failed to fetch history', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Please log in to view your dashboard</h2>
                    <Link href="/login">
                        <Button>Log In</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user.name || 'User'}</h1>
                        <p className="text-slate-500 mt-1">Here is your vision screening history.</p>
                    </div>
                    <Link href="/test/calibration">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">Start New Test</Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading history...</div>
                ) : history.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Eye className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No tests recorded yet</h3>
                        <p className="text-slate-500 mb-6">Complete your first vision screening to see results here.</p>
                        <Link href="/test/calibration">
                            <Button>Start Test</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {/* Stats Summary - Placeholder for now */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                                <div className="text-sm font-medium text-slate-500 mb-1">Total Tests</div>
                                <div className="text-2xl font-bold text-slate-900">{history.length}</div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                                <div className="text-sm font-medium text-slate-500 mb-1">Last Vision Score</div>
                                <div className="text-2xl font-bold text-slate-900">{history[0].prediction?.rightEyeEst || "N/A"}</div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                                <div className="text-sm font-medium text-slate-500 mb-1">Next Check Due</div>
                                <div className="text-2xl font-bold text-green-600">30 Days</div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 font-semibold text-slate-900 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-blue-600" /> Recent Activity
                            </div>
                            <div className="divide-y divide-slate-100">
                                {history.map((session) => (
                                    <div key={session.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                                <Calendar className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">
                                                    {format(new Date(session.createdAt), 'MMMM d, yyyy')}
                                                </div>
                                                <div className="text-sm text-slate-500">
                                                    {format(new Date(session.createdAt), 'h:mm a')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-center">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Left Eye</div>
                                                <div className="font-bold text-slate-900 text-lg">{session.prediction?.leftEyeEst || '—'}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Right Eye</div>
                                                <div className="font-bold text-slate-900 text-lg">{session.prediction?.rightEyeEst || '—'}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
