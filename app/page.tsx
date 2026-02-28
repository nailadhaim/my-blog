// app/page.tsx
export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Trophy,
  Calendar,
  AlertOctagon,
  BarChart3,
  Cable,
  Layers,
  CloudLightning,
} from "lucide-react";
import HeroText from "@/components/hero-text";
import { getLatestPost } from "@/lib/posts-server"; // Correct import for server function

export default async function Home() {
  const latestPost = await getLatestPost();
  if (!latestPost)
    return <div className="text-center py-20 text-gray-500">No posts yet.</div>;
  const primaryCategory = latestPost.categories?.[0] || "Reflections";

  return (
    <div className="space-y-32">
      <HeroText />

      <div className="border-t border-gray-200"></div>

      <section className="relative">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold tracking-tight">
            Latest Reflection.
          </h2>
          <Link
            href="/blog"
            className="group bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:scale-105 inline-flex items-center shadow-lg hover:shadow-xl"
          >
            View Archive{" "}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <Link
          href={`/blog/${latestPost.slug}`}
          className="block group perspective-1000 relative"
        >
          <article className="relative border border-gray-200 p-8 md:p-12 bg-white transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] hover:border-black overflow-hidden z-10">
            {/* Subtle background pattern on hover */}
            <div className="absolute inset-0 bg-grid-black opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3 text-xs font-mono text-gray-600 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5 text-black font-bold border border-black px-2 py-0.5 bg-white z-20">
                    {primaryCategory === "Power BI" && (
                      <BarChart3 className="w-3 h-3" />
                    )}
                    {primaryCategory === "CPI" && (
                      <CloudLightning className="w-3 h-3" />
                    )}
                    {primaryCategory === "Integration" && (
                      <Cable className="w-3 h-3" />
                    )}
                    {primaryCategory === "Extra Tasks" && (
                      <Layers className="w-3 h-3" />
                    )}
                    {primaryCategory === "Wins" && (
                      <Trophy className="w-3 h-3" />
                    )}
                    {primaryCategory === "Reflections" && (
                      <Calendar className="w-3 h-3" />
                    )}
                    {primaryCategory === "Fails" && (
                      <AlertOctagon className="w-3 h-3" />
                    )}
                    {primaryCategory}
                  </span>
                  <span>{latestPost.date}</span>
                </div>

                <h3 className="text-4xl md:text-5xl font-bold group-hover:underline decoration-2 underline-offset-8 decoration-black leading-tight">
                  {latestPost.title}
                </h3>

                <p className="text-xl text-gray-700 leading-relaxed max-w-2xl font-light group-hover:text-black transition-colors duration-300">
                  {latestPost.description}
                </p>
              </div>

              <div className="hidden md:flex flex-col items-end justify-between h-full min-h-[200px]">
                <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300 group-hover:scale-110">
                  <ArrowRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                </div>
              </div>
            </div>

            {/* Large Number decoration */}
            <div className="absolute -bottom-10 -right-4 font-mono text-[10rem] text-gray-50 font-bold leading-none pointer-events-none group-hover:text-gray-100 transition-colors duration-500 select-none">
              01
            </div>
          </article>
        </Link>
      </section>

      <div className="border-t border-gray-200"></div>

      {/* Business Context Section */}
      <section className="space-y-8">
        <h2 className="text-4xl font-bold tracking-tight">Business Context.</h2>
        <div className="bg-gray-50 p-8 rounded-sm border border-gray-100">
          <p className="text-lg leading-relaxed mb-8 max-w-3xl">
            Working in Business IT means connecting technical solutions to real
            operational needs. At ADB Safegate, I focus on optimizing workflows
            with Power BI and Cloud Platform Integration to drive smarter,
            data-driven decisions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-yellow-50 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">Power BI</h3>
              <p className="text-gray-600">
                Turning operational data into clear, interactive insights.
              </p>
            </div>
            <div className="bg-white p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-50 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <CloudLightning className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">
                CPI (Cloud Platform Integration)
              </h3>
              <p className="text-gray-600">
                Connecting cloud and on-premise systems to enable seamless data
                flow and automated workflows across platforms.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
