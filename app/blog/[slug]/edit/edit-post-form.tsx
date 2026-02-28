'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Post } from '@/lib/posts';

// Need to define category type locally or import it to be strict
// type Category = string; // Not needed really

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function EditPostForm({ post }: { post: Post }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]); // Dynamic categories
  
  const [formData, setFormData] = useState({
    title: post.title,
    slug: post.slug,
    date: post.date,
    categories: post.categories || [],
    description: post.description,
    content: post.content || '',
  });

  useEffect(() => {
    // Fetch tags
    const fetchTags = async () => {
        try {
            const res = await fetch('/api/tags');
            const data = await res.json();
            setAvailableCategories(data);
        } catch (error) {
            console.error("Failed to fetch tags", error);
        }
    };
    fetchTags();

    // Simple client-side protection for the admin route
    if (typeof window !== 'undefined') {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        if (!isAdmin) {
        router.push('/blog');
        }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/posts/${post.slug}`, {
        method: 'PUT', // Use PUT for update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      await response.json(); // Wait for json
      
      alert('Post updated successfully!');
      router.push(`/blog/${formData.slug}`); // Redirect to updated post (new slug)
      router.refresh(); // Ensure the new data is fetched
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors mb-2 group">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Cancel
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Edit Entry</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-bold uppercase tracking-wider">Title</label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value, slug: slugify(e.target.value)})}
            className="w-full p-3 bg-white border border-gray-200 focus:border-black outline-none transition-colors"
          />
        </div>

        {/* Slug (Read Only) & Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-bold uppercase tracking-wider">Slug</label>
            <input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              className="w-full p-3 bg-white border border-gray-200 focus:border-black outline-none transition-colors font-mono text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-bold uppercase tracking-wider">Date</label>
            <input
              id="date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full p-3 bg-white border border-gray-200 focus:border-black outline-none transition-colors"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
           <label htmlFor="category" className="text-sm font-bold uppercase tracking-wider">Categories (Select multiple)</label>
           <div className="flex flex-wrap gap-2">
             {availableCategories.length === 0 ? (
               <div className="text-sm text-gray-600">Loading categories...</div>
             ) : (
                availableCategories.map((cat) => {
                  const isSelected = formData.categories.includes(cat);
                  return (
                <button
                    key={cat}
                    type="button"
                    onClick={() => {
                        const newCats = isSelected
                            ? formData.categories.filter(c => c !== cat)
                            : [...formData.categories, cat];
                        setFormData({...formData, categories: newCats});
                    }}
                    className={`px-4 py-2 text-sm border transition-all duration-200 
                    ${isSelected
                        ? 'bg-black text-white border-black font-medium' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
                >
                    {cat}
                </button>
                )})
             )}
           </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-bold uppercase tracking-wider">Description</label>
          <textarea
            id="description"
            rows={3}
            required
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-3 bg-white border border-gray-200 focus:border-black outline-none transition-colors resize-none"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-bold uppercase tracking-wider">Content (Markdown)</label>
          <div className="bg-gray-50 border border-t-0 p-3 text-xs text-gray-600 font-mono mb-2 flex gap-4 overflow-x-auto border-gray-200">
             <span>**bold**</span>
             <span>*italic*</span>
             <span># Heading</span>
             <span>- List item</span>
             <span>[Link](url)</span>
             <span>`code`</span>
          </div>
          <textarea
            id="content"
            rows={15}
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className="w-full p-3 bg-white border border-gray-200 focus:border-black outline-none transition-colors font-mono text-sm"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Updating...
              </>
            ) : (
              <>
                Update Entry <Save className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
