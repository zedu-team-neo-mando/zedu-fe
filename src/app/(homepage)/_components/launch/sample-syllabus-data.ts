import { CourseSyllabusData } from "./syllabus-parser";

export const SAMPLE_COURSES: Record<string, CourseSyllabusData> = {
  fullstack: {
    courseName: "CS 106A: Modern Full-Stack Web & AI Engineering",
    code: "CS 106A",
    instructor: "Dr. Sarah Chen",
    institution: "Stanford Engineering Fellows",
    term: "Fall 2024",
    durationWeeks: 10,
    summary:
      "Comprehensive 10-week cohort covering TypeScript, React Server Components, Next.js App Router, distributed databases, and generative AI agents with live collaborative whiteboarding and Buzz voice office hours.",
    workspaceSlug: "cs106a-fall-2024",
    welcomeMessage:
      "Welcome to CS 106A on Zedu Chat! Your course workspace is equipped with weekly channel milestones, assignment dropboxes, and persistent lecture whiteboard replays.",
    officeHours: [
      {
        id: "oh_1",
        dayOfWeek: "Tuesday",
        time: "4:00 PM - 5:30 PM",
        host: "Dr. Sarah Chen",
        buzzRoomName: "buzz-faculty-office-hours",
        enabled: true,
      },
      {
        id: "oh_2",
        dayOfWeek: "Thursday",
        time: "6:00 PM - 8:00 PM",
        host: "Marcus Kim (Head TA)",
        buzzRoomName: "buzz-ta-debug-lab",
        enabled: true,
      },
    ],
    modules: [
      {
        id: "mod_1",
        weekNumber: 1,
        title: "Developer Environment & TypeScript Foundations",
        channelName: "week-01-typescript-foundations",
        description:
          "Node.js runtimes, strict TypeScript configs, package managers, and Git workflows.",
        topics: [
          "Modern JavaScript ESNext & TypeScript compiler setup",
          "Type inference, union types, interfaces & generics",
          "Git branching hygiene and pull request reviews",
        ],
        assignments: [
          {
            id: "asg_1_1",
            title: "Problem Set 1: Type-Safe Data Structures",
            dueDate: "Sunday, 11:59 PM",
            points: 100,
            type: "homework",
          },
        ],
        enabled: true,
        announcementPreview:
          "👋 Welcome to Week 1! Dive into modern TypeScript fundamentals and verify your local Node runtime setup.",
      },
      {
        id: "mod_2",
        weekNumber: 2,
        title: "React Component Architecture & Hooks",
        channelName: "week-02-react-architecture",
        description:
          "Component lifecycle, useState/useReducer, custom hooks, and memoization patterns.",
        topics: [
          "Declarative UI state machines & unidirectional data flow",
          "Custom hooks for async data polling & WebSockets",
          "Profiling re-renders with React Developer Tools",
        ],
        assignments: [
          {
            id: "asg_2_1",
            title: "Lab 2: Interactive Real-Time Collaborative Canvas",
            dueDate: "Sunday, 11:59 PM",
            points: 100,
            type: "project",
          },
        ],
        enabled: true,
        announcementPreview:
          "🚀 Week 2 is live. We are mastering React state composition and building reactive UI interfaces.",
      },
      {
        id: "mod_3",
        weekNumber: 3,
        title: "Next.js App Router & Server Components",
        channelName: "week-03-nextjs-app-router",
        description:
          "Server vs Client components, streaming SSR with Suspense, and SEO metadata.",
        topics: [
          "Hybrid rendering: static generation, ISR, and dynamic edge rendering",
          "Layout hierarchies, nested routing, and parallel slots",
          "Server actions and progressive form enhancement",
        ],
        assignments: [
          {
            id: "asg_3_1",
            title: "Project Milestone 1: Server-Rendered Academic Portal",
            dueDate: "Sunday, 11:59 PM",
            points: 150,
            type: "project",
          },
        ],
        enabled: true,
        announcementPreview:
          "⚡ Week 3 brings Next.js App Router deep-dives. Check the pinned resources for Server Component diagrams.",
      },
      {
        id: "mod_4",
        weekNumber: 4,
        title: "Database Modeling, Prisma & Server Actions",
        channelName: "week-04-database-server-actions",
        description:
          "Relational schema design, PostgreSQL indexing, connection pooling, and migrations.",
        topics: [
          "Relational schema modeling and foreign key constraints",
          "Prisma ORM transactions and automated migrations",
          "Optimistic UI updates with Server Actions",
        ],
        assignments: [
          {
            id: "asg_4_1",
            title: "Quiz 1: SQL Query Optimization & Indexing",
            dueDate: "Friday, 5:00 PM",
            points: 50,
            type: "quiz",
          },
        ],
        enabled: true,
        announcementPreview:
          "🗄️ Week 4: Databases and data integrity. Make sure your local PostgreSQL instances are connected.",
      },
      {
        id: "mod_5",
        weekNumber: 5,
        title: "Authentication, RBAC & API Security",
        channelName: "week-05-auth-security-rbac",
        description:
          "Session tokens, JWT validation, HTTP-only cookies, OAuth 2.0, and role policies.",
        topics: [
          "Authentication flows, CSRF protection & cookie security",
          "Multi-tenant role-based access control (RBAC)",
          "Rate-limiting and security headers",
        ],
        assignments: [
          {
            id: "asg_5_1",
            title: "Lab 5: Multi-Tenant Workspace Auth System",
            dueDate: "Sunday, 11:59 PM",
            points: 100,
            type: "homework",
          },
        ],
        enabled: true,
        announcementPreview:
          "🔒 Week 5: Security first! Implement bulletproof session guards and organization permission layers.",
      },
      {
        id: "mod_6",
        weekNumber: 6,
        title: "Real-Time WebSockets & Buzz Audio Rooms",
        channelName: "week-06-websockets-audio",
        description:
          "Pub/Sub message brokers, WebRTC audio streaming, presence detection, and heartbeat channels.",
        topics: [
          "Socket architecture, reconnect backoff, and room broadcasting",
          "WebRTC audio signaling for low-latency Buzz voice rooms",
          "Ephemeral typing indicators and user presence sync",
        ],
        assignments: [
          {
            id: "asg_6_1",
            title: "Midterm Capstone Sprint: Real-Time Chat Engine",
            dueDate: "Sunday, 11:59 PM",
            points: 200,
            type: "project",
          },
        ],
        enabled: true,
        announcementPreview:
          "🎙️ Week 6: Real-time sockets and audio channels! Test your Buzz voice connections in the TA test room.",
      },
      {
        id: "mod_7",
        weekNumber: 7,
        title: "Vector Embeddings & RAG AI Knowledge Bases",
        channelName: "week-07-vector-rag-ai",
        description:
          "Semantic search, vector databases, chunking strategies, and LLM orchestration.",
        topics: [
          "Generating dense vector embeddings for course materials",
          "Similarity search with pgvector and cosine distance",
          "Retrieval-Augmented Generation (RAG) prompts with citations",
        ],
        assignments: [
          {
            id: "asg_7_1",
            title: "Lab 7: AI Course Teaching Assistant Bot",
            dueDate: "Sunday, 11:59 PM",
            points: 120,
            type: "homework",
          },
        ],
        enabled: true,
        announcementPreview:
          "🤖 Week 7: Building intelligent AI course assistants that search past lecture archives.",
      },
      {
        id: "mod_8",
        weekNumber: 8,
        title: "Autonomous Agents & Function Calling",
        channelName: "week-08-autonomous-ai-agents",
        description:
          "Tool use, execution sandboxes, multi-agent coordination, and automated evaluation.",
        topics: [
          "Function calling schemas & structured output guarantees",
          "Agent loop execution: Observation, Thought, Action",
          "Safe code execution sandboxes & rate throttling",
        ],
        assignments: [
          {
            id: "asg_8_1",
            title: "Problem Set 4: Autonomous Bug-Fixing Agent",
            dueDate: "Sunday, 11:59 PM",
            points: 150,
            type: "project",
          },
        ],
        enabled: true,
        announcementPreview:
          "🧠 Week 8: Autonomous agents that inspect code repositories and trigger automated workflows.",
      },
      {
        id: "mod_9",
        weekNumber: 9,
        title: "Testing, CI/CD Pipelines & Performance Profiling",
        channelName: "week-09-testing-cicd-perf",
        description:
          "Unit testing, Playwright E2E suites, Lighthouse performance audits, and GitHub Actions.",
        topics: [
          "Test automation with Node test runner and Vitest",
          "Continuous Integration pipelines and automated security scanning",
          "Core Web Vitals optimization and bundle size reduction",
        ],
        assignments: [
          {
            id: "asg_9_1",
            title: "Lab 9: Automated Green-Check CI Workflow",
            dueDate: "Sunday, 11:59 PM",
            points: 100,
            type: "homework",
          },
        ],
        enabled: true,
        announcementPreview:
          "🧪 Week 9: Quality engineering. We run full E2E test suites and optimize Core Web Vitals.",
      },
      {
        id: "mod_10",
        weekNumber: 10,
        title: "Capstone Presentations & Public Demo Day",
        channelName: "week-10-capstone-demo-day",
        description:
          "Live student presentations, peer evaluations, project showcasing, and alumni networking.",
        topics: [
          "Live 5-minute capstone project demonstrations",
          "Peer review evaluations and instructor rubric scoring",
          "Publishing projects to the Zedu Showcase directory",
        ],
        assignments: [
          {
            id: "asg_10_1",
            title: "Final Capstone Submission & Video Walkthrough",
            dueDate: "Friday, 12:00 PM",
            points: 300,
            type: "project",
          },
        ],
        enabled: true,
        announcementPreview:
          "🎓 Week 10: Capstone Demo Day! All student teams present their production applications live on Buzz.",
      },
    ],
  },
};
