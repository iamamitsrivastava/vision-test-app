import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { VisionProvider } from '@/lib/store/vision-context';
import { CookieConsent } from '@/components/common/CookieConsent';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { LanguageProvider } from '@/lib/store/language-context';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Iris - Online Vision Screening',
  description: 'Professional grade vision screening at home.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(outfit.className, "antialiased min-h-screen bg-slate-50")}>
        <AuthProvider>
          <LanguageProvider>
            <VisionProvider>
              <div className="flex flex-col min-h-screen">
                <CookieConsent />
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </VisionProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
