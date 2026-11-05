export interface AssignmentItem {
  id: string;
  title: string;
  dueDate?: string;
  points?: number;
  type: "project" | "quiz" | "homework" | "exam";
}

export interface CourseModule {
  id: string;
  weekNumber: number;
  title: string;
  channelName: string;
  description: string;
  topics: string[];
  assignments: AssignmentItem[];
  enabled: boolean;
  announcementPreview: string;
}

export interface OfficeHourSession {
  id: string;
  dayOfWeek: string;
  time: string;
  host: string;
  buzzRoomName: string;
  enabled: boolean;
}

export interface CourseSyllabusData {
  courseName: string;
  code: string;
  instructor: string;
  institution: string;
  term: string;
  durationWeeks: number;
  summary: string;
  modules: CourseModule[];
  officeHours: OfficeHourSession[];
  workspaceSlug: string;
  welcomeMessage: string;
}

export type LaunchStep =
  | "upload"
  | "extracting"
  | "review"
  | "provisioning"
  | "ready";

/**
 * Converts any title or topic string into a clean, Slack/Zedu-compliant channel name.
 * e.g., "Week 1: Fundamentals of React" -> "week-01-fundamentals-of-react"
 */
export function slugifyChannelName(text: string, prefix?: string): string {
  let clean = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);

  if (clean.endsWith("-")) {
    clean = clean.slice(0, -1);
  }

  if (prefix && !clean.startsWith(prefix)) {
    clean = `${prefix}-${clean}`;
  }

  return clean || "channel";
}

/**
 * Formats a two-digit week string (e.g. 1 -> "01", 12 -> "12").
 */
export function formatWeekSlug(weekNum: number): string {
  return weekNum < 10 ? `0${weekNum}` : `${weekNum}`;
}

/**
 * Extracts course code if present in the text (e.g. CS 106A, INFO 202, BOOTCAMP-401).
 */
export function extractCourseCode(text: string): string {
  const codeMatch = text.match(/\b([A-Z]{2,6}\s?-?\d{2,4}[A-Z]?)\b/);
  return codeMatch ? codeMatch[1].replace(/\s+/, " ") : "COURSE-101";
}

/**
 * Generates an initial announcement post pinned to each weekly channel.
 */
export function generateAnnouncementPost(
  weekNumber: number,
  title: string,
  topics: string[],
  assignments: AssignmentItem[]
): string {
  const topicList =
    topics.length > 0
      ? topics.map((t) => `• ${t}`).join("\n")
      : "• Core lectures and code walkthroughs";

  const assignmentSection =
    assignments.length > 0
      ? `\n\n📌 **Weekly Deliverables:**\n` +
        assignments
          .map(
            (a) => `• **${a.title}**${a.dueDate ? ` (Due: ${a.dueDate})` : ""}`
          )
          .join("\n")
      : "";

  return (
    `👋 **Welcome to Week ${weekNumber}: ${title}**\n\n` +
    `Use this channel for all lecture discussions, code questions, and peer collaboration.\n\n` +
    `🎯 **Topics Covered:**\n${topicList}${assignmentSection}\n\n` +
    `💡 *Join our weekly Buzz voice room for live TA debugging & peer study groups.*`
  );
}

/**
 * Generates an automated student welcome message and invite template.
 */
export function generateWelcomeTemplate(
  courseName: string,
  instructor: string,
  joinPath: string
): string {
  return (
    `Subject: Welcome to ${courseName} on Zedu Chat!\n\n` +
    `Dear Students,\n\n` +
    `Welcome to ${courseName}. We are using Zedu Chat for all class communications, ` +
    `weekly channel discussions, homework Q&A, and live Buzz voice office hours.\n\n` +
    `🚀 **Get Started in 1 Click:**\n` +
    `${joinPath}\n\n` +
    `All weekly channels (#week-01, #week-02), assignment schedules, and instructor ` +
    `announcements are pre-loaded in the workspace. No message history will ever be cut off.\n\n` +
    `Best regards,\n` +
    `${instructor}`
  );
}

/**
 * Parses unstructured or semi-structured syllabus text into a typed course model.
 */
