import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { siteUrl } from "~/lib/env-urls";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ArrowBtn, OutlineBtn } from "../../_components/ui/Button";
import { FAQSection } from "../../_components/home/FAQSection";
import {
  comparisonRows,
  comparisonSources,
  relatedLinks,
  zeduVsWhatsappTelegramFAQs,
} from "../../_lib/zeduVsWhatsappTelegramData";

export const zeduVsWhatsappTelegramGuide = {
  slug: "zedu-vs-whatsapp-telegram-for-bootcamps",
};
const pagePath = `/resources?guide=${zeduVsWhatsappTelegramGuide.slug}`;
const pageDescription =
  "WhatsApp and Telegram get a cohort started. Zedu keeps it organised: channels, threads, files and Buzz voice sessions with AI summaries.";
const coverImage = "/images/homepage/resources/zedu-vs-whatsapp-telegram.png";
const coverImageAlt = "Zedu, WhatsApp and Telegram logos side by side";
const author = {
  name: "Michael Abu",
};

export const zeduVsWhatsappTelegramMetadata: Metadata = {
  title: "Zedu vs WhatsApp vs Telegram for Bootcamps",
  description: pageDescription,
  authors: [author],
  keywords: [
    "Zedu vs WhatsApp",
    "Zedu vs Telegram",
    "WhatsApp alternatives for bootcamps",
    "Telegram alternatives for bootcamps",
    "bootcamp cohort management platform",
    "cohort communication platform",
  ],
  openGraph: {
    title: "Zedu vs WhatsApp and Telegram for Bootcamps",
    description: pageDescription,
    url: siteUrl(pagePath),
    siteName: "Zedu",
    images: [
      {
        url: siteUrl(coverImage),
        width: 1344,
        height: 960,
        alt: coverImageAlt,
      },
    ],
    type: "article",
    authors: [author.name],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zedu vs WhatsApp and Telegram for Bootcamps",
    description: pageDescription,
    images: [siteUrl(coverImage)],
  },
  alternates: {
    canonical: siteUrl(pagePath),
  },
  robots: {
    index: true,
    follow: true,
  },
};

const linkClass =
  "font-medium text-primary-500 underline hover:text-primary-400";

const TextLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <Link href={href} className={linkClass}>
    {children}
  </Link>
);

