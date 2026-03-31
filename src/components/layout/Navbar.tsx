'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/images/logo.png"
              alt="Nexus LeadGen AI"
              width={36}
              height={36}
              className="h-9 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-xl font-bold text-primary-blue hidden sm:block">
              Nexus <span className="text-accent-green">LeadGen</span> AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm font-medium text-gray-600 hover:text-primary-blue transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-gray-600 hover:text-primary-blue transition-colors">
              Pricing
            </Link>
            <Link href="/#how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary-blue transition-colors">
              How It Works
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-primary-blue hover:text-blue-800 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-blue text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-800 transition-colors"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3 animate-in">
            <Link href="/#features" className="block px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-primary-blue">
              Features
            </Link>
            <Link href="/#pricing" className="block px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-primary-blue">
              Pricing
            </Link>
            <Link href="/#how-it-works" className="block px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-primary-blue">
              How It Works
            </Link>
            <div className="pt-2 border-t border-gray-200 flex flex-col gap-2">
              {session ? (
                <>
                  <Link href="/dashboard" className="block px-2 py-2 text-sm font-medium text-primary-blue">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="block text-left px-2 py-2 text-sm font-medium text-gray-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-2 py-2 text-sm font-medium text-gray-700">
                    Sign In
                  </Link>
                  <Link href="/register" className="bg-primary-blue text-white px-4 py-2 rounded-md text-sm font-semibold text-center">
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
