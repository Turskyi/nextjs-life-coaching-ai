'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';

export default function DeleteAccountPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // Clerk hook to get the authenticated user ID.
  const { userId } = useAuth();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);

    try {
      // Send the delete request to API route.
      const response = await fetch('/api/delete-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect after deletion.
        router.push('/account-deleted');
      } else {
        setError(result.error || '（。ˇ ⊖ˇ）♡ Failed to delete account');
      }
    } catch (err) {
      setError('An unexpected error occurred ٩(▀̿Ĺ̯▀̿ ̿٩)三');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Delete Account</h1>
      <p className="mb-4">
        Deleting your account is permanent and cannot be undone. When you delete
        your account, the following data will be removed:
      </p>
      <ul className="list-disc ml-6 mb-6">
        <li>Your profile information</li>
        <li>All your saved goals</li>
        <li>Any other personal data associated with your account</li>
      </ul>
      <p className="mb-6">
        After deleting your account, your data will be permanently removed from
        our servers. If you are sure, click the button below to delete your
        account.
      </p>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success ? (
        <p className="text-green-600 mb-4">
          Your account has been successfully deleted.
        </p>
      ) : (
        <Button
          onClick={handleDeleteAccount}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Deleting...' : 'Delete Account'}
        </Button>
      )}
    </div>
  );
}
