import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WhyCard } from "~/app/(homepage)/_components/ui/WhyCard";

const classroomGuide = {
  title: "Move your class to organised channels",
  description:
    "Follow a step-by-step guide to moving classroom conversations from WhatsApp or Telegram to Zedu.",
  href: "/resources/moving-your-class-from-whatsapp-telegram-to-zedu",
};

const communicationPlanner = {
  title: "Plan your cohort communication",
  description:
    "Build a communication playbook with channels, a weekly roadmap, roles and a checklist for your learning group.",
  href: "/resources/cohort-communication-planner",
};

const resources = {
  schools: {
    introduction:
      "Explore practical ways to organise class conversations and plan communication for your learning group.",
    items: [classroomGuide, communicationPlanner],
  },
  universities: {
    introduction:
      "Find ideas for course channels, teaching-assistant support and a clearer communication plan for students.",
    items: [
      {
        title: "Explore the university class template",
        description:
          "Preview a semester workspace with channels for the syllabus, lecture notes, study groups and TA office hours.",
        href: "/templates/university-college-class",
      },
      classroomGuide,
      communicationPlanner,
    ],
  },
  bootcamps: {
    introduction:
      "Prepare your cohort workspace, review communication habits and plan how learners will find updates and support.",
    items: [
      {
        title: "Explore the coding bootcamp template",
        description:
          "Preview channels for announcements, lectures, daily standups, debugging help and project showcases.",
        href: "/templates/coding-bootcamp",
      },
      {
        title: "Check your cohort communication health",
        description:
          "Reflect on how learners find updates, resources and support with a free communication self-assessment.",
        href: "/tools/cohort-communication-health-check",
      },
      communicationPlanner,
    ],
  },
};

type SolutionResourcesProps = {
  audience: keyof typeof resources;
};

export function SolutionResources({ audience }: SolutionResourcesProps) {
  const { introduction, items } = resources[audience];

  return (
    <section
      aria-labelledby="helpful-resources-heading"
      className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-8 max-w-2xl space-y-4 text-center">
          <h2
            id="helpful-resources-heading"
            className="text-3xl font-semibold text-neutral-900 sm:text-4xl"
          >
            Helpful resources
          </h2>
          <p className="text-base text-neutral-600">{introduction}</p>
        </div>
        <ul
          className={`grid gap-4 md:grid-cols-2 ${items.length === 3 ? "lg:grid-cols-3" : ""}`}
        >
          {items.map(({ title, description, href }) => (
            <li key={href} className="min-w-0">
              <WhyCard
                title={title}
                desc={description}
                headingLevel="h3"
                showBadge={false}
                className="h-full"
                cta={
                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 rounded-sm font-semibold text-primary-500 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
                  >
                    {title}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 shrink-0"
                    />
                  </Link>
                }
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
