"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Search, MapPin, LogOut, Globe, ChevronDown, User, Check } from 'lucide-react';
import { useVision } from '@/lib/store/vision-context';
import { Modal } from '@/components/ui/modal';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useLanguage } from '@/lib/store/language-context';

export function Navbar() {
    const { user, logout } = useVision();
    const { language, setLanguage, t } = useLanguage();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'हिंदी (Hindi)' }
    ];

    return (
        <>
            <header className="bg-[#00102d] text-white sticky top-0 z-50 shadow-md">
                {/* Main Nav */}
                <div className="max-w-[1400px] mx-auto px-6 h-[72px] flex items-center justify-between">

                    {/* Left Side: Logo & Main Links */}
                    <div className="flex items-center gap-12">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
                                <Image
                                    src="/logo.jpg"
                                    alt="IRIS Logo"
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-xl tracking-tight leading-none text-white">IRIS</span>
                                <span className="text-[10px] text-blue-300 tracking-wider uppercase">Vision Care</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden xl:flex items-center gap-8 text-[15px] font-medium text-white/90">
                            <Link href="/test/calibration" className="flex items-center gap-1 hover:text-white transition-colors group">
                                {t('nav.startTest')}
                            </Link>
                            <Link href="/#how-it-works" className="flex items-center gap-1 hover:text-white transition-colors group">
                                {t('nav.technology')} <ChevronDown className="w-4 h-4 text-blue-400 group-hover:rotate-180 transition-transform" />
                            </Link>
                            <Link href="/#science" className="flex items-center gap-1 hover:text-white transition-colors group">
                                {t('nav.science')}
                            </Link>
                            {user && (
                                <Link href="/dashboard" className="flex items-center gap-1 hover:text-white transition-colors">
                                    {t('nav.profile')}
                                </Link>
                            )}
                        </nav>
                    </div>

                    {/* Right Side: Actions */}
                    <div className="flex items-center gap-6">

                        {/* Search & Globe - Functional */}
                        <div className="hidden md:flex items-center gap-4 text-white/80">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                                aria-label="Search"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="hover:text-white transition-colors p-1 rounded-full hover:bg-white/10" aria-label="Change Language">
                                        <Globe className="w-5 h-5" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuLabel>Choose Language</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {languages.map((lang) => (
                                        <DropdownMenuItem
                                            key={lang.code}
                                            onClick={() => setLanguage(lang.code as any)}
                                            className="flex items-center justify-between cursor-pointer"
                                        >
                                            {lang.label}
                                            {language === lang.code && <Check className="h-4 w-4 text-blue-600" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="h-6 w-px bg-white/20 hidden md:block"></div>

                        {/* User Profile / Login */}
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-3 text-sm font-medium focus:outline-none hover:opacity-90 transition-opacity">
                                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold border-2 border-white/20 overflow-hidden relative">
                                            {user.image ? (
                                                <Image
                                                    src={user.image}
                                                    alt={user.name || "User"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                user.name?.[0] || user.email[0].toUpperCase()
                                            )}
                                        </div>
                                        <div className="hidden md:flex flex-col items-start leading-none">
                                            <span className="text-xs text-blue-300">{t('nav.welcome')}</span>
                                            <span className="font-semibold">{user.name?.split(' ')[0] || 'User'}</span>
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link href="/dashboard" className="w-full flex items-center gap-2"><User className="w-4 h-4" /> {t('nav.dashboard')}</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" /> {t('nav.logout')}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login" className="text-sm font-semibold hover:text-blue-300 transition-colors">
                                {t('nav.login')}
                            </Link>
                        )}

                        {/* Primary CTA Button */}
                        <Link href="/test/calibration">
                            <Button className="bg-[#1e5faa] hover:bg-[#164d8d] text-white rounded-full px-6 h-10 font-bold text-sm tracking-wide shadow-lg shadow-blue-900/50 flex items-center gap-2 transition-all hover:scale-105">
                                {t('nav.startTest')} <MapPin className="h-4 w-4 text-blue-200" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Search Modal */}
            <Modal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                title="Search Site"
                className="max-w-2xl"
            >
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="What are you looking for? (e.g. 'Astigmatism', 'Myopia')"
                            className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-900"
                            autoFocus
                        />
                    </div>

                    <div className="pt-2">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Popular Searches</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Online Eye Test', 'Astigmatism Check', 'Color Blindness', 'Find a Doctor', 'Visual Acuity'].map((tag) => (
                                <button key={tag} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm transition-colors">
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
