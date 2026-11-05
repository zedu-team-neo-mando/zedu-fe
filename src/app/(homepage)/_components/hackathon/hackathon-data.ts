export interface HackathonChannel {
  name: string;
  description: string;
  isPrivate?: boolean;
  category: "broadcast" | "matchmaking" | "mentors" | "teams" | "submissions";
  badge?: string;
}

export interface HackathonCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  channels: HackathonChannel[];
}

export interface MentorRequest {
  id: string;
  teamName: string;
  topic: string;
  category:
    | "AI/ML"
    | "Frontend"
    | "Backend"
    | "Design"
    | "DevOps"
    | "Pitch/Product";
  description: string;
  urgency: "low" | "medium" | "high";
  voiceRoom: string;
  status: "open" | "claimed" | "resolved";
  mentorName?: string;
  createdAt: string;
}

export interface SponsorshipApplication {
  eventName: string;
  organization: string;
  attendees: number;
  eventDate: string;
  organizerName: string;
  organizerEmail: string;
  track: string;
  notes?: string;
}

export interface HackathonTemplateConfig {
  eventName: string;
  slug: string;
  teamCount: number;
  enableAiMatchmaking: boolean;
  enableMentorQueue: boolean;
  enableTeamWhiteboards: boolean;
  tracks: string[];
}

export const SPONSORSHIP_TRACKS = [
  {
    id: "ai-track",
    title: "Best AI Application on Zedu",
    amount: "$1,000",
    description:
      "Awarded to the most impactful application leveraging Gemini / LLM models and collaborative tools.",
  },
  {
    id: "collab-track",
    title: "Best Realtime Collaboration Experience",
    amount: "$500",
    description:
      "Awarded to projects demonstrating innovative multiplayer, whiteboard, or voice room workflows.",
  },
  {
    id: "social-good",
    title: "Social Impact & Education Track",
    amount: "$500",
    description:
      "Awarded to solutions advancing educational equity, accessibility, or campus community engagement.",
  },
] as const;

export const DEFAULT_HACKATHON_CATEGORIES: HackathonCategory[] = [
  {
    id: "broadcast",
    name: "📢 Broadcast & Announcements",
    icon: "Megaphone",
    description:
      "Official event notifications, timeline alerts, and organizer announcements.",
    channels: [
      {
        name: "announcements",
        description:
          "Official keynote broadcasts, schedule updates, and prize announcements",
        category: "broadcast",
        badge: "Pinned",
      },
      {
        name: "rules-and-schedule",
        description:
          "Hackathon 48-hour timeline, judging rubrics, and submission checklists",
        category: "broadcast",
      },
      {
        name: "sponsor-booths",
        description:
          "API keys, developer perk codes, and sponsor mentorship challenges",
        category: "broadcast",
      },
    ],
  },
  {
    id: "matchmaking",
    name: "🤝 Team Matchmaking Hub",
    icon: "Users",
    description:
      "Automated skill-based matchmaking channels for solo hackers to form balanced squads.",
    channels: [
      {
        name: "find-team-ai",
        description:
          "LLM, NLP, PyTorch, fine-tuning, and prompt engineers seeking builders",
        category: "matchmaking",
        badge: "Popular",
      },
      {
        name: "find-team-frontend",
        description:
          "React, Next.js, Tailwind, and React Native frontend builders",
        category: "matchmaking",
      },
      {
        name: "find-team-design",
        description:
          "UI/UX designers, Figma architects, and pitch deck visual creators",
        category: "matchmaking",
      },
      {
        name: "find-team-general",
        description: "Generalist programmers, domain experts, and solo hackers",
        category: "matchmaking",
      },
    ],
  },
  {
    id: "mentors",
    name: "🆘 Interactive Mentor Helpdesk",
    icon: "LifeBuoy",
    description:
      "Dedicated helpdesk with native /call-mentor slash command queue and 1-click Buzz voice rooms.",
    channels: [
      {
        name: "call-mentor",
        description:
          "Interactive help queue with real-time status dispatch into private Buzz voice rooms",
        category: "mentors",
        badge: "Live Queue",
      },
      {
        name: "mentor-announcements",
        description:
          "Mentor shifts, office hours availability, and tech lead AMA slots",
        category: "mentors",
      },
    ],
  },
  {
    id: "submissions",
    name: "🏆 Submissions & Demo Day",
    icon: "Trophy",
    description:
      "Project showcase, GitHub link verifications, and final presentation links.",
    channels: [
      {
        name: "project-showcase",
        description:
          "Community gallery for teams to post 2-minute Loom demos and screenshots",
        category: "submissions",
      },
      {
        name: "submit-projects",
        description:
          "Official Devpost submission confirmation and presentation queue",
        category: "submissions",
        badge: "Required",
      },
    ],
  },
];

