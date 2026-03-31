'use client';

import Image from 'next/image';

export default function HeroImage() {
  return (
    <Image
      src="/images/dashboard-hero-illustration.png"
      alt="Nexus LeadGen AI dashboard showing lead analytics and campaign performance"
      width={600}
      height={400}
      className="relative rounded-2xl shadow-2xl"
      priority
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        img.src = 'https://placehold.co/600x400/1a3a6b/ffffff?text=LeadGen+Dashboard';
      }}
    />
  );
}
