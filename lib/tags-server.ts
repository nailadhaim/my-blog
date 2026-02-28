import clientPromise from '@/lib/mongodb';

const DB = 'blog';
const DEFAULT_TAGS = ['Power BI', 'SAP', 'Integration', 'Extra Tasks'];

export async function getTags(): Promise<string[]> {
  try {
    const client = await clientPromise;
    const doc = await client.db(DB).collection('naila-tags').findOne({ id: 'tags' });
    if (!doc) return DEFAULT_TAGS;
    return doc.tags ?? DEFAULT_TAGS;
  } catch {
    return DEFAULT_TAGS;
  }
}
