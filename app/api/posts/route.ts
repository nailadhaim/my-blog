import { NextResponse } from 'next/server';
import { Post } from '@/lib/posts';
import clientPromise from '@/lib/mongodb';

const DB = 'blog';

export async function POST(request: Request) {
  try {
    const newPost: Post = await request.json();

    if (!newPost.title || !newPost.slug || !newPost.content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const col = client.db(DB).collection<Post>('naila-posts');

    const existing = await col.findOne({ slug: newPost.slug });
    if (existing) {
      return NextResponse.json(
        { error: 'A post with this slug already exists. Please choose a different title.' },
        { status: 409 }
      );
    }

    await col.insertOne(newPost as any);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error saving post:', error);
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }
}
