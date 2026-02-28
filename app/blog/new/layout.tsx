// app/blog/new/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add New Post | Naila Portfolio',
};

export default function NewPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
