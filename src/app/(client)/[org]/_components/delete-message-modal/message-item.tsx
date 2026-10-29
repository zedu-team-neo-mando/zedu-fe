import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import PreviewLinks from "../ChannelMessage/preview-links";
import { replaceEmojiWithImages } from "~/lib/apple-emoji";
import AssetToDelete from "./asset-to-delete";

/** @eslint-disable */

export interface MediaItem {
  id: string;
  file_name: string;
  file_type: string;
  mime_type: string;
  file_link: string;
}

interface MessageItemProps {
  item: {
    message: string;
    media?: MediaItem[];
    type: string;
  };
}

// Utility function to check for links
const hasLinks = (text: string): boolean => {
  // Simple regex to detect common URL patterns
  const urlRegex =
    /((?:https?:\/\/|www\.)[^\s<"]+|\b\w+\.(?:com|co|ng|net|org|io|dev|ai|app|cc)\b)/gi;
  return urlRegex.test(text);
};

const MessageItem: React.FC<MessageItemProps> = ({ item }) => {
  const trimmedMessage = replaceEmojiWithImages(
    item.message.replace(/\n{2,}/g, "\n\n").replace(/^\n+|\n+$/g, "")
  );

  const messageHasLinks = hasLinks(trimmedMessage);

  useEffect(() => {
    if (typeof Prism !== "undefined") {
      Prism.highlightAll();
    }
  }, [trimmedMessage]);

  return (
    <div>
      <div
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
        className="w-full text-[#344054] text-[13px] lg:text-[15px] font-[400] break-words custom-message"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            a: ({ ...props }) => (
              <a
                {...props}
                style={{ textDecoration: "underline", color: "blue" }}
                target="_blank"
                rel="noopener noreferrer"
              />
            ),
            table: (props) => (
              <table
                style={{ width: "100%", wordBreak: "break-word" }}
                {...props}
              />
            ),
            th: (props) => (
              <th
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  wordBreak: "break-word",
                }}
                {...props}
              />
            ),
            td: (props) => (
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  wordBreak: "break-word",
                }}
                {...props}
              />
            ),
            p: (props) => (
              <p
                style={{
                  color: item?.type === "system" ? "#aaa" : "",
                  wordBreak: "break-word",
                  margin: "0",
                  lineHeight: "22px",
                }}
                {...props}
              />
            ),
            code: ({ className, children, ...rest }) => {
              const match = /language-(\w+)/.exec(className || "");
              if (match) {
                return (
                  <pre
                    className={className}
                    style={{
                      whiteSpace: "pre-wrap",
                      overflowX: "auto",
                      padding: "10px",
                      borderRadius: "8px",
                      background: "#f6f8fa",
                      fontSize: "12px",
                    }}
                  >
                    <code
                      className={className}
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                      }}
                      {...rest}
                    >
                      {String(children).replace(/\n$/, "")}
                    </code>
                  </pre>
                );
              }
              return (
                <code
                  className={className}
                  style={{
                    padding: "2px 4px",
                    borderRadius: "4px",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                  {...rest}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {trimmedMessage}
        </ReactMarkdown>
      </div>

      {/* Conditionally render PreviewLinks only if the message contains links */}
      {messageHasLinks && <PreviewLinks item={item} />}

      {item.media && item.media.length > 0 && (
        <div className="mt-2 flex items-start flex-wrap gap-4">
          {item.media.map((mediaItem) => (
            <AssetToDelete key={mediaItem.id} mediaItem={mediaItem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageItem;
