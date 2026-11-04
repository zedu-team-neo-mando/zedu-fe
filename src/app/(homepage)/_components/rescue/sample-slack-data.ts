import { ParsedSlackArchive } from "./slack-parser";

export const SAMPLE_SLACK_ARCHIVE: ParsedSlackArchive = {
  communityName: "Fullstack Web & AI Cohort 2024",
  channels: [
    {
      id: "C01GENERAL",
      name: "general",
      topic: "Cohort announcements and general developer discussions",
      purpose: "Main community hub for students and instructors",
      messageCount: 5,
    },
    {
      id: "C02REACT",
      name: "react-and-nextjs",
      topic: "Component architecture, Server Actions, and UI states",
      purpose: "Questions and tutorials on frontend frameworks",
      messageCount: 4,
    },
    {
      id: "C03DEBUG",
      name: "debugging-help",
      topic: "Code reviews, stack traces, and peer mentoring",
      purpose: "Drop code snippets and get unstuck",
      messageCount: 4,
    },
    {
      id: "C04WHITEBOARD",
      name: "whiteboard-sessions",
      topic: "Algorithm diagrams, system design architectures, and notes",
      purpose: "Collaborative whiteboard replays",
      messageCount: 3,
    },
  ],
  users: {
    U01SARAH: {
      id: "U01SARAH",
      name: "sarah.chen",
      realName: "Sarah Chen",
      displayName: "Sarah (Lead Instructor)",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      isBot: false,
    },
    U02MARCUS: {
      id: "U02MARCUS",
      name: "marcus.k",
      realName: "Marcus Kim",
      displayName: "Marcus Kim (TA)",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      isBot: false,
    },
    U03ELENA: {
      id: "U03ELENA",
      name: "elena.rodriguez",
      realName: "Elena Rodriguez",
      displayName: "Elena R.",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      isBot: false,
    },
    U04DAVID: {
      id: "U04DAVID",
      name: "david.o",
      realName: "David Okafor",
      displayName: "David Okafor",
      avatarUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      isBot: false,
    },
  },
  messagesByChannel: {
    general: [
      {
        id: "msg_gen_1",
        userId: "U01SARAH",
        userName: "Sarah (Lead Instructor)",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        text: "🚨 Slack's 90-day paywall is approaching! We have imported all 6 months of lecture notes, code snippets, and whiteboard replays to Zedu Chat so nothing gets deleted.",
        timestamp: "Oct 28, 2024, 9:00 AM",
        ts: "1730106000.000100",
        replyCount: 3,
        reactions: [
          { name: "heart", count: 18 },
          { name: "rocket", count: 12 },
        ],
        channelName: "general",
      },
      {
        id: "msg_gen_2",
        userId: "U03ELENA",
        userName: "Elena R.",
        userAvatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        text: "Thank goodness! I was constantly worried our Week 3 algorithm solutions would vanish behind the $8.75/seat paywall.",
        timestamp: "Oct 28, 2024, 9:15 AM",
        ts: "1730106900.000200",
        reactions: [{ name: "100", count: 8 }],
        channelName: "general",
      },
      {
        id: "msg_gen_3",
        userId: "U02MARCUS",
        userName: "Marcus Kim (TA)",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        text: "Plus on Zedu we have native week-by-week channels and built-in Buzz Voice rooms for study tables without meeting link chaos.",
        timestamp: "Oct 28, 2024, 9:30 AM",
        ts: "1730107800.000300",
        channelName: "general",
      },
      {
        id: "msg_gen_4",
        userId: "U04DAVID",
        userName: "David Okafor",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        text: "The search speed in this archive is instantaneous. Just found all the auth middleware examples from September!",
        timestamp: "Oct 28, 2024, 10:05 AM",
        ts: "1730109900.000400",
        reactions: [{ name: "raised_hands", count: 5 }],
        channelName: "general",
      },
      {
        id: "msg_gen_5",
        userId: "U01SARAH",
        userName: "Sarah (Lead Instructor)",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        text: "Remember everyone: you can claim this archive as a permanent live Zedu workspace anytime by clicking the banner above.",
        timestamp: "Oct 28, 2024, 11:00 AM",
        ts: "1730113200.000500",
        channelName: "general",
      },
    ],
    "react-and-nextjs": [
      {
        id: "msg_react_1",
        userId: "U01SARAH",
        userName: "Sarah (Lead Instructor)",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        text: "Here is the key distinction between Server Actions and API routes: Server Actions integrate directly with form mutations and progressive enhancement.",
        timestamp: "Oct 29, 2024, 2:15 PM",
        ts: "1730211300.000100",
        replyCount: 2,
        reactions: [{ name: "fire", count: 14 }],
        channelName: "react-and-nextjs",
      },
      {
        id: "msg_react_2",
        userId: "U03ELENA",
        userName: "Elena R.",
        userAvatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        text: "Does `useActionState` replace `useFormState` in React 19?",
        timestamp: "Oct 29, 2024, 2:22 PM",
        ts: "1730211720.000200",
        channelName: "react-and-nextjs",
      },
      {
        id: "msg_react_3",
        userId: "U02MARCUS",
        userName: "Marcus Kim (TA)",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        text: "Yes! `useActionState` is the standard API in React 19 and handles pending transitions smoothly.",
        timestamp: "Oct 29, 2024, 2:30 PM",
        ts: "1730212200.000300",
        reactions: [{ name: "white_check_mark", count: 9 }],
        channelName: "react-and-nextjs",
      },
      {
        id: "msg_react_4",
        userId: "U04DAVID",
        userName: "David Okafor",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        text: "Pinned this solution for anyone building project milestone 4 this weekend.",
        timestamp: "Oct 29, 2024, 3:00 PM",
        ts: "1730214000.000400",
        channelName: "react-and-nextjs",
      },
    ],
    "debugging-help": [
      {
        id: "msg_dbg_1",
        userId: "U04DAVID",
        userName: "David Okafor",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        text: "Getting `Hydration failed because the initial UI does not match what was rendered on the server` on dynamic dates. Any tips?",
        timestamp: "Oct 30, 2024, 11:20 AM",
        ts: "1730287200.000100",
        replyCount: 2,
        channelName: "debugging-help",
      },
      {
        id: "msg_dbg_2",
        userId: "U02MARCUS",
        userName: "Marcus Kim (TA)",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        text: "Format the timestamp inside a `useEffect` or use `suppressHydrationWarning` on the specific `<time>` tag to avoid locale timezone mismatch.",
        timestamp: "Oct 30, 2024, 11:25 AM",
        ts: "1730287500.000200",
        reactions: [{ name: "pray", count: 6 }],
        channelName: "debugging-help",
      },
      {
        id: "msg_dbg_3",
        userId: "U04DAVID",
        userName: "David Okafor",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        text: "That solved it instantly! Marcus you are a lifesaver.",
        timestamp: "Oct 30, 2024, 11:32 AM",
        ts: "1730287920.000300",
        channelName: "debugging-help",
      },
      {
        id: "msg_dbg_4",
        userId: "U03ELENA",
        userName: "Elena R.",
        userAvatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        text: "Bookmarked this thread for our cohort FAQ.",
        timestamp: "Oct 30, 2024, 11:45 AM",
        ts: "1730288700.000400",
        channelName: "debugging-help",
      },
    ],
    "whiteboard-sessions": [
      {
        id: "msg_wb_1",
        userId: "U01SARAH",
        userName: "Sarah (Lead Instructor)",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        text: "Whiteboard replay: System design for scalable WebSocket chat architectures with Pub/Sub message brokers.",
        timestamp: "Nov 01, 2024, 4:00 PM",
        ts: "1730476800.000100",
        replyCount: 1,
        reactions: [{ name: "star", count: 11 }],
        channelName: "whiteboard-sessions",
      },
      {
        id: "msg_wb_2",
        userId: "U03ELENA",
        userName: "Elena R.",
        userAvatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        text: "The diagram of Redis memory sharding is super clear on this board.",
        timestamp: "Nov 01, 2024, 4:15 PM",
        ts: "1730477700.000200",
        channelName: "whiteboard-sessions",
      },
      {
        id: "msg_wb_3",
        userId: "U02MARCUS",
        userName: "Marcus Kim (TA)",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        text: "All whiteboard assets and vector shapes are preserved in the Zedu migration export.",
        timestamp: "Nov 01, 2024, 4:30 PM",
        ts: "1730478600.000300",
        channelName: "whiteboard-sessions",
      },
    ],
  },
  totalMessages: 16,
  importedAt: "2024-11-04T12:00:00.000Z",
};
