'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function InstructionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginRedirect = () => {
    // Redirect to the delete account page.
    router.push('/delete-account');
  };

  return (
    <div className="container mx-auto py-10 px-4 text-center">
      <h1 className="text-3xl font-bold mb-6">Account Deletion Instructions</h1>
      <p className="mb-4">
        To proceed with deleting your account, you must click the &quot;Login to
        Access Delete Account Page&quot; button below. This will direct you to
        the login page. After logging in, you will be able to access the page
        where you can delete your account.
      </p>
      <p className="mb-6">
        <strong>Important:</strong> Deleting your account will permanently
        remove all your data, including any goals you have created. Please
        ensure you have backed up any important information before proceeding.
      </p>
      <Button
        onClick={handleLoginRedirect}
        disabled={isLoading}
        variant="default"
      >
        Login to Access Delete Account Page
      </Button>
    </div>
  );
}
