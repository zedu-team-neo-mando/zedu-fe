import Image from "next/image";

type ArticleCardProps = {
  title: string;
  desc: string;
  tag: string;
  image: string;
};

export const ArticleCard = ({ title, desc, tag, image }: ArticleCardProps) => {
  return (
    <article className="relative flex h-full w-full max-w-[380px] flex-col gap-6 overflow-hidden rounded-2xl bg-white drop-shadow-md">
      <div className="absolute left-3 top-3 z-10 flex items-center justify-center rounded-full bg-blue-900 px-4 py-2 text-xs uppercase text-white">
        {tag}
      </div>
      <div className="relative h-[220px] w-full sm:h-[250px]">
        <Image
          src={image}
          alt={title}
          fill
          preload
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-5 py-5 text-left sm:px-8 sm:py-6">
        <h3 className="text-base font-semibold text-neutral-900 sm:text-lg">
          {title}
        </h3>
        <p className="text-xs leading-relaxed text-neutral-600 sm:text-sm">
          {desc}
        </p>
      </div>
    </article>
  );
};
