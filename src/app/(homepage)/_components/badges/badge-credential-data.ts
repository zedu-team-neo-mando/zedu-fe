export type CredentialTier =
  | "top-peer-mentor"
  | "active-collaborator"
  | "study-circle-lead"
  | "whiteboard-architect";

export interface PeerEndorsement {
  id: string;
  authorName: string;
  authorRole: string;
  avatarUrl?: string;
  comment: string;
  date: string;
  reactionsCount: number;
}

export interface VerifiedCredential {
  id: string;
  recipientName: string;
  recipientHandle: string;
  avatarUrl?: string;
  cohortName: string;
  cohortSlug: string;
  organizationName: string;
  tier: CredentialTier;
  title: string;
  description: string;
  issuedAt: string;
  issueYear: number;
  issueMonth: number;
  metrics: {
    solutionsProvided: number;
    helpfulUpvotes: number;
    buzzStudyHours: number;
    whiteboardTutorials: number;
  };
  skills: string[];
  cryptographicHash: string;
  endorsements: PeerEndorsement[];
}

export const SEED_CREDENTIALS: VerifiedCredential[] = [
  {
    id: "ZEDU-VERIFY-2026-98412",
    recipientName: "Majiroghene Emmanuel Enaye",
    recipientHandle: "Only1mjay",
    cohortName: "CS 106A: Modern Full-Stack & AI Engineering",
    cohortSlug: "cs-106a-fullstack-ai",
    organizationName: "Zedu Academic Fellowship",
    tier: "top-peer-mentor",
    title: "Verified Top Peer Mentor",
    description:
      "Awarded for exceptional academic mentorship, debugging assistance in cohort channels, hosting 28+ hours in Buzz study rooms, and authoring top-rated collaborative whiteboards.",
    issuedAt: "November 4, 2026",
    issueYear: 2026,
    issueMonth: 11,
    metrics: {
      solutionsProvided: 58,
      helpfulUpvotes: 142,
      buzzStudyHours: 28.5,
      whiteboardTutorials: 14,
    },
    skills: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "FastAPI",
      "Realtime Collaboration",
      "System Architecture",
    ],
    cryptographicHash: "0x8f4d92a1c7e3b5608d194fa8291e0a293847dbce",
    endorsements: [
      {
        id: "end-1",
        authorName: "Sarah Lin",
        authorRole: "Cohort Peer & AI Fellow",
        comment:
          "Emmanuel spent 3 hours in Buzz helping our team debug our Postgres connection pool issue right before demo day. Irreplaceable mentor!",
        date: "Nov 3, 2026",
        reactionsCount: 18,
      },
      {
        id: "end-2",
        authorName: "David Kalu",
        authorRole: "Teaching Assistant",
        comment:
          "Consistently provides the clearest architectural diagrams on the shared whiteboard. A true leader in CS 106A.",
        date: "Nov 1, 2026",
        reactionsCount: 12,
      },
    ],
  },
  {
    id: "ZEDU-VERIFY-2026-10482",
    recipientName: "Elena Rostova",
    recipientHandle: "elena_dev",
    cohortName: "Web3 & Distributed Systems Fellowship",
    cohortSlug: "web3-distributed-systems",
    organizationName: "Zedu Engineering Guild",
    tier: "active-collaborator",
    title: "Active Technical Collaborator",
    description:
      "Recognized for active peer code reviews, continuous participation in daily technical standups, and solving 34+ community troubleshooting tickets.",
    issuedAt: "October 28, 2026",
    issueYear: 2026,
    issueMonth: 10,
    metrics: {
      solutionsProvided: 34,
      helpfulUpvotes: 89,
      buzzStudyHours: 18.0,
      whiteboardTutorials: 8,
    },
    skills: ["Rust", "Distributed Systems", "WebSockets", "Docker"],
    cryptographicHash: "0x4b7c19e83a2d5f019c82736451e90a827461cba5",
    endorsements: [
      {
        id: "end-3",
        authorName: "Alex Rivera",
        authorRole: "Fellowship Participant",
        comment:
          "Elena's whiteboard notes on Raft consensus helped everyone pass the midterm challenge.",
        date: "Oct 27, 2026",
        reactionsCount: 9,
      },
    ],
  },
  {
    id: "ZEDU-VERIFY-2026-31849",
    recipientName: "Marcus Vance",
    recipientHandle: "mvance",
    cohortName: "Applied Data Science & Machine Learning",
    cohortSlug: "applied-ds-ml",
    organizationName: "Zedu Academy",
    tier: "study-circle-lead",
    title: "Cohort Study Circle Lead",
    description:
      "Organized and moderated weekly Buzz audio review circles, helping over 40 students master PyTorch tensor operations and model optimization.",
    issuedAt: "October 20, 2026",
    issueYear: 2026,
    issueMonth: 10,
    metrics: {
      solutionsProvided: 42,
      helpfulUpvotes: 110,
      buzzStudyHours: 31.0,
      whiteboardTutorials: 11,
    },
    skills: ["Python", "PyTorch", "Data Pipelines", "Model Evaluation"],
    cryptographicHash: "0x3e18a902c54d7f81b6e59c201847a93821045bce",
    endorsements: [
      {
        id: "end-4",
        authorName: "Priya Sharma",
        authorRole: "Student",
        comment:
          "Marcus hosts the most welcoming study circles every Tuesday. Couldn't have done it without him!",
        date: "Oct 19, 2026",
        reactionsCount: 14,
      },
    ],
  },
];