const SectionHeading = ({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) => (
  <h2
    id={id}
    className="scroll-mt-24 text-xl font-semibold text-neutral-900 sm:text-2xl"
  >
    {children}
  </h2>
);

const CtaRow = ({
  primary,
  secondary,
}: {
  primary: { text: string; href: string };
  secondary?: { text: string; href: string };
}) => (
  <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center">
    <ArrowBtn text={primary.text} href={primary.href} />
    {secondary && <OutlineBtn text={secondary.text} href={secondary.href} />}
  </div>
);

const criteria = [
  {
    title: "Announcements",
    body: "WhatsApp can restrict any group to admin-only posting, Communities add an announcement group, and Telegram has channels. All of these work, but each is a separate chat to set up and keep in step with the rest of the cohort. In Zedu, teachers, professors and mentors post announcements directly in the relevant channel, beside the discussion, files and sessions for that cohort.",
    edge: "Edge: Zedu. Nothing separate to maintain.",
    link: { label: "Explore Zedu Channels", href: "/products/channels" },
  },
  {
    title: "Discussions and threads",
    body: "WhatsApp keeps each group as one running conversation. Telegram's topics split a group into sections, which is a real strength for small programmes. Zedu gives each course, cohort or topic its own channel with threaded replies, so a question and its answers stay together and a mentor can point to one thread instead of retyping the answer.",
    edge: "Edge: Zedu, with Telegram topics the closest alternative.",
  },
  {
    title: "Files and learning resources",
    body: "In both apps, a file is a message in a chat. Telegram search can filter by sender, which helps, but the file still lives where it was posted. Zedu organises files by course, department or cohort, makes them searchable, lets you share them straight into channels and attach them to coursework.",
    edge: "Edge: Zedu. Students find materials by cohort or course, not by scrolling.",
    link: {
      label: "See Zedu File Management",
      href: "/products/file-management",
    },
  },
  {
    title: "Live sessions and catching up",
    body: "WhatsApp has group voice and video calls, and Telegram supports group calls of up to 200 participants plus voice chats in groups. Buzz in Zedu starts a voice conversation in one click from any cohort channel, and when the session ends it generates a summary of key ideas and decisions that students can review. The pricing page also lists voice and video calls, screen sharing and class recordings.",
    edge: "Edge: Zedu for catching up, because the recap does not depend on someone writing it.",
    link: { label: "Meet Zedu Buzz", href: "/products/buzz" },
  },
  {
    title: "Cohort management and admin",
    body: "WhatsApp and Telegram give you groups and admins. Zedu gives you cohorts: Starter allows up to 3 and Pro allows unlimited, with assignment and cohort management and admin moderation tools on Pro, and institution-level workspace control on Enterprise.",
    edge: "Edge: Zedu. Your next cohort lives in the same workspace instead of in a brand-new group.",
    link: {
      label: "See how bootcamps use Zedu",
      href: "/solutions/bootcamps",
    },
  },
  {
    title: "Price",
    body: "WhatsApp and Telegram are free, which is hard to beat for a small informal cohort. Zedu's Starter plan is also ₦0/month with no credit card needed and allows up to 3 cohorts, and Pro is ₦20K/month for unlimited cohorts. Weigh that against the instructor hours spent resending files and answering repeat questions.",
    edge: "Edge: a tie while you are small, Zedu once organising takes real instructor time.",
    link: { label: "Compare Zedu pricing", href: "/pricing" },
  },
];

export const ZeduVsWhatsappTelegram = () => {
  return (
    <>
      <article className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-12 text-left text-base text-neutral-600 sm:px-8 sm:py-16">
        <header className="flex flex-col gap-5">
          <Link href="/resources" className={`${linkClass} text-sm`}>
            Resources
          </Link>
          <h1 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl md:text-4xl">
            Zedu vs WhatsApp and Telegram for Bootcamps: Why Cohorts Need More
            Than a Group Chat
          </h1>
          <p className="text-sm">
            By{" "}
            <span className="font-medium text-neutral-900">{author.name}</span>{" "}
            · Last updated October 2026
          </p>
          <Image
            src={coverImage}
            alt={coverImageAlt}
            width={1344}
            height={960}
            priority
            className="h-auto w-full rounded-lg"
          />
          <p>
            WhatsApp and Telegram are brilliant for starting a cohort. They are
            free, familiar and fast. But a bootcamp is not a chat. It is a
            programme with announcements, lessons, files, live sessions, mentors
            and assignments, and a group chat squeezes all of it into one
            scrolling conversation.
          </p>
          <p>
            Zedu is built for that programme. Each cohort gets channels for
            lessons, resources and questions, threaded replies, searchable files
            organised by cohort, and Buzz voice sessions that finish with an
            automatic AI summary. For bootcamps that need more than quick chat,
            Zedu is the stronger choice, and this page shows why.
          </p>
          <CtaRow
            primary={{
              text: "Start free on the Starter plan",
              href: "/auth/sign-up",
            }}
            secondary={{
              text: "See Zedu for bootcamps",
              href: "/solutions/bootcamps",
            }}
          />
          <p className="text-sm">
            No credit card needed. We build Zedu, so every claim below is based
            on WhatsApp&apos;s announcements, Telegram&apos;s FAQ and
            Zedu&apos;s own pages, with sources under the comparison table.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <SectionHeading>The short answer</SectionHeading>
          <p>
            <strong className="text-neutral-900">
              For running a bootcamp cohort, Zedu is the better option. WhatsApp
              and Telegram are better at starting a conversation; Zedu is better
              at running a programme.
            </strong>{" "}
            In three lines:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-neutral-900">Structure.</strong> Channels
              per cohort, course or topic, with threaded replies, keep
              announcements, questions and resources apart. In a group chat they
              share one timeline.
            </li>
            <li>
              <strong className="text-neutral-900">Memory.</strong> Files are
              organised by cohort or course and searchable, and Buzz sessions
              end with an AI summary, so nothing depends on someone scrolling
              back or remembering.
            </li>
            <li>
              <strong className="text-neutral-900">Management.</strong> Cohorts,
              roles and admin tools are part of the plans (Starter allows up to
              3 cohorts, Pro unlimited), so your next cohort lives in the same
              workspace instead of a brand-new group.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading id="five-signs-your-cohort-has-outgrown-a-group-chat">
            Five signs your cohort has outgrown a group chat
          </SectionHeading>
          <ol className="list-decimal space-y-2 pl-6">
            <li>
              People keep asking for links or files that were already shared.
            </li>
            <li>Official announcements get lost under replies.</li>
            <li>
              Learners who miss a session have to ask a classmate what happened.
            </li>
            <li>
              Nobody is sure where to post a question, so mentors answer the
              same ones every week.
            </li>
            <li>
              Organisers spend more time maintaining the group than teaching.
            </li>
          </ol>
          <p>
            If two or more sound familiar, the problem is structure, not
            messaging, and more messages will not fix it. That is the problem{" "}
            <TextLink href="/solutions/bootcamps">Zedu for bootcamps</TextLink>{" "}
            is built to solve.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading>
            Why bootcamps outgrow WhatsApp and Telegram
          </SectionHeading>
          <p>
            Those five signs come from four root causes. Both apps are excellent
            at messaging; they were not designed around a programme.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-neutral-900">
                One timeline, many jobs.
              </strong>{" "}
              WhatsApp offers admin-only posting and Communities, and Telegram
              offers channels and topics. They help, but announcements,
              discussion, files and questions still end up as separate chats you
              assemble and keep in sync yourself.
            </li>
            <li>
              <strong className="text-neutral-900">
                Files stay where they were posted.
              </strong>{" "}
              Documents and slides are sent as messages. There is no shared
              library organised by cohort or course, so last week&apos;s deck
              means scrolling or searching one conversation.
            </li>
            <li>
              <strong className="text-neutral-900">
                Every cohort starts from zero.
              </strong>{" "}
              A new cohort means a new group, new invite links and the same
              files shared again.
            </li>
            <li>
              <strong className="text-neutral-900">
                Personal accounts, not a programme.
              </strong>{" "}
              Both apps run on personal accounts tied to a phone number. Neither
              has cohorts, programmes and staff roles as things you manage.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading>
            Zedu vs WhatsApp vs Telegram at a glance
          </SectionHeading>
          <div className="w-full overflow-x-auto rounded-lg border border-neutral-200">
            <Table className="min-w-[720px] text-sm">
              <TableHeader>
                <TableRow className="bg-neutral-50 hover:bg-neutral-50">
                  <TableHead className="w-[19%] text-neutral-900" />
                  <TableHead className="w-[27%] font-semibold text-neutral-900">
                    WhatsApp
                  </TableHead>
                  <TableHead className="w-[27%] font-semibold text-neutral-900">
                    Telegram
                  </TableHead>
                  <TableHead className="w-[27%] font-semibold text-primary-500">
                    Zedu
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonRows.map((row) => (
                  <TableRow key={row.label} className="align-top">
                    <TableHead
                      scope="row"
                      className="h-auto py-3 font-semibold text-neutral-900"
                    >
                      {row.label}
                    </TableHead>
                    <TableCell className="text-neutral-600">
                      {row.whatsapp}
                    </TableCell>
                    <TableCell className="text-neutral-600">
                      {row.telegram}
                    </TableCell>
                    <TableCell className="text-neutral-900">
                      {row.zedu}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <CtaRow primary={{ text: "Compare Zedu plans", href: "/pricing" }} />
          <p className="text-sm">
            Sources, checked October 2026:{" "}
            {comparisonSources.map((source, index) => (
              <span key={source.label}>
                {source.href ? (
                  <TextLink href={source.href}>{source.label}</TextLink>
                ) : (
                  source.label
                )}
                {index < comparisonSources.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <SectionHeading>
              Where Zedu has the edge for a cohort
            </SectionHeading>
            <p>
              Six things bootcamp organisers tend to care about, and how each
              option handles them.
            </p>
          </div>
          {criteria.map((criterion, index) => (
            <div key={criterion.title} className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-neutral-900">
                {index + 1}. {criterion.title}
              </h3>
              <p>{criterion.body}</p>
              <p>
                <strong className="text-neutral-900">{criterion.edge}</strong>
                {criterion.link && (
                  <>
                    {" "}
                    <TextLink href={criterion.link.href}>
                      {criterion.link.label} →
                    </TextLink>
                  </>
                )}
              </p>
            </div>
          ))}
          <CtaRow
            primary={{
              text: "Create your free Zedu workspace",
              href: "/auth/sign-up",
            }}
          />
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading>
            When WhatsApp or Telegram is still the better fit
          </SectionHeading>
          <p>
            Being straight about this is why you can trust the rest of the
            comparison.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-neutral-900">
                A one-off workshop or very small group.
              </strong>{" "}
              If everyone is already in the chat and the programme lasts a few
              weeks, a group chat is enough.
            </li>
            <li>
              <strong className="text-neutral-900">
                A very large, open community.
              </strong>{" "}
              Telegram groups reach 200,000 members and its channels have no
              subscriber limit. Zedu&apos;s limits are set by plan: up to 100
              members in total on Starter, up to 500 students per cohort on Pro,
              and custom limits on Enterprise.
            </li>
            <li>
              <strong className="text-neutral-900">
                Encryption by default.
              </strong>{" "}
              WhatsApp is designed around end-to-end encryption. If that is a
              hard requirement for your programme,{" "}
              <TextLink href="/contact-sales">talk to us</TextLink> about what
              Zedu offers before you decide.
            </li>
          </ul>
          <p>
            If none of these describes your programme, you are the cohort Zedu
            was built for.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading id="how-to-move-your-cohort-to-zedu-without-the-chaos">
            How to move your cohort to Zedu without the chaos
          </SectionHeading>
          <p>
            You do not have to move everything at once. This order keeps
            disruption low:
          </p>
          <ol className="list-decimal space-y-2 pl-6">
            <li>
              <strong className="text-neutral-900">
                Pilot with one cohort or track.
              </strong>{" "}
              Leave the existing group running.
            </li>
            <li>
              <strong className="text-neutral-900">
                Build the structure before you invite anyone.
              </strong>{" "}
              Create channels such as announcements, general, resources and
              questions, plus one per team or track, in{" "}
              <TextLink href="/products/channels">Zedu Channels</TextLink>.
              Decide who can post announcements.
            </li>
            <li>
              <strong className="text-neutral-900">
                Invite through the old group.
              </strong>{" "}
              Post one message with the invite link explaining where things now
              live, and pin it.
            </li>
            <li>
              <strong className="text-neutral-900">
                Move what hurts most first.
              </strong>{" "}
              Announcements and files go first. Upload your resources to{" "}
              <TextLink href="/products/file-management">
                Zedu File Management
              </TextLink>
              , organised by cohort or course.
            </li>
            <li>
              <strong className="text-neutral-900">
                Run one live session in{" "}
                <TextLink href="/products/buzz">Buzz</TextLink>
              </strong>{" "}
              and post the AI summary in the channel so students see the
              benefit.
            </li>
            <li>
              <strong className="text-neutral-900">
                Retire the old group gradually.
              </strong>{" "}
              After a couple of weeks, restrict posting to admins (both apps
              support this) so it only points people to Zedu.
            </li>
          </ol>
          <CtaRow primary={{ text: "Book a demo", href: "/contact-sales" }} />
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading>Which should you choose?</SectionHeading>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-neutral-900">
                Choose WhatsApp or Telegram
              </strong>{" "}
              for one small, short, informal cohort where everyone is already in
              the chat.
            </li>
            <li>
              <strong className="text-neutral-900">Choose Zedu</strong> for any
              bootcamp that runs several cohorts or tracks, wants announcements,
              discussions and files kept apart, and has mentors, assignments and
              sessions to manage.
            </li>
            <li>
              <strong className="text-neutral-900">
                Use both while you transition.
              </strong>{" "}
              Keep the old group as a pointer and move announcements and files
              first.
            </li>
          </ul>
          <p>
            If your bootcamp has more than one cohort or track, you are probably
            in the second group, and the Starter plan lets you find out at no
            cost.
          </p>
          <CtaRow
            primary={{
              text: "Start free on the Starter plan",
              href: "/auth/sign-up",
            }}
            secondary={{
              text: "Talk to us about your cohort size",
              href: "/contact-sales",
            }}
          />
        </section>
      </article>

      <FAQSection faqs={zeduVsWhatsappTelegramFAQs} />

      <section className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 pb-12 text-left text-base text-neutral-600 sm:px-8 sm:pb-16">
        <SectionHeading>Ready to run your next cohort on Zedu?</SectionHeading>
        <p>
          WhatsApp and Telegram got your cohort started. Zedu keeps it
          organised: announcements where students will see them, discussions in
          threads, files by cohort, and sessions that leave a summary behind.
        </p>
        <CtaRow
          primary={{
            text: "Start free on the Starter plan",
            href: "/auth/sign-up",
          }}
          secondary={{
            text: "Book a demo for your bootcamp",
            href: "/contact-sales",
          }}
        />
        <h3 className="pt-4 text-lg font-semibold text-neutral-900">
          Keep exploring Zedu
        </h3>
        <ul className="list-disc space-y-2 pl-6">
          {relatedLinks.map((link) => (
            <li key={link.href}>
              <TextLink href={link.href}>{link.label}</TextLink>
              {link.description && `: ${link.description}`}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};
