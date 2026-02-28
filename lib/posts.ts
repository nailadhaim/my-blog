// Export the types for use anywhere (client or server)
// But don't export fs usage!

export interface Post {
  slug: string;
  title: string;
  date: string;
  categories: string[]; // Changed from category: string
  description: string;
  image?: string;
  content?: string; // Markdown content
}

// Client-safe functions/constants if any
// This is deprecated for dynamic tags, but kept for fallback
export const POST_CATEGORIES = ['Power BI', 'SAP', 'Integration', 'Extra Tasks'] as const;
