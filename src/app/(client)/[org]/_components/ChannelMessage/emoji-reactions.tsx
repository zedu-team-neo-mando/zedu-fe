import React, { useState } from "react";

type User = {
  id: string;
  username: string;
};

type Reaction = {
  emoji: string;
  users: User[];
};

type Props = {
  currentUser: User;
};

const MAX_REACTIONS = 23;

const EmojiReactions: React.FC<Props> = ({ currentUser }) => {
  const [reactions, setReactions] = useState<Reaction[]>([]);

  const toggleReaction = (emoji: string) => {
    setReactions((prev) => {
      const index = prev.findIndex((r) => r.emoji === emoji);
      if (index !== -1) {
        const existing = prev[index];
        const hasUser = existing.users?.find((u) => u.id === currentUser.id);
        const updatedUsers = hasUser
          ? existing.users.filter((u) => u.id !== currentUser.id)
          : [...existing.users, currentUser];

        if (updatedUsers.length === 0) {
          return prev.filter((_, i) => i !== index);
        }

        const updatedReaction = { ...existing, users: updatedUsers };
        return [
          ...prev.slice(0, index),
          updatedReaction,
          ...prev.slice(index + 1),
        ];
      }

      if (prev.length < MAX_REACTIONS) {
        return [...prev, { emoji, users: [currentUser] }];
      }

      return prev;
    });
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2 max-w-full">
      {reactions.map((reaction, i) => {
        const isReacted = reaction.users.some((u) => u.id === currentUser.id);
        const tooltipUsers = reaction.users
          .slice(0, 3)
          .map((u) => u.username)
          .join(", ");
        const moreCount =
          reaction.users.length > 3 ? ` +${reaction.users.length - 3}` : "";

        return (
          <button
            key={i}
            type="button"
            className={`border px-2 py-1 rounded-full text-sm flex items-center gap-1 ${
              isReacted
                ? "bg-blue-200 border-blue-400"
                : "bg-white border-gray-300"
            }`}
            onClick={() => toggleReaction(reaction.emoji)}
            title={`${tooltipUsers}${moreCount}`}
            aria-label={`${reaction.emoji} reaction, ${reaction.users.length}`}
            aria-pressed={isReacted}
          >
            <span>{reaction.emoji}</span>
            <span>{reaction.users.length}</span>
          </button>
        );
      })}

      {reactions.length < MAX_REACTIONS && (
        <button
          type="button"
          className="border px-2 py-1 rounded-full text-sm bg-white border-gray-300"
          onClick={() => {
            const emoji = prompt("Pick emoji (e.g. 😄)");
            if (emoji) toggleReaction(emoji);
          }}
          aria-label="Add reaction"
          title="Add reaction"
        >
          ➕
        </button>
      )}
    </div>
  );
};

export default EmojiReactions;
