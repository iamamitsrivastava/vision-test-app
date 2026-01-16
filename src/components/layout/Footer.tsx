"use client";

import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-slate-100 py-16 text-sm text-slate-500">
            <div className="max-w-7xl mx-auto px-6">
                {/* Top Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
                    {/* Brand - Full width on mobile */}
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-xl tracking-tight">
                            <span className="w-4 h-4 rounded-full border-[3px] border-blue-600"></span>
                            Iris
                        </div>
                        <p className="leading-relaxed text-sm md:text-base">
                            Professional grade vision screening accessible to everyone, everywhere.
                        </p>
                    </div>

                    {/* Column 1 */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Frequently Used</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-blue-600 transition-colors">Start Check</Link></li>
                            <li><Link href="/login" className="hover:text-blue-600 transition-colors">Log In</Link></li>
                            <li><Link href="/#how-it-works" className="hover:text-blue-600 transition-colors">How it works</Link></li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">About Iris</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/#about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                            <li><Link href="/#science" className="hover:text-blue-600 transition-colors">Technology</Link></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">For Professionals</a></li>
                        </ul>
                    </div>

                    {/* Column 3 - Full width on very small screens if needed, but 2-col grid handles it */}
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Social Media</h4>
                        <ul className="space-y-2 text-sm flex md:block gap-4 md:gap-0">
                            <li><a href="https://www.instagram.com/4.07.2004/" className="hover:text-blue-600 transition-colors flex items-center gap-2">Instagram</a></li>
                            <li><a href="https://www.linkedin.com/in/amit-srivastava108/" className="hover:text-blue-600 transition-colors flex items-center gap-2">LinkedIn</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200 gap-4 text-center md:text-left">
                    <p className="text-xs md:text-sm">© 2026 Iris Vision Care. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm font-medium">
                        <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">Cookie Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
