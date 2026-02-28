import { NextResponse } from 'next/server';
import { Post } from '@/lib/posts';
import clientPromise from '@/lib/mongodb';

const DB = 'blog';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const client = await clientPromise;
    const result = await client.db(DB).collection('naila-posts').deleteOne({ slug });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const body = await request.json();
    const { title, slug: newSlug, date, category, categories, description, content } = body;

    const client = await clientPromise;
    const col = client.db(DB).collection<Post>('naila-posts');

    const existing = await col.findOne({ slug });
    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const validCategories = categories || (category ? [category] : []);
    const finalSlug = newSlug && newSlug.trim() ? newSlug.trim() : slug;

    const updatedPost = {
      ...existing,
      title,
      slug: finalSlug,
      date,
      categories: validCategories,
      description,
      content,
    };

    await col.replaceOne({ slug }, updatedPost);

    const { _id, ...postWithoutId } = updatedPost as any;
    return NextResponse.json(postWithoutId);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}
