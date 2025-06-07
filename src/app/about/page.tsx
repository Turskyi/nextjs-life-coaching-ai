import { H1 } from '@/components/ui/H1';
import { H2 } from '@/components/ui/H2';
import { Metadata } from 'next';
import { APP_NAME, DEVELOPER_DOMAIN } from '../../../constants';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../assets/logo.png';
import screenshot1 from '../../../screenshots/screen1.png';
import screenshot2 from '../../../screenshots/screen2.png';
import screenshot3 from '../../../screenshots/screen3.png';
import screenshot4 from '../../../screenshots/screen4.png';
import screenshot5 from '../../../screenshots/screen5.png';

export const metadata: Metadata = {
  title: 'About',
};

export default function Page() {
  return (
    <section className="space-y-6">
      <div className="flex justify-start px-1 absolute left-1 top-2 sm:left-4 sm:top-4 sm:px-8">
        <Link href="/">
          <Image
            src={logo}
            alt="Life-Coaching AI Logo"
            width={50}
            height={50}
            className="rounded-full transition hover:opacity-80"
          />
        </Link>
      </div>
      <div className="container mx-auto p-4 mt-6 space-y-6 pt-4 sm:pt-0">
        <div className="space-y-3 mt-8">
          <H1>Welcome to {APP_NAME}</H1>
          <p className="text-lg">
            Life-Coaching AI is a free, private, and AI-powered app that helps
            you explore your goals, find direction, and gain clarity - whether
            you feel stuck, uncertain, or simply curious about your next step in
            life.
          </p>
        </div>

        <div className="space-y-4">
          <H2>Why Use Life-Coaching AI?</H2>
          <ul className="list-disc pl-6 space-y-2">
            <li>🧠 Chat with a professional-style AI life coach</li>
            <li>📝 Set and track your personal goals privately</li>
            <li>🔒 Chat anonymously — no account required</li>
            <li>📌 AI remembers your goals if you log in</li>
            <li>🧹 One-tap account + data deletion for full control</li>
            <li>🌑 Calm, dark-mode-first interface</li>
            <li>🌍 Ukrainian support coming in 2025</li>
          </ul>
        </div>

        <div className="space-y-4">
          <H2>App Screenshots</H2>
          <p className="text-gray-600">
            Here’s what you can expect inside the app:
          </p>
          <div className="flex justify-center overflow-x-auto">
            <div className="flex w-max gap-2">
              <Image
                src={screenshot1}
                alt="Screenshot 1"
                width={250}
                height={500}
                className="rounded-lg"
              />
              <Image
                src={screenshot2}
                alt="Screenshot 2"
                width={250}
                height={500}
                className="rounded-lg"
              />
              <Image
                src={screenshot3}
                alt="Screenshot 3"
                width={250}
                height={500}
                className="rounded-lg"
              />
              <Image
                src={screenshot4}
                alt="Screenshot 4"
                width={250}
                height={500}
                className="rounded-lg"
              />
              <Image
                src={screenshot5}
                alt="Screenshot 5"
                width={250}
                height={500}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <H2>Resources</H2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <Link href="/privacy" className="text-blue-600 underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/support" className="text-blue-600 underline">
                Support Page
              </Link>
            </li>
            <li>
              <a
                href={`https://${DEVELOPER_DOMAIN}/#/support`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Developer Support
              </a>
            </li>
            <li>
              <a
                href="https://t.me/+ooDZkd_gKbFmOGM6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Telegram Support Group
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <H2>Ready to Get Started?</H2>
          <p className="text-md">
            Download Life-Coaching AI today and start your journey toward more
            clarity, confidence, and direction in life - one message at a time.
          </p>
        </div>
      </div>
    </section>
  );
}
