'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/StableMSALProvider';
import NotificationBell from '@/components/NotificationBell';

const SiteHeader = memo(function SiteHeader() {
  const { isAuthenticated, account, login, logout, profile } = useAuth();

  const name = account?.name || account?.username || 'User';

  return (
    <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="group flex items-center space-x-2">
              <div className="logo-container">
                <span className="logo-text">
                  <span className="logo-code">Code</span>
                  <span className="logo-chronicle">Chronicle</span>
                </span>
                <div className="logo-underline"></div>
              </div>
            </Link>
            <nav className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
              <Link href="/articles" className="hover:text-gray-900">Stories</Link>
              {isAuthenticated && profile?.roles?.some(role => role.toLowerCase().includes('admin')) && (
                <Link href="/setup" className="hover:text-gray-900">Setup</Link>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <span className="hidden sm:inline text-sm text-gray-700">{profile?.email || name}</span>
                {profile?.roles && (
                  <div className="hidden md:flex items-center space-x-1">
                    {profile.roles.slice(0,3).map((role, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {role}
                      </span>
                    ))}
                    {profile.roles.length! > 3 && (
                      <span className="text-xs text-gray-500">+{profile.roles.length! - 3} more</span>
                    )}
                  </div>
                )}
                <button
                  onClick={logout}
                  className="inline-flex items-center px-3 py-1.5 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={login}
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  Sign in / Create account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="bg-primary-50 border-t border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          {isAuthenticated ? (
            <p className="text-xs sm:text-sm text-primary-900">Welcome, {name}. You are signed in.</p>
          ) : (
            <p className="text-xs sm:text-sm text-primary-900">Discover inspiring stories. Sign in to share your own writing and connect with the community.</p>
          )}
        </div>
      </div>
    </header>
  );
});

export default SiteHeader;
