'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BuildingOfficeIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast.error('Please agree to the Terms of Service to continue');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          company: formData.company,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Registration failed');
        return;
      }

      // Auto-login after registration
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        toast.success('Account created! Welcome to Nexus LeadGen AI!');
        router.push('/dashboard');
        router.refresh();
      } else {
        toast.success('Account created! Please sign in.');
        router.push('/login');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const BENEFITS = [
    '7-day free trial, no credit card required',
    '500 leads discovered in your first month',
    'AI-powered ICP generation included',
    'GDPR & CAN-SPAM compliant',
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex w-2/5 gradient-hero items-center justify-center p-12 text-white">
        <div className="max-w-sm">
          <div className="mb-8">
            <div className="text-5xl mb-4">ð</div>
            <h2 className="text-2xl font-bold mb-3">Start Finding Your Perfect Customers</h2>
            <p className="text-blue-200 text-sm leading-relaxed">
              Join forward-thinking businesses using AI to discover and engage their ideal customers at scale.
            </p>
          </div>
          <ul className="space-y-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3">
                <div className="h-5 w-5 bg-accent-green rounded-full flex items-center justify-center shrink-0">
                  <CheckIcon className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm text-blue-100">{benefit}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 bg-white bg-opacity-10 rounded-xl p-5">
            <p className="text-sm italic text-blue-100 mb-3">
              &ldquo;Nexus LeadGen AI has transformed our lead generation process, delivering higher quality leads and saving us countless hours.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm font-bold">JD</div>
              <div>
                <p className="text-xs font-semibold">John Davidson</p>
                <p className="text-xs text-blue-300">Managing Partner, Davidson Law</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
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
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="text-gray-500 mt-1 text-sm">Start your 7-day free trial today</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="John Smith"
                required
                leftIcon={<UserIcon className="h-4 w-4" />}
                autoComplete="name"
              />
              <Input
                label="Work Email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="john@company.com"
                required
                leftIcon={<EnvelopeIcon className="h-4 w-4" />}
                autoComplete="email"
              />
              <Input
                label="Company (optional)"
                type="text"
                value={formData.company}
                onChange={(e) => updateField('company', e.target.value)}
                placeholder="Your company name"
                leftIcon={<BuildingOfficeIcon className="h-4 w-4" />}
              />
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="At least 8 characters"
                required
                leftIcon={<LockClosedIcon className="h-4 w-4" />}
                helperText="Minimum 8 characters"
                autoComplete="new-password"
              />
              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                placeholder="Repeat your password"
                required
                leftIcon={<LockClosedIcon className="h-4 w-4" />}
                autoComplete="new-password"
              />

              <label className="flex items-start gap-2.5 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded"
                  required
                />
                <span>
                  I agree to the{' '}
                  <Link href="#" className="text-primary-blue hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="#" className="text-primary-blue hover:underline">Privacy Policy</Link>
                </span>
              </label>

              <Button type="submit" variant="accent" className="w-full" loading={isLoading} size="lg">
                Create Account - It&apos;s Free
              </Button>
            </form>
          </div>

          <p className="text-center mt-6 text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-blue font-semibold hover:text-blue-800">
              Sign in
            </Link>
          </p>

          <p className="text-center mt-3 text-xs text-gray-400">
            By signing up, you acknowledge our commitment to GDPR, CAN-SPAM, and data privacy compliance.
          </p>
        </div>
      </div>
    </div>
  );
}
