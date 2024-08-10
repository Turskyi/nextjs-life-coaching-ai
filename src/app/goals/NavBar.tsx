'use client';

import logo from '@/assets/logo-no-bg.png';
import AddEditGoalDialog from '@/components/AddEditGoalDialog';
import AIChatButton from '@/components/AIChatButton';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Plus } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { APP_NAME } from '../../../constants';

const LOGO_SIZE = 48;
const AVATAR_SIZE = '2.5rem';

export default function NavBar() {
  const { theme } = useTheme();

  const [showAddEditGoalDialog, setShowAddEditGoalDialog] = useState(false);

  return (
    <>
      <div className="p-4 shadow">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href="/goals" className="flex items-center gap-1">
            <Image
              src={logo}
              alt={`${APP_NAME} logo`}
              width={LOGO_SIZE}
              height={LOGO_SIZE}
            />
            <span className="font-bold">{APP_NAME}</span>
          </Link>
          <div className="flex items-center gap-2">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme: theme === 'dark' ? dark : undefined,
                elements: {
                  avatarBox: { width: AVATAR_SIZE, height: AVATAR_SIZE },
                },
              }}
            />
            <ThemeToggleButton />
            <Button onClick={() => setShowAddEditGoalDialog(true)}>
              <Plus size={20} className="mr-2" />
              Add Goal
            </Button>
            <AIChatButton />
          </div>
        </div>
      </div>
      <AddEditGoalDialog
        open={showAddEditGoalDialog}
        setOpen={setShowAddEditGoalDialog}
      />
    </>
  );
}
