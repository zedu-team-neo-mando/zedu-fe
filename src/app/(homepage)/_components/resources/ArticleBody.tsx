import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const ArticleBody = ({ markdown }: { markdown: string }) => {
  return (
    <div className="prose prose-neutral max-w-none text-neutral-600 prose-headings:font-semibold prose-headings:text-neutral-900 prose-h2:mt-10 prose-h2:text-xl sm:prose-h2:text-2xl prose-a:font-medium prose-a:text-primary-500 hover:prose-a:text-primary-400 prose-strong:text-neutral-900 prose-th:text-neutral-900 [&_.contains-task-list]:list-none [&_.contains-task-list]:pl-0 [&_.task-list-item_input]:mr-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href = "", children }) =>
            href.startsWith("/") ? (
              <Link href={href}>{children}</Link>
            ) : (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
          table: ({ children }) => (
            <div className="w-full overflow-x-auto">
              <table className="min-w-[640px]">{children}</table>
            </div>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
