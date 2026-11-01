import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteUrl } from "~/lib/env-urls";
import { ArrowBtn, OutlineBtn } from "../ui/Button";
import { ArticleBody } from "./ArticleBody";
import { articleAuthor, articlePath, type Article } from "../../_lib/articles";

export const articleMetadata = (article: Article): Metadata => {
  const url = siteUrl(articlePath(article.slug));
  const image = siteUrl(article.image);

  return {
    title: { absolute: article.metaTitle },
    description: article.description,
    authors: [articleAuthor],
    icons: {
      icon: "/TelexIcon.svg",
    },
    openGraph: {
      title: article.headline,
      description: article.description,
      url,
      siteName: "Zedu",
      images: [
        {
          url: image,
          width: article.imageWidth,
          height: article.imageHeight,
          alt: article.imageAlt,
        },
      ],
      type: "article",
      publishedTime: article.datePublished,
      authors: [articleAuthor.name],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: article.headline,
      description: article.description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
};

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export const ArticleView = ({ article }: { article: Article }) => {
  return (
    <article className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-12 text-left sm:px-8 sm:py-16">
      <header className="flex flex-col gap-5">
        <Link
          href="/resources"
          className="text-sm font-medium text-primary-500 underline hover:text-primary-400"
        >
          Resources
        </Link>
        <h1 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl md:text-4xl">
          {article.headline}
        </h1>
        <p className="text-sm text-neutral-600">
          By{" "}
          <span className="font-medium text-neutral-900">
            {articleAuthor.name}
          </span>{" "}
          ·{" "}
          <time dateTime={article.datePublished}>
            {formatDate(article.datePublished)}
          </time>
        </p>
        <Image
          src={article.image}
          alt={article.imageAlt}
          width={article.imageWidth}
          height={article.imageHeight}
          priority
          className="h-auto w-full rounded-lg object-cover"
        />
      </header>

      <ArticleBody markdown={article.body} />

      <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center">
        <ArrowBtn
          text={article.primaryCta.label}
          href={article.primaryCta.href}
        />
        <OutlineBtn
          text={article.secondaryCta.label}
          href={article.secondaryCta.href}
        />
      </div>

      <section className="flex flex-col gap-3 text-neutral-600">
        <h2 className="text-lg font-semibold text-neutral-900">
          Keep reading and exploring
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          {article.relatedLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-medium text-primary-500 underline hover:text-primary-400"
              >
                {link.label}
              </Link>
              {link.description && `: ${link.description}`}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};
