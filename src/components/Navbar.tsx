'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { User } from 'next-auth';
import { Button } from './ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [isLoggedIn, setIsLoggedIn] = useState(!!session);
  const pathname = usePathname()

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNavigating, setIsNavigating] = useState<'' | 'login' | 'register' | null>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ redirect: false }); // prevent auto redirect
    router.push('/'); // manually redirect to homepage
  };
  const handleClick = () => {
    if (!isLoggedIn) {
      router.push('/signup');
    } else {
      if (pathname === '/') {
        router.push('/dashboard');
      } else if (pathname === '/dashboard') {
        router.push('/');
      }
    }
  };
  const getlabel = () =>{
    if (!isLoggedIn) {
      return 'Register'
    } else {
      if (pathname === '/') {
        return 'Dashboard'
      } else if (pathname === '/dashboard') {
        return 'Home'
      }
    }
  }
  const handleNavigate = async (path: string, key: typeof isNavigating) => {
    setIsNavigating(key);
    router.push(path);
  };

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/" className="text-xl font-bold">
          True Feedback
        </Link>

        {session ? (
          <div className="flex items-center gap-4 flex-wrap">
            <span>
              Welcome, <strong>{user.username || user.email}</strong>
            </span>
            <Button
              onClick={() => handleClick()}
              className="bg-slate-100 text-black"
              variant="outline"
              disabled={isNavigating === ''}
            >
              {isNavigating === '' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                getlabel()
              )}
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-slate-100 text-black"
              variant="outline"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Logout'
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4 flex-wrap">
            <Button
              onClick={() => handleNavigate('/sign-in', 'login')}
              className="bg-slate-100 text-black"
              variant="outline"
              disabled={isNavigating === 'login'}
            >
              {isNavigating === 'login' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Login'
              )}
            </Button>
            <Button
              onClick={() => handleNavigate('/sign-up', 'register')}
              className="bg-slate-100 text-black"
              variant="outline"
              disabled={isNavigating === 'register'}
            >
              {isNavigating === 'register' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Register'
              )}
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
