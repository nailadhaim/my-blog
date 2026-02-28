// app/blog/[slug]/page.tsx
export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Hash, BarChart3, Database } from 'lucide-react';
import type { Metadata } from 'next';
import { getAllPosts, getPostsByCategory, Post } from '@/lib/posts-server'; // Correct import
import PostAdminActions from '@/components/post-admin-actions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug }  = await params;
  const post = (await getAllPosts()).find((p) => p.slug === slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Naila Portfolio`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug }  = await params;
  const post = (await getAllPosts()).find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-700">
      
      {/* Header */}
      <header className="space-y-6 text-center">
        <div className="flex justify-between items-center w-full">
            <Link href="/blog" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-black transition-colors mb-4 group">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Archive
            </Link>
            <PostAdminActions slug={slug} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-600 font-mono">
           <span className="flex items-center gap-2">
             <Calendar className="w-4 h-4" /> {post.date}
           </span>
           <div className="flex items-center gap-2 uppercase tracking-wide">
             <Hash className="w-4 h-4" /> 
             {post.categories?.join(', ') || ''}
           </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-none">
        
        {/* Description */}
        <div className="max-w-2xl mx-auto mb-10">
          <p className="text-xl md:text-2xl font-light text-gray-700 italic border-l-4 border-black pl-6 leading-relaxed">
            {post.description}
          </p>
        </div>
        
        {/* Main Content Box */}
        <div className="bg-white border border-gray-200 p-6 max-w-2xl mx-auto">
          <div className="prose prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-a:text-black hover:prose-a:text-gray-700 max-w-none text-gray-800">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>
               {post.content || "Content coming soon..."}
             </ReactMarkdown>
          </div>
        </div>
      </div>
    </article>
  );
}
