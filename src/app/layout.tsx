import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import WelcomeUser from '@/components/welcome-user';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
export const experimental_ppr = true;
const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Nerd Factory',
    description: 'Nerd Factory by Crystallize',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={manrope.className}>
                <header className="flex justify-between items-center p-4">
                    <div />
                    <Link href="/">
                        <Image src="/logo.svg" alt="NerdFactory logo" width={226} height={43} />
                    </Link>
                    <Suspense fallback={<p>Loading...</p>}>
                        <WelcomeUser />
                    </Suspense>
                </header>

                {children}
            </body>
        </html>
    );
}
