import { getAllPosts } from '@/lib/posts-server';
import { notFound } from 'next/navigation';
import EditPostForm from './edit-post-form';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditPage({ params }: Props) {
  const { slug } = await params;
  const post = (await getAllPosts()).find((p) => p.slug === slug);
  
  if (!post) {
    notFound();
  }

  // Pass plain object to client component
  return <EditPostForm post={post} />;
}
