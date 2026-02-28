export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Trophy,
  Calendar,
  AlertOctagon,
  BarChart3,
  Database,
  Cable,
  Layers,
  CheckCircle,
  CloudLightning,
} from "lucide-react";
import TagFilter from "@/components/tag-filter";
import PostAdminActions from "@/components/post-admin-actions"; // Import the actions component
import AdminControl from "@/components/admin-control";
import { getAllPosts, getPostsByCategory } from "@/lib/posts-server";
import { getTags } from "@/lib/tags-server";
import { Post } from "@/lib/posts";

// This is now a Server Component
export default async function BlogPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const currentTag =
    typeof searchParams.tag === "string" ? searchParams.tag : "All";
  const tags = await getTags();

  let displayedPosts: Post[];
  if (currentTag && currentTag !== "All") {
    displayedPosts = await getPostsByCategory(currentTag);
  } else {
    displayedPosts = await getAllPosts();
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="mb-12 border-b border-black pb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
            The Archive.
          </h1>
          <p className="text-gray-600 font-light text-lg max-w-2xl">
            A collection of business insights, SAP best practices, and Power BI
            hacks.
          </p>
        </div>
        <div className="shrink-0 pt-1">
          <AdminControl showNewPost={true} showManageTags={true} />
        </div>
      </div>

      <Suspense
        fallback={
          <div className="h-10 w-full bg-gray-50 animate-pulse rounded-full"></div>
        }
      >
        <TagFilter initialTags={tags} />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayedPosts.map((post) => (
          <article
            key={post.slug}
            className="relative border border-gray-200 p-6 hover:border-black transition-all duration-300 bg-white hover:shadow-sm group h-full flex flex-col items-start"
          >
            <div className="flex items-center gap-3 text-xs font-mono text-gray-600 mb-3 uppercase tracking-widest w-full relative z-20 flex-wrap">
              <div className="flex flex-wrap gap-2">
                {post.categories.map((cat) => (
                  <span
                    key={cat}
                    className="flex items-center gap-1.5 text-black font-bold border border-black px-2 py-0.5 whitespace-nowrap"
                  >
                    {cat === "Power BI" && <BarChart3 className="w-3 h-3" />}
                    {cat === "SAP" && <Database className="w-3 h-3" />}
                    {cat === "CPI" && <CloudLightning className="w-3 h-3" />}
                    {cat === "Extra Tasks" && <Layers className="w-3 h-3" />}
                    {cat === "Reflections" && <Calendar className="w-3 h-3" />}
                    {cat}
                  </span>
                ))}
              </div>
              <span className="ml-auto flex items-center gap-2">
                {post.date}
                <div className="z-30 relative">
                  <PostAdminActions slug={post.slug} />
                </div>
              </span>
            </div>

            {/* Make the whole card clickable largely by wrapping title and description, or using absolute link overlay */}
            <Link
              href={`/blog/${post.slug}`}
              className="absolute inset-0 z-10"
              aria-label={`Read ${post.title}`}
            >
              <span className="sr-only">Read more</span>
            </Link>

            <h3 className="text-2xl font-bold mb-2 group-hover:underline decoration-1 underline-offset-4 decoration-black w-full relative z-0">
              {post.title}
            </h3>

            <p className="text-gray-700 leading-relaxed line-clamp-3 mb-4 flex-grow relative z-0">
              {post.description}
            </p>

            <div className="mt-auto flex items-center text-xs font-medium text-black group-hover:translate-x-1 transition-transform relative z-0">
              Read More <ArrowRight className="ml-1 w-3 h-3" />
            </div>
          </article>
        ))}
      </div>

      {displayedPosts.length === 0 && (
        <div className="text-center py-20 text-gray-600 font-mono text-sm border border-dashed border-gray-200">
          No posts found for "{currentTag}".
        </div>
      )}
    </div>
  );
}
