"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVision } from '@/lib/store/vision-context';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Script from 'next/script';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useVision();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const redirectPath = searchParams.get('redirect') || '/';
    // Use NEXT_PUBLIC_ var if strictly needed on client, or fall back to what we can find.
    // Note: In Next.js, process.env.GOOGLE_CLIENT_ID is usually server-only unless prefixed.
    // However, the user instruction implies a manual flow. We'll use a hardcoded placeholder if env is missing, prompting user to fill it.
    const GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID_HERE"; // REPLACE THIS or use process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    useEffect(() => {
        // Define the callback function globally so Google's script can find it
        // @ts-ignore
        window.handleCredentialResponse = async (response: any) => {
            console.log("JWT Token: ", response.credential);
            setLoading(true);

            try {
                const res = await fetch("/api/google-login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: response.credential })
                });

                const data = await res.json();

                if (data.success && data.user) {
                    login(data.user);
                    router.push(redirectPath);
                } else {
                    setError('Google Login failed: ' + (data.error || 'Unknown error'));
                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
                setError('Network error during Google Login');
                setLoading(false);
            }
        };
    }, [login, router, redirectPath]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // RESET STATE: Clear any existing premium/creator flags on new login attempt
        // This ensures a "Normal" user isn't accidentally treated as valid if a Creator previously used this device.
        localStorage.removeItem('is_iris_premium');
        localStorage.removeItem('is_creator');

        // --- CREATOR ACCOUNT BYPASS ---
        if (email === 'amit@gmail.com' && password === '124421') {
            // Simulate API delay for realism
            setTimeout(() => {
                localStorage.setItem('is_iris_premium', 'true');
                localStorage.setItem('is_creator', 'true'); // Optional: for specific creator UI if needed
                login({ id: 'creator-999', name: 'Amit (Creator)', email: 'amit@gmail.com' });
                router.push(redirectPath);
            }, 800);
            return;
        }

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const body = isLogin ? { email, password } : { email, password, name };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Access Denied');
            }

            setTimeout(() => {
                login(data.user);
                router.push(redirectPath);
            }, 800);

        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white">
            <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />

            {/* LEFT SIDE - Illustration Area */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-blue-50 items-center justify-center p-12 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                    <svg className="absolute top-0 left-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 0 L100 0 L100 100 L0 100 Z" fill="url(#grad1)" />
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: 'rgb(219, 234, 254)', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: 'rgb(239, 246, 255)', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                    </svg>
                    {/* Abstract Circles */}
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-200/20 blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-200/20 blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-lg text-center">
                    <div className="relative w-full aspect-square mb-8">
                        <Image
                            src="/login-illustration.png"
                            alt="Vision Test Illustration"
                            fill
                            className="object-contain drop-shadow-2xl animate-float"
                            priority
                        />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">Focus on your Vision.</h1>
                    <p className="text-slate-500 text-lg leading-relaxed">
                        Access professional-grade eye screening tools from the comfort of your home.
                        Precise, medical-standard, and instant results.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
                <div className="w-full max-w-md space-y-8">

                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <div className="flex justify-center lg:justify-start mb-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <span className="text-white font-bold text-xl tracking-tighter">Ir</span>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {isLogin ? 'Welcome back' : 'Create an account'}
                        </h2>
                        <p className="text-slate-500 mt-2">
                            {isLogin ? 'Please enter your details to sign in.' : 'Start your journey to better vision today.'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2 animate-shake">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    {!loading && <ArrowRight className="w-4 h-4" />}
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-500">Or continue with Google</span>
                        </div>
                    </div>

                    {/* Google Login Button - Manual GSI Implementation */}
                    <div className="w-full flex justify-center">
                        <div
                            id="g_id_onload"
                            data-client_id={GOOGLE_CLIENT_ID}
                            data-callback="handleCredentialResponse"
                            data-auto_prompt="false"
                        >
                        </div>
                        <div
                            className="g_id_signin"
                            data-type="standard"
                            data-size="large"
                            data-theme="outline"
                            data-text="sign_in_with"
                            data-shape="rectangular"
                            data-logo_alignment="left"
                            data-width="400"
                        >
                        </div>
                    </div>

                    {/* Footer / Toggle */}
                    <div className="text-center">
                        <p className="text-slate-600">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 font-bold text-blue-600 hover:underline underline-offset-4 focus:outline-none"
                            >
                                {isLogin ? 'Sign up for free' : 'Sign in'}
                            </button>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
