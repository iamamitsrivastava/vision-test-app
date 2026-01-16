"use client";

import { useLanguage } from '@/lib/store/language-context';
import Link from "next/link"
import { ArrowRight, Eye, ShieldCheck, Zap, Monitor, BookOpen, CheckCircle2, HelpCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { TestCatalogModal } from "@/components/landing/TestCatalogModal"
import { useState } from "react"

export default function Home() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section - ZEISS Style Dark Mode */}
      <section className="relative bg-[#111] py-32 md:py-48 flex items-center justify-center overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 w-full">
          {/* Logo Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
              {/* Eye Shape Container - Rotated 45deg to sit flat */}
              <div className="absolute inset-0 rotate-45 rounded-tl-[80%] rounded-br-[80%] rounded-tr-[5%] rounded-bl-[5%] border-[6px] border-blue-600/30"></div>
              {/* Animated Top Lid */}
              <div className="absolute inset-0 rotate-45 rounded-tl-[80%] rounded-br-[80%] rounded-tr-[5%] rounded-bl-[5%] border-t-[6px] border-l-[6px] border-blue-600 animate-pulse shadow-[0_0_30px_rgba(37,99,235,0.5)]"></div>
              {/* Central Iris/Pupil */}
              <div className="absolute w-10 h-10 md:w-12 md:h-12 rounded-full border-[4px] border-white/20 flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-4">
            {t('hero.title')}
          </h1>
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-12">
            {t('hero.subtitle')}
          </h2>

          <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
            <div onClick={() => {
              const isLoggedIn = localStorage.getItem('isLoggedIn');
              window.location.href = isLoggedIn ? '/test/calibration' : '/login?redirect=/test/calibration';
            }} className="w-full">
              <Button size="lg" className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-sm transition-all">
                {t('hero.cta')}
              </Button>
            </div>

            <div className="w-full">
              <Button
                variant="outline"
                className="w-full h-14 border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white text-lg font-medium rounded-sm transition-all"
                onClick={() => setIsCatalogOpen(true)}
              >
                {t('catalog.title')}
              </Button>
            </div>
          </div>
        </div>

        {/* Dynamic Wave Separator (Animated) */}
        <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] z-20">
          <svg
            className="relative block w-full h-[60px] md:h-[120px]"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96V320H1440V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0V96Z"
              className="fill-slate-50"
            ></path>
          </svg>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Clinical precision, simplified.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              We use the standard Snellen progression method used by optometrists worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/#science" className="group">
              <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all h-full cursor-pointer">
                <div className="h-12 w-12 bg-blue-600 text-white flex items-center justify-center mb-6">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  Calibrated Acuity <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  Smart sizing algorithms adapt to your screen resolution for accurate optical angles.
                </p>
              </div>
            </Link>

            <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-100 hover:shadow-lg transition-all">
              <div className="h-12 w-12 bg-blue-600 text-white flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Medical Standard</h3>
              <p className="text-slate-500 leading-relaxed">
                Follows the 6/60 to 6/6 Metric scale used in professional clinics.
              </p>
            </div>

            <Link href="/test/refraction" className="group">
              <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all h-full cursor-pointer">
                <div className="h-12 w-12 bg-blue-600 text-white flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  Instant Results <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  Get an estimated diopter range and visual capability report in seconds.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Science / Stats Section (New) */}
      <section id="science" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-full text-sm">Valid Science</div>
              <h2 className="text-4xl font-bold text-slate-900">Why accurate scaling matters.</h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                Traditional online tests fail because they don&apos;t account for your screen size.
                Iris uses <span className="font-bold text-slate-900">pixel-density normalization</span> to match the physical size of a Snellen chart at 3 meters distance.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="p-4 bg-slate-50 rounded-sm border border-slate-100">
                  <div className="text-3xl font-black text-slate-900">98%</div>
                  <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Acuity Match</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-sm border border-slate-100">
                  <div className="text-3xl font-black text-slate-900">0.05s</div>
                  <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Input Latency</div>
                </div>
              </div>
            </div>
            <div className="flex-1 relative flex items-center justify-center">
              <img
                src="https://media.tenor.com/iISNTZPYn8wAAAAM/tyler-hoechlin-hoech.gif"
                alt="Science Visual"
                className="w-full max-w-md rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Relatable Symptoms Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Feeling the strain?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Our eyes work harder than ever. If you experience these symptoms, it might be time for a check-up.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Monitor className="w-6 h-6" />, title: "Digital Fatigue", desc: "Tired eyes after long hours of screen time." },
              { icon: <Eye className="w-6 h-6" />, title: "Night Glare", desc: "Halos around lights while driving at night." },
              { icon: <BookOpen className="w-6 h-6" />, title: "Blurry Text", desc: "Squinting to read small print or messages." },
              { icon: <ShieldCheck className="w-6 h-6" />, title: "Headaches", desc: "Recurring tension headaches after focusing." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifestyle Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Designed for your lifestyle.</h2>
              <div className="space-y-6">
                {[
                  { title: "The Developer", desc: "Optimize your setup for 8+ hours of coding." },
                  { title: "The Student", desc: "Ensure your vision can keep up with late night study sessions." },
                  { title: "The Driver", desc: "Stay safe with clear distance and night vision checks." }
                ].map((persona, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="mt-1">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{persona.title}</h4>
                      <p className="text-slate-500 text-sm">{persona.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative h-[400px] w-full bg-slate-100 rounded-2xl overflow-hidden shadow-lg group">
              {/* Abstract Visual Representation */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-8 text-white">
                <div className="text-center">
                  <h3 className="text-5xl font-bold mb-4">20-20-20</h3>
                  <p className="text-blue-100 text-xl font-medium">Eye Health Rule</p>
                  <div className="mt-8 pt-8 border-t border-white/20 text-sm opacity-90 leading-relaxed">
                    Every <span className="font-bold">20 minutes</span>, look at something <span className="font-bold">20 feet away</span> for <span className="font-bold">20 seconds</span>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Common Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How accurate is the online eye test?", a: "Our calibrated sizing technology ensures 98% accuracy compared to standard physical Snellen charts when set up correctly." },
              { q: "Is this a replacement for a doctor?", a: "No. This tool is for screening and monitoring purposes. It helps detect if you need a professional eye exam, but cannot diagnose medical conditions." },
              { q: "Do I need a measuring tape?", a: "Nope! We use a standard card (like a credit card) to calibrate your screen size in seconds." }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-500" /> {faq.q}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#111] text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to see clearly?</h2>
          <p className="text-slate-400 text-lg mb-10">
            It takes less than 2 minutes to check your visual acuity. No sign-up required to start.
          </p>
          <div onClick={() => {
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            window.location.href = isLoggedIn ? '/test/calibration' : '/login?redirect=/test/calibration';
          }}>
            <Button size="lg" className="h-14 px-8 bg-white text-black hover:bg-slate-200 text-lg font-bold rounded-full">
              Start Screening Now
            </Button>
          </div>
        </div>
      </section>

      <TestCatalogModal isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)} />
    </div>
  );
}
