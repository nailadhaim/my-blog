import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB = 'blog';

export async function GET() {
  try {
    const client = await clientPromise;
    const doc = await client.db(DB).collection('naila-about').findOne({ id: 'about' });
    if (!doc) return NextResponse.json(null);
    const { _id, ...data } = doc;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch about data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    await client.db(DB).collection('naila-about').updateOne(
      { id: 'about' },
      { $set: { id: 'about', ...data } },
      { upsert: true }
    );
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update about data' }, { status: 500 });
  }
}
