'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        toast.error(result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error);
      } else if (result?.ok) {
        toast.success('Welcome back!');
        router.push(callbackUrl);
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@nexusleadgen.ai');
    setPassword('demo12345');
    setIsLoading(true);
    try {
      // First create the demo user if it doesn't exist
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Demo User',
          email: 'demo@nexusleadgen.ai',
          password: 'demo12345',
        }),
      });

      const result = await signIn('credentials', {
        email: 'demo@nexusleadgen.ai',
        password: 'demo12345',
        redirect: false,
        callbackUrl: '/dashboard',
      });

      if (result?.ok) {
        toast.success('Welcome to the demo!');
        router.push('/dashboard');
        router.refresh();
      } else {
        toast.error('Demo login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <Image
            src="/images/logo.png"
            alt="Nexus LeadGen AI"
            width={40}
            height={40}
            className="h-10 w-auto"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span className="text-2xl font-bold text-primary-blue">
            Nexus <span className="text-accent-green">LeadGen</span> AI
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-500 mt-1 text-sm">Sign in to your account to continue</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            leftIcon={<EnvelopeIcon className="h-4 w-4" />}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            leftIcon={<LockClosedIcon className="h-4 w-4" />}
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="rounded" />
              Remember me
            </label>
            <Link href="#" className="text-sm text-primary-blue hover:text-blue-800">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" className="w-full" loading={isLoading} size="lg">
            Sign In
          </Button>
        </form>

        <div className="mt-4 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <button
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="mt-4 w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Try Demo Account
        </button>
      </div>

      <p className="text-center mt-6 text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-primary-blue font-semibold hover:text-blue-800">
          Sign up free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel - form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="w-full max-w-md text-center text-gray-500">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>

      {/* Right panel - branding */}
      <div className="hidden lg:flex w-1/2 gradient-hero items-center justify-center p-12 text-white">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">ð¯</div>
          <h2 className="text-3xl font-bold mb-4">Your Next Big Client is One Campaign Away</h2>
          <p className="text-blue-200 leading-relaxed">
            Nexus LeadGen AI discovers, engages, and converts high-quality leads automatically. Join thousands of businesses growing smarter.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { value: '10K+', label: 'Leads Discovered Daily' },
              { value: '94%', label: 'Customer Satisfaction' },
              { value: '3.2x', label: 'Average ROI' },
              { value: '24/7', label: 'AI Working For You' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white bg-opacity-10 rounded-xl p-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-blue-200 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
