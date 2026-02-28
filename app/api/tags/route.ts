import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB = 'blog';
const DEFAULT_TAGS = ['Power BI', 'SAP', 'Integration', 'Extra Tasks'];

async function getTags(): Promise<string[]> {
  const client = await clientPromise;
  const doc = await client.db(DB).collection('naila-tags').findOne({ id: 'tags' });
  return doc?.tags ?? DEFAULT_TAGS;
}

async function saveTags(tags: string[]) {
  const client = await clientPromise;
  await client.db(DB).collection('naila-tags').updateOne(
    { id: 'tags' },
    { $set: { id: 'tags', tags } },
    { upsert: true }
  );
}

export async function GET() {
  const tags = await getTags();
  return NextResponse.json(tags);
}

export async function POST(request: Request) {
  try {
    const { tag } = await request.json();
    if (!tag || typeof tag !== 'string') {
      return NextResponse.json({ error: 'Invalid tag' }, { status: 400 });
    }

    const tags = await getTags();
    if (!tags.includes(tag)) {
      tags.push(tag);
      await saveTags(tags);
    }

    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add tag' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { tag } = await request.json();

    // Remove from tags list
    let tags = await getTags();
    tags = tags.filter(t => t !== tag);
    await saveTags(tags);

    // Remove tag from all posts
    const client = await clientPromise;
    await client.db(DB).collection('naila-posts').updateMany(
      {},
      { $pull: { categories: tag } } as any
    );

    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
}