export const INITIAL_MENTOR_REQUESTS: MentorRequest[] = [
  {
    id: "req-1",
    teamName: "Team Nexus",
    topic: "React hydration mismatch in Next.js 15 client component",
    category: "Frontend",
    description:
      "We are getting a server/client markup mismatch error when rendering our dynamic map component on initial load.",
    urgency: "high",
    voiceRoom: "Buzz Voice #mentor-room-03",
    status: "claimed",
    mentorName: "Alex Chen (Staff Engineer @ Vercel)",
    createdAt: "3 mins ago",
  },
  {
    id: "req-2",
    teamName: "Team Solaris",
    topic: "FastAPI websocket disconnect on JWT expiration",
    category: "Backend",
    description:
      "Realtime audio socket drops connection after 15 minutes when token refreshes. Need assistance patching the socket handshake.",
    urgency: "medium",
    voiceRoom: "Buzz Voice #team-solaris-audio",
    status: "open",
    createdAt: "8 mins ago",
  },
  {
    id: "req-3",
    teamName: "Team Hyperloop",
    topic: "Vector search cosine similarity index tuning",
    category: "AI/ML",
    description:
      "Postgres pgvector queries are taking 800ms with HNSW index. Resolved after adjusting m=16 and ef_construction=64.",
    urgency: "low",
    voiceRoom: "Buzz Voice #mentor-room-01",
    status: "resolved",
    mentorName: "Sarah Lin (ML Engineer @ DeepMind)",
    createdAt: "22 mins ago",
  },
];

/**
 * Generates an event URL slug from the hackathon name.
 * @param eventName The user-provided event name.
 * @returns Clean kebab-cased slug.
 */
export function generateHackathonSlug(eventName: string): string {
  const clean = eventName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return clean || "hackathon-2026";
}

/**
 * Validates a student hackathon sponsorship application.
 * @param app Application input fields.
 * @returns Object with valid flag and field-specific errors.
 */
export function validateSponsorshipApplication(
  app: Partial<SponsorshipApplication>
): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!app.eventName || app.eventName.trim().length < 3) {
    errors.eventName = "Event name must be at least 3 characters long.";
  }

  if (!app.organization || app.organization.trim().length < 2) {
    errors.organization =
      "Please provide your university, club, or organizing entity.";
  }

  if (
    !app.attendees ||
    Number(app.attendees) < 20 ||
    Number(app.attendees) > 10000
  ) {
    errors.attendees = "Expected attendee count must be between 20 and 10,000.";
  }

  if (!app.organizerName || app.organizerName.trim().length < 2) {
    errors.organizerName = "Organizer name is required.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!app.organizerEmail || !emailRegex.test(app.organizerEmail)) {
    errors.organizerEmail = "Please provide a valid organizer contact email.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Creates dynamic team workspace channels for a hackathon.
 * @param teamCount Total teams to generate channels for.
 * @returns Array of private team channels.
 */
export function generateTeamChannels(teamCount: number): HackathonChannel[] {
  const count = Math.max(1, Math.min(teamCount, 30));
  const channels: HackathonChannel[] = [];

  const teamNames = [
    "nexus",
    "hyperloop",
    "solaris",
    "quantum",
    "velocity",
    "aurora",
    "pulsar",
    "apex",
    "vortex",
    "cipher",
    "zenith",
    "dynamo",
    "horizon",
    "genesis",
    "titan",
    "phoenix",
    "nebula",
    "catalyst",
    "stratos",
    "orbit",
  ];

  for (let i = 1; i <= count; i++) {
    const suffix = teamNames[(i - 1) % teamNames.length];
    const num = i.toString().padStart(2, "0");
    channels.push({
      name: `team-${num}-${suffix}`,
      description: `Private workspace: text chat, Buzz voice room, and collaborative whiteboard for Team ${num}`,
      isPrivate: true,
      category: "teams",
      badge: "Private",
    });
  }

  return channels;
}
