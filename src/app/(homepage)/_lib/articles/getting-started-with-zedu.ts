import type { Article } from "./types";

const IMAGES = "/images/homepage/resources/getting-started";

export const gettingStartedWithZedu: Article = {
  slug: "getting-started-with-zedu",
  title: "Getting Started with Zedu",
  headline:
    "Getting Started with Zedu: Set Up, Organise, Invite and Run Your First Cohort",
  metaTitle: "Getting Started with Zedu | Zedu Guide",
  description:
    "A step-by-step tutorial for educators: create your organisation, set up channels for your programme, invite learners and run your first cohort on Zedu.",
  image: `${IMAGES}/cover.png`,
  imageAlt:
    "The Zedu workspace for Demo Academy, showing the announcements channel with an instructor's weekly goals and a learner's question",
  imageWidth: 1280,
  imageHeight: 720,
  datePublished: "2026-11-02",
  body: `
Running a cohort means a lot of moving parts: announcements, lessons, questions, projects and the people behind them. This tutorial walks you through setting all of that up in Zedu, from an empty account to a cohort that is up and running. It takes about five minutes to read, and each step shows the screen you'll see.

The screenshots use a sample organisation called Demo Academy. Your own names and channels will be different.

## Step 1: Create your organisation

Your organisation is the home for your programme. Everything else (channels, people, files and calls) lives inside it.

1. [Sign up for Zedu](/auth/sign-up) and confirm your email.
2. On **Create Your Organisation**, enter an **Organisation Name**. Use the name learners will recognise, such as your school, bootcamp or programme.
3. Under **Organisation Type**, say what your organisation does, for example "Coding bootcamp".
4. Choose your **Country**, then select **Submit**.

![The Create Your Organisation form with the name Demo Academy and the type Coding bootcamp](${IMAGES}/step-1-create-organisation.png)

## Step 2: Organise your programme into channels

Channels give each part of your programme its own place, so announcements don't get lost among questions and project chat.

1. From **Home**, open **View all channels**.
2. Select **New Channel** to open **Create a Channel**.
3. Enter a **Channel name**, such as **announcements**. Names are lowercase, use hyphens instead of spaces, and can be up to 40 characters.
4. Under **Channel Visibility**, choose **Public** (anyone in your organisation can join) or **Private** (only specific people), then select **Create Channel**.

![The Create a Channel dialog with the channel name lessons and public visibility selected](${IMAGES}/step-2-create-channel.png)

A simple starting set for a cohort:

| Channel | What it's for | Visibility |
| --- | --- | --- |
| announcements | Weekly goals, schedule changes and deadlines | Public |
| lessons | Session notes, recordings and slides | Public |
| questions | Course questions, answered in threads | Public |
| projects-team-a | One channel per project team | Public or Private |
| staff | Instructors and mentors coordinating | Private |

For more ideas on naming and structure, see [Organizing Courses with Channels](/resources?guide=organizing-courses-with-channels).

## Step 3: Invite your learners

1. Select your organisation's name at the top left, then select **Invite**.
2. In **Invite people to** your organisation, enter learners' names or email addresses under **Send to**, then select **Send**.
3. To invite a whole class at once, select **Copy invite link** and post it wherever your learners already are, or use **Share on WhatsApp**.

![The Invite people to Demo Academy dialog with Send to, Copy invite link and Share on WhatsApp](${IMAGES}/step-3-invite-learners.png)

Invite your mentors and co-instructors the same way, and add them to the **#staff** channel.

## Step 4: Run the cohort day to day

With channels and people in place, the day-to-day work happens in a few familiar places:

- **Post announcements** in **#announcements** so the week's goals and deadlines are always in one place.
- **Answer questions in threads.** Reply to a learner's message in a thread so the answer stays attached to the question, and find active conversations later under **Threads**.
- **Meet live with Buzz.** Select **Start Buzz** at the top of a channel to start a call with that channel, or open **Buzz** in the left sidebar.
- **Share materials** in **#lessons**, and find every shared file under **Files** in the left sidebar.
- **Manage members** under **Settings**, then **Organisation**, then **User Management**, to see your team and manage roles.

![An announcements channel where the instructor posts Week 3 goals and replies to a learner's question about the recording](${IMAGES}/step-4-run-the-cohort.png)

## What to do next

- Pin your first announcement with the cohort's schedule and where to ask questions.
- Plan a weekly rhythm of goals and checkpoints. [Managing Bootcamp Cohorts](/resources?guide=managing-bootcamp-cohorts) shows one that works.
- Get learners talking early with the tips in [Running Active Class Discussions](/resources?guide=running-active-class-discussions).
`,
  primaryCta: {
    label: "Start free on the Starter plan",
    href: "/auth/sign-up",
  },
  secondaryCta: { label: "Explore Zedu Channels", href: "/products/channels" },
  relatedLinks: [
    {
      label: "Organizing Courses with Channels",
      href: "/resources?guide=organizing-courses-with-channels",
      description: "choose and name the right channels for your course",
    },
    {
      label: "Managing Bootcamp Cohorts",
      href: "/resources?guide=managing-bootcamp-cohorts",
      description: "structure, weekly rhythms and mentor coordination",
    },
    {
      label: "Running Active Class Discussions",
      href: "/resources?guide=running-active-class-discussions",
      description: "get learners talking once the cohort is set up",
    },
  ],
};
