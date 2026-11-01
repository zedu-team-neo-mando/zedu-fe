import { managingBootcampCohorts } from "./managing-bootcamp-cohorts";
import { organizingCoursesWithChannels } from "./organizing-courses-with-channels";
import { runningActiveClassDiscussions } from "./running-active-class-discussions";
import { usingAnAiAssistantForLearning } from "./using-an-ai-assistant-for-learning";
import type { Article } from "./types";

export type { Article, ArticleLink } from "./types";

export const articles: Article[] = [
  organizingCoursesWithChannels,
  runningActiveClassDiscussions,
  usingAnAiAssistantForLearning,
  managingBootcampCohorts,
];

export const articleAuthor = {
  name: "Michael Abu",
};

export const getArticleBySlug = (slug: string) =>
  articles.find((article) => article.slug === slug);

export const articlePath = (slug: string) => `/resources?guide=${slug}`;
