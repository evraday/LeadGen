import type { Metadata } from 'next';
import './globals.css';
import SessionProviderWrapper from '@/components/providers/SessionProvider';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Nexus LeadGen AI: Automated B2B Lead Finder & Prospecting Software',
  description:
    'Discover high-quality B2B leads with Nexus LeadGen AI. Our intelligent platform automates prospecting, multi-channel outreach, and compliance-first messaging for professional services & healthcare.',
  keywords: [
    'lead generation software',
    'B2B lead finder',
    'automated prospecting tool',
    'AI lead generation',
    'sales prospecting software',
    'lead generation for professional services',
    'healthcare lead generation',
    'SaaS lead generation platform',
    'multi-channel lead outreach',
    'social media lead generation',
  ],
  authors: [{ name: 'Nexus AI' }],
  openGraph: {
    title: 'Nexus LeadGen AI: Automated B2B Lead Finder',
    description:
      'Discover high-quality B2B leads with AI-powered prospecting, multi-channel outreach, and compliance-first messaging.',
    type: 'website',
    images: [
      {
        url: '/images/dashboard-hero-illustration.png',
        width: 1200,
        height: 630,
        alt: 'Nexus LeadGen AI dashboard showing lead analytics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexus LeadGen AI: Automated B2B Lead Finder',
    description: 'AI-powered lead generation for professional services & healthcare.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Nexus LeadGen AI',
              operatingSystem: 'Web',
              applicationCategory: 'BusinessApplication',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '75',
              },
              offers: {
                '@type': 'Offer',
                price: '29',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
              },
              description:
                'Nexus LeadGen AI empowers businesses to efficiently identify, engage, and convert high-quality leads by automating intelligent research and multi-channel outreach, all within a compliance-first framework.',
              publisher: {
                '@type': 'Organization',
                name: 'Nexus AI',
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <SessionProviderWrapper>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a2e',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#38A169',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#E53E3E',
                  secondary: '#fff',
                },
              },
            }}
          />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
