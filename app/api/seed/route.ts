/**
 * ONE-TIME SEED ROUTE
 * Call GET /api/seed once after deploying to populate MongoDB from the bundled JSON files.
 * It is safe to call multiple times (uses upsert for posts, overwrites tags/about).
 */
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import clientPromise from '@/lib/mongodb';

const DB = 'blog';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB);

    // Seed posts
    const postsFile = path.join(process.cwd(), 'data', 'posts.json');
    if (fs.existsSync(postsFile)) {
      const posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
      for (const post of posts) {
        await db.collection('naila-posts').updateOne(
          { slug: post.slug },
          { $setOnInsert: post },
          { upsert: true }
        );
      }
    }

    // Seed tags
    const tagsFile = path.join(process.cwd(), 'data', 'tags.json');
    if (fs.existsSync(tagsFile)) {
      const tags = JSON.parse(fs.readFileSync(tagsFile, 'utf8'));
      await db.collection('naila-tags').updateOne(
        { id: 'tags' },
        { $set: { id: 'tags', tags } },
        { upsert: true }
      );
    }

    // Seed about
    const aboutFile = path.join(process.cwd(), 'data', 'about.json');
    if (fs.existsSync(aboutFile)) {
      const about = JSON.parse(fs.readFileSync(aboutFile, 'utf8'));
      await db.collection('naila-about').updateOne(
        { id: 'about' },
        { $set: { id: 'about', ...about } },
        { upsert: true }
      );
    }

    return NextResponse.json({ success: true, message: 'Database seeded successfully.' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seeding failed', detail: String(error) }, { status: 500 });
  }
}
