import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { APP_NAME, APP_DESCRIPTION, SEO_CONFIG } from '@/lib/constants';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: SEO_CONFIG.DEFAULT_TITLE,
    template: `%s | ${SEO_CONFIG.DEFAULT_TITLE}`,
  },
  description: SEO_CONFIG.DEFAULT_DESCRIPTION,
  keywords: SEO_CONFIG.DEFAULT_KEYWORDS,
  authors: [{ name: 'MyFitness Team' }],
  creator: 'MyFitness Team',
  publisher: 'MyFitness',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    title: SEO_CONFIG.DEFAULT_TITLE,
    description: SEO_CONFIG.DEFAULT_DESCRIPTION,
    siteName: APP_NAME,
    images: [
      {
        url: SEO_CONFIG.DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - ${APP_DESCRIPTION}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_CONFIG.DEFAULT_TITLE,
    description: SEO_CONFIG.DEFAULT_DESCRIPTION,
    creator: SEO_CONFIG.TWITTER_HANDLE,
    images: [SEO_CONFIG.DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('[MyFitness Debug] RootLayout rendering with lang="en"');
  
  return (
    <html lang="en" className={cn(inter.variable, 'font-sans')}>
      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          as="style"
        />
        
        {/* Viewport meta tag for mobile optimization */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
        />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        
        {/* Apple mobile web app configuration */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        
        {/* Prevent automatic phone number detection */}
        <meta name="format-detection" content="telephone=no" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          'selection:bg-primary/20 selection:text-primary-foreground'
        )}
      >
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Skip to main content
        </a>
        
        {/* Main application content */}
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <main id="main-content" className="flex-1">
              {children}
            </main>
          </div>
          <Toaster position="top-right" />
        </AuthProvider>
        
        {/* Development tools (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 z-50 opacity-50 hover:opacity-100 transition-opacity">
            <div className="bg-black text-white text-xs px-2 py-1 rounded">
              <div className="block sm:hidden">XS</div>
              <div className="hidden sm:block md:hidden">SM</div>
              <div className="hidden md:block lg:hidden">MD</div>
              <div className="hidden lg:block xl:hidden">LG</div>
              <div className="hidden xl:block">XL</div>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}