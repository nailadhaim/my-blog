'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Tag = string;

// Remove hardcoded
// const tags: Tag[] = ['All', 'Wins', 'Reflections', 'Fails'];

export default function TagFilter({ initialTags }: { initialTags: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag') || 'All';
  // Use initialTags instead of local state for consistency with server data
  const tags = ['All', ...initialTags];

  const handleTagClick = (tag: Tag) => {
    if (tag === 'All') {
      router.push('/blog');
    } else {
      router.push(`/blog?tag=${tag}`);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-4">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 border rounded-full
              ${
                currentTag === tag
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-black hover:text-black'
              }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
