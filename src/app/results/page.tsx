"use client";

import { useEffect, useState } from 'react';

import { useVision } from '@/lib/store/vision-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, RefreshCcw, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { AIAnalysisOverlay } from '@/components/test/AIAnalysisOverlay';
import { DownloadResultsButton } from '@/components/common/DownloadResultsButton';

// ...

export default function ResultsPage() {
    const { leftEyeResult, rightEyeResult, contrastResult, resetTest } = useVision();
    const [mounted, setMounted] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(true);

    useEffect(() => {
        setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
    }, []);

    if (!mounted) return null;

    if (isAnalyzing) {
        return <AIAnalysisOverlay onComplete={() => setIsAnalyzing(false)} />;
    }

    // Use dummy data if null for preview
    const left = leftEyeResult || { acuity: "20/20", metric: "6/6", logMAR: 0, diopters: 0.00 };
    const right = rightEyeResult || { acuity: "20/40", metric: "6/12", logMAR: 0.3, diopters: -0.75 };

    const mockHistory = [
        { date: 'Oct 12', acuity: 0.8 },
        { date: 'Nov 01', acuity: 0.7 },
        { date: 'Dec 15', acuity: 0.6 },
        { date: 'Jan 02', acuity: 0.5 },
        { date: 'Today', acuity: (left.logMAR + right.logMAR) / 2 }
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <main className="flex-1 flex flex-col items-center p-6 md:p-12 max-w-5xl mx-auto w-full">

                <div className="text-center space-y-4 mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Verified Result
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Your Vision Report</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        Based on your inputs. Values include visual acuity ratio (Metric/Imperial) and estimated correction power.
                    </p>
                </div>

                {/* Contrast Sensitivity Result (NEW) */}
                {contrastResult && (
                    <Card className="w-full bg-white border border-slate-200 shadow-xl shadow-purple-200/50 rounded-2xl overflow-hidden mb-12">
                        <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Contrast Sensitivity</h3>
                                    <p className="text-slate-500 text-sm">Ability to distinguish objects from background</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 bg-slate-50 px-6 py-4 rounded-xl border border-slate-100">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{contrastResult.label}</div>
                                    <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Limit</div>
                                </div>
                                <div className="w-px h-10 bg-slate-200"></div>
                                <div className="text-center">
                                    <div className={`text-xl font-bold ${contrastResult.sensitivity === 'Normal' ? 'text-green-600' : 'text-amber-600'}`}>
                                        {contrastResult.sensitivity}
                                    </div>
                                    <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Status</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Medical Table */}
                <Card className="w-full bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden mb-12">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-left">Eye</th>
                                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Sphere (SPH)</th>
                                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Acuity (Metric)</th>
                                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Acuity (US)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 font-bold text-slate-900 flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">OD</div>
                                        <div>
                                            Right Eye
                                            <div className="text-xs font-normal text-slate-400">Oculus Dexter</div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-center font-mono text-xl font-bold text-slate-900">
                                        {right.diopters === 0 ? "PL" : (right.diopters > 0 ? "+" : "") + right.diopters.toFixed(2)} D
                                    </td>
                                    <td className="p-6 text-center font-mono text-lg text-blue-600 font-bold">
                                        {right.metric || "6/--"}
                                    </td>
                                    <td className="p-6 text-center font-mono text-lg text-slate-600">
                                        {right.acuity || "20/--"}
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 font-bold text-slate-900 flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">OS</div>
                                        <div>
                                            Left Eye
                                            <div className="text-xs font-normal text-slate-400">Oculus Sinister</div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-center font-mono text-xl font-bold text-slate-900">
                                        {left.diopters === 0 ? "PL" : (left.diopters > 0 ? "+" : "") + left.diopters.toFixed(2)} D
                                    </td>
                                    <td className="p-6 text-center font-mono text-lg text-blue-600 font-bold">
                                        {left.metric || "6/--"}
                                    </td>
                                    <td className="p-6 text-center font-mono text-lg text-slate-600">
                                        {left.acuity || "20/--"}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Progress Graph */}
                <Card className="w-full bg-slate-900 border border-slate-800 shadow-2xl p-8 mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                        <div>
                            <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold rounded-full text-xs mb-3">
                                PRO ANALYTICS
                            </div>
                            <h3 className="text-2xl font-bold text-white">Vision Health Trend</h3>
                            <p className="text-slate-400">Your visual acuity history (LogMAR)</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-mono font-bold text-green-400 flex items-center justify-end gap-2">
                                +12% <span className="text-xs font-sans font-normal text-slate-500">Improvement</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockHistory}>
                                <defs>
                                    <linearGradient id="colorAcuity" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b' }} />
                                <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} reversed />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="acuity" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAcuity)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Insights & Next Steps */}
                <div className="grid md:grid-cols-2 gap-8 w-full mb-12">
                    <Card className="bg-white border border-slate-200 shadow-sm p-6 space-y-4">
                        <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
                            <Info className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Reading your score</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            <strong>6/6 (20/20)</strong> is considered standard &quot;good&quot; vision.
                            <br />
                            <strong>6/12 (20/40)</strong> means you see at 6 meters what a standard eye sees at 12 meters (blurrier).
                        </p>
                    </Card>

                    <Card className="bg-slate-900 text-white shadow-xl p-6 space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <h3 className="text-lg font-bold relative z-10">Next Steps</h3>
                        <p className="text-slate-300 text-sm leading-relaxed relative z-10">
                            These results suggest you might benefit from corrective lenses. We recommend scheduling a comprehensive eye exam.
                        </p>
                        <Button
                            className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold h-12 relative z-10"
                            onClick={() => window.open('https://www.google.com/maps/search/optometrist+near+me', '_blank')}
                        >
                            Find an Optometrist
                        </Button>
                    </Card>
                </div>


                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center border-t border-slate-100 pt-8">
                    <DownloadResultsButton />
                    <Button size="lg" className="h-14 px-8 bg-black hover:bg-slate-800 text-white font-bold w-full sm:w-auto shadow-xl shadow-slate-900/10" onClick={resetTest}>
                        <RefreshCcw className="mr-2 h-4 w-4" /> Start New Test
                    </Button>
                </div>

            </main>
        </div>
    );
}
