'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, LogOut, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ManageTags from './manage-tags';

type AdminControlProps = {
  showNewPost?: boolean;
  showManageTags?: boolean;
  showEditAbout?: boolean;
};

export default function AdminControl({ 
  showNewPost = false, 
  showManageTags = false, 
  showEditAbout = false 
}: AdminControlProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if we are in the browser
    if (typeof window !== 'undefined') {
      const storedAdmin = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(storedAdmin);
    }
  }, []);

  const handleLogin = async () => {
    const password = prompt("Enter Admin Password:");
    if (!password) return;

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        localStorage.setItem('isAdmin', 'true');
        setIsAdmin(true);
        router.refresh();
        alert("Welcome Admin!");
      } else {
        alert("Incorrect password.");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
    router.refresh(); // Refresh to hide edit/delete buttons
  };

  return (
    <div className="flex items-center gap-4">
      {isAdmin ? (
        <>
          {showNewPost && (
            <Link href="/blog/new" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-black transition-colors bg-gray-100 px-3 py-1.5 rounded-sm hover:bg-gray-200 gap-2">
              New Post <Plus className="w-3 h-3" />
            </Link>
          )}
          {showEditAbout && (
            <Link href="/about/edit" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-black transition-colors bg-gray-100 px-3 py-1.5 rounded-sm hover:bg-gray-200 gap-2">
              Edit About
            </Link>
          )}
          {showManageTags && <ManageTags />}
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-700 hover:text-black transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </>
      ) : (
        <button 
            onClick={handleLogin}
            className="p-2 text-gray-700 hover:text-black transition-colors bg-gray-50 hover:bg-gray-100 rounded-full"
            title="Admin Login"
            aria-label="Admin Login"
        >
            <Lock className="w-5 h-5" />
            <span className="sr-only">Admin Login</span>
        </button>
      )}
    </div>
  );
}
