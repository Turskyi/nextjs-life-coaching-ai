import logo from '@/assets/logo-no-bg.png';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { APP_NAME } from '../../constants';
import { auth } from '@clerk/nextjs/server';
import AnonymousAIChatButton from '@/components/AnonymousAiChatButton';
import Footer from '@/components/Footer';

export default function Home() {
  const { userId } = auth();

  if (userId) redirect('/goals');

  return (
    <main className="flex h-screen flex-col justify-evenly gap-5 ">
      <div className="flex h-screen flex-col items-center flex-grow justify-center gap-5">
        <div className="flex items-center gap-4">
          <Image src={logo} alt={`${APP_NAME} logo`} width={200} height={200} />
          <span className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            {APP_NAME}
          </span>
        </div>
        <p className="max-w-prose text-center">
          Discover your true potential with AI-powered life-coaching app. Set
          and achieve your goals with personalized guidance and insightful
          questions designed to help you find your own answers.
        </p>
        <Button size="lg" className="w-80 h-12" asChild>
          <Link href="/goals">View Goals</Link>
        </Button>
        <p>or</p>
        <AnonymousAIChatButton />
      </div>
      <Footer />
    </main>
  );
}
