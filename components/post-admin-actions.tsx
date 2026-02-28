'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Loader2 } from 'lucide-react';

export default function PostAdminActions({ slug }: { slug: string }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage only on client side
    if (typeof window !== 'undefined') {
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    }
  }, []); // Run once on mount

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the post if clicked within a link
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      // Refresh the page or redirect
      router.refresh();
      // If we are on the post page, go back to list, else just refresh list
      if (window.location.pathname.includes(slug)) {
          router.push('/blog');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-md shadow-sm border border-gray-100 p-0.5" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/blog/${slug}/edit`);
        }}
        className="p-1.5 text-gray-600 hover:text-blue-600 transition-colors hover:bg-blue-50 rounded"
        title="Edit Post"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-3 bg-gray-200"></div>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 text-gray-600 hover:text-red-600 transition-colors hover:bg-red-50 rounded disabled:opacity-50"
        title="Delete Post"
      >
        {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
