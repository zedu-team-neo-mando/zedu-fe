export type ArticleLink = {
  label: string;
  href: string;
  description?: string;
};

export type Article = {
  slug: string;
  /** Card title on /resources and the short name used in links. */
  title: string;
  /** The page's single H1. */
  headline: string;
  metaTitle: string;
  description: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  datePublished: string;
  /** Article body in GitHub-flavored Markdown, using relative links. */
  body: string;
  primaryCta: ArticleLink;
  secondaryCta: ArticleLink;
  relatedLinks: ArticleLink[];
};
