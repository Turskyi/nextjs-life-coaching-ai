'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { HOME } from '../../../constants';

export default function AccountDeletedPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-10 px-4 text-center">
      <h1 className="text-3xl font-bold mb-6">Account Deleted</h1>
      <p className="mb-4">
        Your account has been successfully deleted. We&apos;re sorry to see you
        go!
      </p>
      <p className="mb-6">
        If you ever change your mind, feel free to sign up again.
      </p>

      <div className="space-x-4">
        <Button onClick={() => router.push(HOME)} variant="default">
          Go to Home
        </Button>
        <Button onClick={() => router.push('/sign-up')} variant="secondary">
          Sign Up Again
        </Button>
      </div>
    </div>
  );
}
