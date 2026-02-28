export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import {
  Linkedin,
  Github,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import AdminControl from "@/components/admin-control";
import clientPromise from "@/lib/mongodb";

async function getAboutData() {
  const client = await clientPromise;
  const doc = await client
    .db("blog")
    .collection("naila-about")
    .findOne({ id: "about" });
  if (!doc) return null;
  const { _id, ...data } = doc;
  return data;
}

export default async function About() {
  const data = await getAboutData();

  if (!data) return <div>Loading...</div>;

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 z-10">
        <AdminControl showEditAbout={true} />
      </div>

      <div className="grid md:grid-cols-[1fr_2fr] gap-12 animate-in fade-in duration-700">
        {/* Left Column: Profile */}
        <aside className="space-y-8">
          <div className="relative w-48 h-48 mx-auto md:mx-0 bg-gray-100 overflow-hidden rounded-sm">
            <Image
              src="/profile-pic.jpg"
              alt="Profile Photo"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-2xl font-bold tracking-tight">{data.name}</h1>
            <p className="text-gray-800 font-light">{data.role}</p>

            <div className="flex gap-4 justify-center md:justify-start pt-2">
              {data.socials?.linkedin && (
                <a
                  href={data.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {data.socials?.github && (
                <a
                  href={data.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {data.socials?.email && (
                <a
                  href={`mailto:${data.socials.email}`}
                  className="p-2 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </aside>

        {/* Right Column: The Internship & CV */}
        <section className="space-y-12">
          {/* The Internship */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-widest border-b border-black pb-2">
              The Internship
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-xs text-gray-600 uppercase tracking-wider">
                  Company
                </span>
                <p className="font-medium">{data.company}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-600 uppercase tracking-wider">
                  Location
                </span>
                <div className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3 h-3" /> {data.location}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-600 uppercase tracking-wider">
                  Role
                </span>
                <div className="flex items-center gap-1 font-medium">
                  <Briefcase className="w-3 h-3" /> {data.jobTitle}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-600 uppercase tracking-wider">
                  Duration
                </span>
                <p className="font-medium">{data.duration}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 border border-gray-100">
              <h3 className="font-bold mb-3 text-sm">Main Goals</h3>
              <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
                {data.goals.map((goal: string, index: number) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-widest border-b border-gray-200 pb-2">
              Education
            </h2>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-50 rounded-full mt-1">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold">{data.education.degree}</h3>
                <p className="text-gray-700 text-sm">{data.education.school}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {data.education.year}
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-widest border-b border-gray-200 pb-2">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-white border border-gray-200 text-xs font-medium hover:border-black transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
