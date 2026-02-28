import clientPromise from '@/lib/mongodb';
import { Post } from '@/lib/posts';

export type { Post };

const DB = 'blog';

export async function getAllPosts(): Promise<Post[]> {
  const client = await clientPromise;
  const posts = await client.db(DB).collection<Post>('naila-posts').find({}).toArray();
  return posts
    .map(({ _id, ...post }) => post as Post)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.categories.includes(category));
}

export async function getLatestPost(): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts[0] ?? null;
}
