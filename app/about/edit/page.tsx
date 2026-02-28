"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditAbout() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    location: "",
    jobTitle: "",
    duration: "",
    goals: [""],
    education: {
      degree: "",
      school: "",
      year: "",
    },
    socials: {
      linkedin: "",
      github: "",
      email: "",
    },
    skills: [""],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/about");
        const data = await res.json();
        setFormData(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load about data", err);
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...formData.goals];
    newGoals[index] = value;
    setFormData((prev) => ({ ...prev, goals: newGoals }));
  };

  const addGoal = () => {
    setFormData((prev) => ({ ...prev, goals: [...prev.goals, ""] }));
  };

  const removeGoal = (index: number) => {
    const newGoals = formData.goals.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, goals: newGoals }));
  };

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      education: { ...prev.education, [name]: value },
    }));
  };

  const handleSocialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socials: {
        ...(prev.socials || { linkedin: "", github: "", email: "" }),
        [name]: value,
      },
    }));
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData((prev) => ({ ...prev, skills: newSkills }));
  };

  const addSkill = () => {
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, ""] }));
  };

  const removeSkill = (index: number) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, skills: newSkills }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Server error");
      router.refresh();
      router.push("/about");
    } catch (err) {
      alert("Failed to update About page");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit About Page</h1>
        <Link href="/about" className="text-sm underline">
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="space-y-4 border p-4 rounded-md">
          <h2 className="font-bold">Personal Info</h2>
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Role (Subtitle)</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium mb-3">Social Links</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.socials?.linkedin || ""}
                  onChange={handleSocialsChange}
                  className="w-full border p-2 rounded-md text-sm"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  GitHub URL
                </label>
                <input
                  type="text"
                  name="github"
                  value={formData.socials?.github || ""}
                  onChange={handleSocialsChange}
                  className="w-full border p-2 rounded-md text-sm"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.socials?.email || ""}
                  onChange={handleSocialsChange}
                  className="w-full border p-2 rounded-md text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Internship Info */}
        <div className="space-y-4 border p-4 rounded-md">
          <h2 className="font-bold">Internship / Job Info</h2>
          <div>
            <label className="block text-sm font-medium">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Goals</label>
            {formData.goals.map((goal, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => handleGoalChange(index, e.target.value)}
                  className="w-full border p-2 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeGoal(index)}
                  className="text-red-500"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addGoal}
              className="text-sm text-blue-600"
            >
              + Add Goal
            </button>
          </div>
        </div>

        {/* Education Info */}
        <div className="space-y-4 border p-4 rounded-md">
          <h2 className="font-bold">Education</h2>
          <div>
            <label className="block text-sm font-medium">Degree</label>
            <input
              type="text"
              name="degree"
              value={formData.education.degree}
              onChange={handleEducationChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">School</label>
            <input
              type="text"
              name="school"
              value={formData.education.school}
              onChange={handleEducationChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Year</label>
            <input
              type="text"
              name="year"
              value={formData.education.year}
              onChange={handleEducationChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-4 border p-4 rounded-md">
          <h2 className="font-bold">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-gray-100 p-1 rounded-md"
              >
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  className="bg-transparent w-24 border-b border-gray-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-red-500 text-xs"
                >
                  x
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSkill}
              className="px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-sm"
            >
              + Add Skill
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
