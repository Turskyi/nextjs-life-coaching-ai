import { H1 } from '@/components/ui/H1';
import { H2 } from '@/components/ui/H2';
import { Metadata } from 'next';
import { APP_NAME, DEVELOPER_DOMAIN } from '../../../constants';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../assets/logo.png';

export const metadata: Metadata = {
  title: 'Support',
};

export default function Page() {
  return (
    <section className="space-y-6">
      <div className="flex justify-start px-1 absolute left-1 top-2 sm:left-4 sm:top-4 sm:px-8">
        <Link href="/">
          <Image
            src={logo}
            alt={`${APP_NAME} Logo`}
            width={50}
            height={50}
            className="rounded-full transition hover:opacity-80"
          />
        </Link>
      </div>
      <div className="container mx-auto p-4 mt-6 space-y-6 pt-4 sm:pt-0">
        <div className="space-y-3 mt-8">
          <H1>Support for &quot;{APP_NAME}&quot; App</H1>
          <p>
            We&apos;re here to help. If you’re experiencing issues with the app,
            have questions about your data, or want to share feedback - this is
            the place to start.
          </p>
        </div>

        <div className="space-y-3">
          <H2>Contact Us</H2>
          <p>If you need assistance, feel free to reach out:</p>
          <p>
            <a href={`mailto:support@${DEVELOPER_DOMAIN}`}>
              support@{DEVELOPER_DOMAIN}
            </a>
          </p>
          <p>
            Join our support group on Telegram:{' '}
            <a
              href="https://t.me/+ooDZkd_gKbFmOGM6"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Life-Coaching AI Telegram Group
            </a>
          </p>
          <p>
            Or reach out using the contact form on the developer’s support page:{' '}
            <a
              href={`https://${DEVELOPER_DOMAIN}/#/support`}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {DEVELOPER_DOMAIN}/support
            </a>
          </p>
        </div>

        <div className="space-y-3">
          <H2>Account and Data Management</H2>
          <p>
            To delete your account and all associated data, please visit the{' '}
            <a href="/instruction" className="text-blue-600 underline">
              Account Deletion Instructions
            </a>{' '}
            page.
          </p>
        </div>

        <div className="space-y-3">
          <H2>Privacy Policy</H2>
          <p>
            You can view our full privacy policy here:{' '}
            <a href="/privacy" className="text-blue-600 underline">
              Privacy Policy
            </a>
          </p>
        </div>

        <div className="space-y-3">
          <H2>Common Questions</H2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Is the app really free? - Yes, there are no charges or in-app
              purchases.
            </li>
            <li>
              Do I need to create an account to use the chat? - No, anonymous
              chat is available without logging in.
            </li>
            <li>
              Can I manage or delete my goals? - Yes, logged-in users can add,
              edit, and delete goals freely.
            </li>
            <li>
              How do I delete my data? - Follow the link above to permanently
              remove your account and data.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