export function parseRawSyllabusText(
  rawText: string,
  fileName?: string
): CourseSyllabusData {
  const lines = (rawText || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const firstFewLines = lines.slice(0, 10).join(" ");
  const courseCode = extractCourseCode(firstFewLines);

  // Extract Course Name
  let courseName = "Full-Stack Software Engineering & Applied AI";
  if (lines.length > 0) {
    const candidate = lines[0].replace(/^#+\s*/, "").trim();
    if (candidate.length > 5 && candidate.length < 80) {
      courseName = candidate;
    }
  }

  // Instructor
  let instructor = "Prof. Alex Mercer";
  for (const line of lines.slice(0, 15)) {
    const instMatch = line.match(
      /(?:instructor|professor|lecturer|teacher|taught by):\s*([A-Za-z\s.]+)/i
    );
    if (instMatch) {
      instructor = instMatch[1].trim();
      break;
    }
  }

  // Find Week / Module occurrences
  const moduleBlocks: {
    weekNum: number;
    rawTitle: string;
    contentLines: string[];
  }[] = [];
  const weekRegex = /^(?:week|module|unit|session)\s+(\d{1,2})[:.-]?\s*(.*)$/i;

  let currentBlock: {
    weekNum: number;
    rawTitle: string;
    contentLines: string[];
  } | null = null;

  for (const line of lines) {
    const match = line.match(weekRegex);
    if (match) {
      if (currentBlock) {
        moduleBlocks.push(currentBlock);
      }
      currentBlock = {
        weekNum: parseInt(match[1], 10),
        rawTitle: match[2]?.trim() || `Module ${match[1]} Overview`,
        contentLines: [],
      };
    } else if (currentBlock) {
      currentBlock.contentLines.push(line);
    }
  }
  if (currentBlock) {
    moduleBlocks.push(currentBlock);
  }

  // Fallback if no explicit "Week X" patterns were detected
  if (moduleBlocks.length === 0) {
    const fallbackWeeks = [
      { num: 1, title: "Course Onboarding & Development Setup" },
      { num: 2, title: "Modern JavaScript & TypeScript Fundamentals" },
      { num: 3, title: "React Component Architecture & Hooks" },
      { num: 4, title: "State Management & Next.js App Router" },
      { num: 5, title: "Database Schema & Server Actions" },
      { num: 6, title: "Authentication, RBAC & API Security" },
      { num: 7, title: "AI Model Integrations & Vector Search" },
      { num: 8, title: "Capstone Project Sprint & Peer Demos" },
    ];

    for (const fw of fallbackWeeks) {
      moduleBlocks.push({
        weekNum: fw.num,
        rawTitle: fw.title,
        contentLines: [
          `Topics in ${fw.title}`,
          "Hands-on lab exercise",
          "Weekly code review",
        ],
      });
    }
  }

  const modules: CourseModule[] = moduleBlocks.map((block) => {
    const weekSlug = formatWeekSlug(block.weekNum);
    const channelName = slugifyChannelName(block.rawTitle, `week-${weekSlug}`);

    // Parse subtopics
    const topics: string[] = [];
    const assignments: AssignmentItem[] = [];

    for (const l of block.contentLines) {
      if (
        l.match(/(?:due|assignment|homework|project|quiz|deliverable|lab)/i)
      ) {
        assignments.push({
          id: `asg_${block.weekNum}_${assignments.length + 1}`,
          title: l.replace(/^[-*•]\s*/, "").slice(0, 60),
          dueDate: `Week ${block.weekNum} Sunday, 11:59 PM`,
          points: 100,
          type: l.toLowerCase().includes("project")
            ? "project"
            : l.toLowerCase().includes("quiz")
              ? "quiz"
              : "homework",
        });
      } else if (l.length > 5 && l.length < 90 && !l.startsWith("#")) {
        topics.push(l.replace(/^[-*•]\s*/, ""));
      }
    }

    if (topics.length === 0) {
      topics.push(
        "Lecture fundamentals & code patterns",
        "Interactive group workshop",
        "Peer code feedback"
      );
    }

    if (assignments.length === 0) {
      assignments.push({
        id: `asg_${block.weekNum}_1`,
        title: `Week ${block.weekNum} Practical Lab & Check-in`,
        dueDate: `Week ${block.weekNum} Sunday, 11:59 PM`,
        points: 50,
        type: "homework",
      });
    }

    return {
      id: `mod_${block.weekNum}`,
      weekNumber: block.weekNum,
      title: block.rawTitle,
      channelName,
      description: `Discussions, lectures, and resources for ${block.rawTitle}`,
      topics: topics.slice(0, 4),
      assignments,
      enabled: true,
      announcementPreview: generateAnnouncementPost(
        block.weekNum,
        block.rawTitle,
        topics.slice(0, 4),
        assignments
      ),
    };
  });

  const officeHours: OfficeHourSession[] = [
    {
      id: "oh_1",
      dayOfWeek: "Tuesday",
      time: "4:00 PM - 5:30 PM",
      host: instructor,
      buzzRoomName: "buzz-office-hours-tue",
      enabled: true,
    },
    {
      id: "oh_2",
      dayOfWeek: "Thursday",
      time: "6:00 PM - 7:30 PM",
      host: "Lead Teaching Assistant",
      buzzRoomName: "buzz-ta-helpdesk-thu",
      enabled: true,
    },
  ];

  const workspaceSlug = slugifyChannelName(courseCode || courseName).slice(
    0,
    24
  );
  const joinPath = `/join/${workspaceSlug}`;

  return {
    courseName,
    code: courseCode,
    instructor,
    institution: "Zedu Academic Network",
    term: "Fall / Winter Cohort",
    durationWeeks: modules.length,
    summary: `Structured academic workspace with ${modules.length} weekly curriculum channels, homework trackers, and live Buzz voice office hours.`,
    modules,
    officeHours,
    workspaceSlug,
    welcomeMessage: generateWelcomeTemplate(courseName, instructor, joinPath),
  };
}
