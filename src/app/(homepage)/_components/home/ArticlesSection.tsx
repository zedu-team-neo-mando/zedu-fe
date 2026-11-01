import { ArticleCard } from "../ui/ArticleCard";

const mockArticles = [
  {
    title: "How Bootcamps Use Zedu to Improve Cohort Outcomes",
    desc: "Run each cohort with clear channels, weekly goals, assignment checkpoints, and mentor feedback loops so learners stay accountable from onboarding to graduation.",
    tag: "Modern Bootcamp",
    image: "/images/homepage/articles/article-1.png",
    href: "/solutions/bootcamps",
  },
  {
    title: "A Better Campus Communication Layer for Institutions",
    desc: "Coordinate departments, faculty, and students in one structured workspace with role-based permissions, academic announcements, and reliable resource sharing.",
    tag: "Educational Institution",
    image: "/images/homepage/articles/article-2.png",
    href: "/solutions/universities",
  },
  {
    title: "Keeping K-12 Classrooms Organized, Safe, and Engaging",
    desc: "Create teacher-managed class spaces where students can ask questions, access lesson materials, submit work, and collaborate in a focused learning environment.",
    tag: "K-12 Platform",
    image: "/images/homepage/articles/article-3.png",
    href: "/solutions/schools",
  },
];

export const ArticlesSection = () => {
  return (
    <section className="relative isolate flex w-full flex-col items-center gap-6 overflow-hidden px-4 py-12 text-center sm:gap-6 sm:px-8 sm:py-16   lg:gap-8 lg:px-12">
      <div className="flex flex-col gap-3 items-center">
        <h1 className=" text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl md:text-4xl text-center">
          The Platform for Every Type of Learning
        </h1>
        <p className="max-w-[95%] text-sm text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[85%] lg:max-w-[65%] lg:text-lg">
          Whether you are managing a small learning cohort or overseeing an
          entire large campus, Zedu is designed to grow and adapt seamlessly
          with your needs.
        </p>
      </div>

      {/* Article cards section */}
      <div className="grid w-full max-w-6xl grid-cols-1 place-items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {mockArticles.map((article, index) => (
          <div
            key={`${article.tag}-${index}`}
            className="mx-auto w-full max-w-[380px]"
          >
            <ArticleCard
              title={article.title}
              desc={article.desc}
              tag={article.tag}
              image={article.image}
              href={article.href}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
