import Image from "next/image";
import { cn } from "~/lib/utils";

type PoweredByZeduProps = {
  className?: string;
};

const PoweredByZedu = ({ className }: PoweredByZeduProps) => {
  return (
    <a
      href="/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Powered by Zedu (opens in a new tab)"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm transition hover:border-primary-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        className
      )}
    >
      <Image src="/TelexIcon.svg" alt="" width={12} height={15} />
      <span className="text-xs text-gray-500">Powered by</span>
      <span className="text-xs font-bold text-primary-500">Zedu</span>
    </a>
  );
};

export default PoweredByZedu;