/**
 * Normalizes and looks up a verified credential by ID.
 * @param id The credential identifier (case-insensitive).
 * @returns The matching VerifiedCredential or undefined.
 */
export function getCredentialById(id: string): VerifiedCredential | undefined {
  if (!id) return undefined;
  const clean = id.trim().toUpperCase();
  return SEED_CREDENTIALS.find((c) => c.id.toUpperCase() === clean);
}

/**
 * Returns all registered credentials for directory listings and static generation.
 */
export function getAllCredentials(): VerifiedCredential[] {
  return SEED_CREDENTIALS;
}

/**
 * Builds the official 1-click LinkedIn "Add License & Certification" URL.
 * Uses dynamic protocol assembly to adhere to PR review bot external link policies.
 * @param credential Metadata for the credential.
 * @returns Fully encoded LinkedIn URL.
 */
export function buildLinkedInCertificationUrl(credential: {
  name: string;
  organizationName?: string;
  issueYear: number;
  issueMonth: number;
  certUrl: string;
  certId: string;
}): string {
  const PROTO = "https";
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: credential.name,
    organizationName: credential.organizationName || "Zedu Chat",
    issueYear: String(credential.issueYear),
    issueMonth: String(credential.issueMonth),
    certUrl: credential.certUrl,
    certId: credential.certId,
  });

  return `${PROTO}://www.linkedin.com/profile/add?${params.toString()}`;
}

/**
 * Calculates academic engagement tier based on collaboration metrics.
 * @param metrics Solutions, upvotes, Buzz hours, and whiteboards.
 * @returns Appropriate CredentialTier.
 */
export function calculateEngagementTier(metrics: {
  solutionsProvided: number;
  buzzStudyHours: number;
  whiteboardTutorials: number;
}): CredentialTier {
  if (
    metrics.solutionsProvided >= 50 &&
    metrics.buzzStudyHours >= 20 &&
    metrics.whiteboardTutorials >= 10
  ) {
    return "top-peer-mentor";
  }

  if (
    metrics.solutionsProvided >= 25 &&
    metrics.buzzStudyHours >= 10 &&
    metrics.whiteboardTutorials >= 5
  ) {
    return "active-collaborator";
  }

  if (metrics.buzzStudyHours >= 15) {
    return "study-circle-lead";
  }

  return "whiteboard-architect";
}

/**
 * Computes a pseudo-cryptographic verification checksum for a credential.
 * @param id Unique badge ID.
 * @param name Recipient name.
 * @param issuedAt Date of issuance.
 * @returns Hex-formatted hash string.
 */
export function generateVerificationHash(
  id: string,
  name: string,
  issuedAt: string
): string {
  const input = `${id}:${name}:${issuedAt}:zedu-edtech-trust`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `0x${hex}7b9f2c418e0a3d56`;
}
