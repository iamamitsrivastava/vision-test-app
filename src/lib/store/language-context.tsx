"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

type Translations = {
    [key: string]: string;
};

const dictionaries: Record<Language, Translations> = {
    en: {
        "nav.home": "Home",
        "nav.startTest": "Check Vision Now",
        "nav.technology": "Our Technology",
        "nav.science": "Medical Science",
        "nav.profile": "My Vision Profile",
        "nav.search": "Search Site",
        "nav.login": "Log in",
        "nav.welcome": "Welcome,",
        "nav.dashboard": "Dashboard",
        "nav.logout": "Log out",

        "hero.title": "Advanced Vision Testing",
        "hero.subtitle": "Medical-Grade Precision • AI-Powered Analysis",
        "hero.description": "Experience professional-grade eye examinations from the comfort of your home. Our AI-driven platform detects early signs of vision issues with 99.8% clinical accuracy.",
        "hero.cta": "Start Free Assessment",
        "hero.trust": "Trusted by 2M+ Users",

        "catalog.title": "Select a Specific Test",
        "catalog.subtitle": "Choose a targeted screening based on your symptoms or needs.",
        "catalog.note": "Note: These online screenings are for informational purposes only and do not replace a comprehensive medical eye exam by a professional."
    },
    hi: {
        "nav.home": "होम",
        "nav.startTest": "विज़न चेक करें",
        "nav.technology": "हमारी तकनीक",
        "nav.science": "चिकित्सा विज्ञान",
        "nav.profile": "मेरी विज़न प्रोफ़ाइल",
        "nav.search": "साइट खोजें",
        "nav.login": "लॉग इन",
        "nav.welcome": "नमस्ते,",
        "nav.dashboard": "डैशबोर्ड",
        "nav.logout": "लॉग आउट",

        "hero.title": "उन्नत नेत्र परीक्षण",
        "hero.subtitle": "मेडिकल-ग्रेड सटीकता • एआई-संचालित विश्लेषण",
        "hero.description": "अपने घर के आराम से पेशेवर स्तर की आंखों की जांच का अनुभव करें। हमारा एआई-संचालित प्लेटफॉर्म 99.8% नैदानिक सटीकता के साथ दृष्टि समस्याओं के शुरुआती संकेतों का पता लगाता है।",
        "hero.cta": "निःशुल्क जांच शुरू करें",
        "hero.trust": "20 लाख+ उपयोगकर्ताओं द्वारा विश्वसनीय",

        "catalog.title": "विशिष्ट परीक्षण चुनें",
        "catalog.subtitle": "अपने लक्षणों या जरूरतों के आधार पर लक्षित स्क्रीनिंग चुनें।",
        "catalog.note": "नोट: ये ऑनलाइन स्क्रीनिंग केवल सूचनात्मक उद्देश्यों के लिए हैं और पेशेवर द्वारा व्यापक चिकित्सा नेत्र परीक्षा का स्थान नहीं लेते हैं।"
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('iris_language') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
            setLanguage(savedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('iris_language', lang);
    };

    const t = (key: string) => {
        return dictionaries[language][key] || dictionaries['en'][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
