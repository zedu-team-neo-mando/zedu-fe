"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "~/components/ui/dialog";
import { X } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { AddSkillsIcon } from "~/svgs";

interface Skill {
  id: string;
  title: string;
  description: string;
  icon: string;
  skill_id: string;
}

const skillsData: Skill[] = [
  {
    id: "1",
    skill_id: "1",
    title: "Telegram Monitor",
    description: "The bot will monitor your Telegram for specific activities.",
    icon: "/icons/telegram.svg",
  },
  {
    id: "2",
    skill_id: "2",
    title: "Gmail Access",
    description:
      "Let the AI colleague send, read, or monitor emails on behalf of the user via Gmail.",
    icon: "/icons/gmail.svg",
  },
  {
    id: "3",
    skill_id: "3",
    title: "Translation",
    description:
      "Let the AI colleague translate texts from any source to any target language.",
    icon: "/icons/translation.svg",
  },
];

export default function AddSkillDialog({ openChange, setOpenChange }: any) {
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  const toggleSkill = (skill: Skill) => {
    setSelectedSkills((prev) => {
      const exists = prev?.find((s) => s.id === skill.skill_id);
      return exists
        ? prev.filter((s) => s.id !== skill.skill_id)
        : [...prev, skill];
    });
  };

  const handleSave = () => {
    // Save to backend or global state
  };

  return (
    <Dialog open={openChange} onOpenChange={setOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-primary-500 text-white px-10">
          Add a skill
          <AddSkillsIcon />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        {/* HEADER */}
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b">
          <DialogTitle className="text-lg font-semibold">
            Add a Skill to <span className="italic">‘Juno’</span>
          </DialogTitle>
          <DialogClose asChild>
            <button className="p-1 rounded hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="flex">
          {/* LEFT FILTER */}
          <aside className="w-56 border-r p-4">
            <h3 className="text-sm font-medium mb-4">Filter by Category</h3>
            <ul className="space-y-2">
              <li className="text-purple-600 font-medium">All</li>
              <li className="text-gray-600">CRM (4)</li>
              <li className="text-gray-600">DevOps (2)</li>
              <li className="text-gray-600">Marketing (4)</li>
              <li className="text-gray-600">Productivity (4)</li>
              <li className="text-gray-600">Sales (4)</li>
            </ul>
          </aside>

          {/* RIGHT MAIN */}
          <div className="flex-1 flex flex-col">
            {/* SEARCH + SORT */}
            <div className="flex items-center justify-between border-b p-4">
              <Input placeholder="Find a Skill" className="w-72" />
              <Button
                variant="outline"
                className="flex items-center gap-1 text-sm"
              >
                Sort By
              </Button>
            </div>

            {/* SKILL CARDS */}
            <div className="grid grid-cols-2 gap-4 p-4 overflow-y-auto max-h-[500px]">
              {skillsData.map((skill) => {
                const isSelected = selectedSkills.some(
                  (s) => s.id === skill.skill_id
                );
                return (
                  <div
                    key={skill.skill_id}
                    className={`border rounded-lg p-4 flex items-start justify-between cursor-pointer hover:border-purple-500 ${
                      isSelected ? "border-purple-500 bg-purple-50" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <img src={skill.icon} alt="" className="w-6 h-6 mt-1" />
                      <div>
                        <h4 className="font-medium">{skill.title}</h4>
                        <p className="text-sm text-gray-500">
                          {skill.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSkill(skill)}
                      className="text-purple-600 text-sm font-medium"
                    >
                      {isSelected ? "✓ Selected" : "+ Select"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SELECTED SKILLS BAR */}
        {selectedSkills.length > 0 && (
          <div className="border-t p-4 flex items-center justify-between bg-white">
            <div className="flex gap-2 overflow-x-auto">
              {selectedSkills.map((skill) => (
                <div
                  key={skill.skill_id}
                  className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full border border-purple-200"
                >
                  <img src={skill.icon} alt="" className="w-4 h-4" />
                  <span className="text-sm">{skill.title}</span>
                </div>
              ))}
            </div>
            <Button onClick={handleSave} className="bg-purple-600 text-white">
              Add Skills
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
