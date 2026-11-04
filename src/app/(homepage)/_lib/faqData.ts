export type HomeFAQ = {
  id: string;
  question: string;
  answer: string;
};

export const homeFAQs: HomeFAQ[] = [
  {
    id: "item-1",
    question: "What is Zedu?",
    answer:
      "Zedu is a communication and learning platform built for schools, bootcamps, and training programs. It combines structured channels, learning workflows, and AI-powered support to help educators teach and learners stay engaged.",
  },
  {
    id: "what-is-a-cohort",
    question: "What is a cohort?",
    answer:
      "A cohort is a group of learners who take a course or programme together, often following the same schedule. On Zedu, educators can organise the group’s discussions, announcements and learning resources in dedicated channels.",
  },
  {
    id: "item-2",
    question: "How does Zedu support students and learners?",
    answer:
      "Zedu supports learners with organized class spaces, timely reminders, searchable learning materials, and quick help through AI assistants. Students can follow lessons, ask questions, and track progress in one place.",
  },
  {
    id: "item-3",
    question: "Is Zedu difficult to set up for a school or bootcamp?",
    answer:
      "No. Zedu is designed for quick onboarding with simple setup steps, guided workspace creation, and role-based controls. Most teams can start running cohorts or classes in a short time.",
  },
  {
    id: "item-4",
    question: "Can Zedu use our institution’s information to answer questions?",
    answer:
      "Yes. You can connect your institutional content such as course documents, policies, and internal resources so AI assistants can provide responses grounded in your own approved materials.",
  },
  {
    id: "item-5",
    question: "Is student support fully automated?",
    answer:
      "No. Zedu uses a hybrid model where AI handles routine questions and guidance, while educators and staff remain in control for mentoring, grading, and sensitive support decisions.",
  },
  {
    id: "item-6",
    question: "How does pricing work for educational institutions?",
    answer:
      "Pricing is flexible based on your institution size, usage needs, and required features. Zedu offers plans for growing cohorts and custom options for larger schools or multi-program organisations.",
  },
];

export const pricingFAQs: HomeFAQ[] = [
  {
    id: "pricing-faq-1",
    question: "How is pricing structured?",
    answer:
      "Zedu offers a free Starter plan, a Pro plan at ₦20,000 per month, and custom Enterprise pricing. See the plan comparison for included features and limits, or contact sales about Enterprise.",
  },
  {
    id: "pricing-faq-2",
    question: "How can we change our plan between cohorts?",
    answer:
      "Review the plans available in your workspace billing settings. Contact sales to discuss options for your cohort schedule or an Enterprise plan.",
  },
  {
    id: "pricing-faq-3",
    question: "Is there a free trial, and do I need a credit card to start?",
    answer:
      "No credit card is required. You can launch a free workspace on the Starter plan immediately with organized channels, file sharing, and direct messaging. When you need expanded cohorts, higher AI credit allocations, and advanced moderation tools, you can easily upgrade to Pro.",
  },
  {
    id: "pricing-faq-4",
    question: "How do AI credits work across plans?",
    answer:
      "Every plan includes a monthly allocation of AI credits for automated class summaries, learner Q&A, and study assistants. If your workspace exhausts its monthly allotment, all core communication (messaging, audio, and files) continues without interruption, and admins can top up extra credits at any time.",
  },
  {
    id: "pricing-faq-5",
    question: "Can schools and non-profits ask about special pricing?",
    answer:
      "Contact our sales team to ask whether special pricing is available for your organisation. Eligibility and any discount are confirmed by the team.",
  },
  {
    id: "pricing-faq-6",
    question: "How are online subscription payments processed?",
    answer:
      "Online subscription billing is processed through Stripe. Contact our sales team with questions about payment arrangements for an institutional plan.",
  },
  {
    id: "pricing-faq-7",
    question: "What happens to our cohort data and channels if we downgrade?",
    answer:
      "Plan limits can affect available features. Before downgrading, contact support to confirm how the change may affect access to your channels, files, and cohort history.",
  },
];
