import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResourcesHub } from "./_components/resources-hub";
import {
  ArticleView,
  articleMetadata,
} from "../_components/resources/ArticleView";
import { getArticleBySlug } from "../_lib/articles";
import {
  ZeduVsWhatsappTelegram,
  zeduVsWhatsappTelegramMetadata,
  zeduVsWhatsappTelegramGuide,
} from "./_components/zedu-vs-whatsapp-telegram";

type ResourcesPageProps = {
  searchParams: Promise<{ guide?: string | string[] }>;
};

const getGuideSlug = async (
  searchParams: ResourcesPageProps["searchParams"]
) => {
  const { guide } = await searchParams;
  return typeof guide === "string" ? guide : undefined;
};

export const generateMetadata = async ({
  searchParams,
}: ResourcesPageProps): Promise<Metadata> => {
  const slug = await getGuideSlug(searchParams);
  if (slug === zeduVsWhatsappTelegramGuide.slug)
    return zeduVsWhatsappTelegramMetadata;

  const article = slug ? getArticleBySlug(slug) : undefined;
  return article ? articleMetadata(article) : {};
};

const ResourcesPage = async ({ searchParams }: ResourcesPageProps) => {
  const slug = await getGuideSlug(searchParams);
  if (!slug) return <ResourcesHub />;
  if (slug === zeduVsWhatsappTelegramGuide.slug)
    return <ZeduVsWhatsappTelegram />;

  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return <ArticleView article={article} />;
};

export default ResourcesPage;
