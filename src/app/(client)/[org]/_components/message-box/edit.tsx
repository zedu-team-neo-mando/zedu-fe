"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Link2,
  List,
  ListOrdered,
  Code,
  Smile,
} from "lucide-react";
import UseTextEditor from "../editor";
import { normalizeOutgoingMessageHtml } from "../editor/normalize-message-html";
import { DataContext } from "~/store/GlobalState";
import { EditorContent } from "@tiptap/react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Picker from "~/components/theme/themed-emoji-picker";
import data from "@emoji-mart/data";
import { ACTIONS } from "~/store/Actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

const EditMessageBox = ({ subscription, sendMessage }: any) => {
  const { editor } = UseTextEditor(subscription);
  const { state, dispatch } = useContext(DataContext);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [showFormatting, setShowformatting] = useState(true);

  const handleSave = () => {
    if (!text || !url) return;

    editor
      ?.chain()
      .focus()
      .insertContent(
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
      )
      .run();

    setOpen(false);
    setText("");
    setUrl("");
  };

  // Handle message submission (no need to upload images here)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const editorText = editor?.getText() ?? "";
    let content = normalizeOutgoingMessageHtml(
      editor?.getHTML() ?? "",
      editorText
    );

    const strippedContent = content?.replace(/<[^>]+>/g, "").trim();

    if (!strippedContent) {
      return;
    }

    if (subscription) {
      sendMessage(content);
      // editor?.commands?.clearContent();
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        return;
      } else if (
        editor?.isActive("bulletList") ||
        editor?.isActive("orderedList")
      ) {
        event.preventDefault();
        editor?.chain().focus().splitListItem("listItem").run();
      } else {
        event.preventDefault();
        handleSubmit(event);
      }
    }
  };

  const onEmojiClick = (emojiData: any) => {
    const native = emojiData?.native as string | undefined;
    if (!editor || !native) return;
    setIsEmojiPickerOpen(false);
    queueMicrotask(() => {
      editor.chain().focus().insertContent(native).run();
    });
  };

  useEffect(() => {
    if (editor) {
      editor?.commands.setContent(state?.thread?.message);
      editor.commands.focus();
    }
  }, [editor]);

  //

  return (
    <>
      <div
        // onMouseLeave={() => handleTyping(false)}
        className={`bg-white border rounded border-[#E6EAEF] w-full ${state?.reply ? "right-[520px]" : "right-0"}`}
      >
        {showFormatting && (
          <div className="border-b border-[#E6EAEF] flex items-center gap-2 mb-2 bg-[#F9FAFB] pl-3 pr-4 py-[5px]">
            {/* Bold */}
            <button
              aria-label="Bold"
              aria-pressed={editor?.isActive("bold") ?? false}
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-1.5 hover:bg-gray-100 rounded ${
                editor?.isActive("bold")
                  ? "bg-gray-200 font-semibold text-black"
                  : ""
              }`}
            >
              <Bold
                size={18}
                color={editor?.isActive("bold") ? "#444444" : "#CACACA"}
              />
            </button>

            {/* Italic */}
            <button
              aria-label="Italic"
              aria-pressed={editor?.isActive("italic") ?? false}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-1.5 hover:bg-gray-100 rounded ${
                editor?.isActive("italic")
                  ? "bg-gray-200 font-semibold text-black"
                  : ""
              }`}
            >
              <Italic
                size={18}
                color={editor?.isActive("italic") ? "#444444" : "#CACACA"}
              />
            </button>

            {/* Strikethrough */}
            <button
              aria-label="Strikethrough"
              aria-pressed={editor?.isActive("strike") ?? false}
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              className={`p-1.5 hover:bg-gray-100 rounded ${
                editor?.isActive("strike")
                  ? "bg-gray-200 font-semibold text-black"
                  : ""
              }`}
            >
              <Strikethrough
                size={18}
                color={editor?.isActive("strike") ? "#444444" : "#CACACA"}
              />
            </button>

            <div className="w-px h-5 bg-[#E6EAEF]" />

            {/* Link */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button
                  aria-label="Add link"
                  onClick={() => setOpen(true)}
                  className={`p-1.5 hover:bg-gray-100 rounded ${editor?.isActive("link") ? "bg-gray-200 font-semibold text-black" : ""}`}
                >
                  <Link2
                    size={18}
                    color={editor?.isActive("link") ? "#444444" : "#CACACA"}
                  />
                </button>
              </DialogTrigger>

              <DialogContent className="w-full max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-semibold">Add link</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Text</label>
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter link text"
                  />

                  <label className="text-sm font-medium mt-2">Link</label>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL"
                    type="url"
                  />
                </div>

                <DialogFooter className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!text || !url}
                    className="bg-blue-500 text-white px-10"
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <button
              aria-label="Numbered list"
              aria-pressed={editor?.isActive("orderedList") ?? false}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 hover:bg-gray-100 rounded ${
                editor?.isActive("orderedList")
                  ? "bg-gray-200 font-semibold text-black"
                  : ""
              }`}
            >
              <ListOrdered
                size={18}
                color={editor?.isActive("orderedList") ? "#444444" : "#CACACA"}
              />
            </button>

            {/* Unordered List */}
            <button
              aria-label="Bulleted list"
              aria-pressed={editor?.isActive("bulletList") ?? false}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-1.5 hover:bg-gray-100 rounded ${
                editor?.isActive("bulletList")
                  ? "bg-gray-200 font-semibold text-black"
                  : ""
              }`}
            >
              <List
                size={18}
                color={editor?.isActive("bulletList") ? "#444444" : "#CACACA"}
              />
            </button>

            <div className="w-px h-5 bg-[#E6EAEF]" />

            {/* Inline Code */}
            <button
              aria-label="Inline code"
              aria-pressed={editor?.isActive("code") ?? false}
              onClick={() => editor?.chain().focus().toggleCode().run()}
              className={`p-1.5 hover:bg-gray-100 rounded ${
                editor?.isActive("code")
                  ? "bg-gray-200 font-semibold text-black"
                  : ""
              }`}
            >
              <Code
                size={18}
                color={editor?.isActive("code") ? "#444444" : "#CACACA"}
              />
            </button>
          </div>
        )}

        <div className="flex-1 relative px-3">
          <EditorContent
            editor={editor}
            className="py-2 rounded-md flex flex-row overflow-auto"
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 py-2 pl-3 pr-4">
            <button
              aria-label={
                showFormatting ? "Hide formatting" : "Show formatting"
              }
              title="show formatting"
              onClick={() => setShowformatting((prev) => !prev)}
              className="p-1.5 hover:bg-gray-100 rounded text-[#606060] underline"
            >
              Aa
            </button>

            <div className="relative">
              <Popover
                open={isEmojiPickerOpen}
                onOpenChange={setIsEmojiPickerOpen}
              >
                <PopoverTrigger asChild>
                  <button
                    aria-label="Emoji"
                    className="p-1.5 hover:bg-gray-100 rounded"
                  >
                    <Smile size={18} color="#606060" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-full max-w-xs">
                  <Picker data={data} onEmojiSelect={onEmojiClick} />
                </PopoverContent>
              </Popover>

              {/* <button
              onClick={toggleEmojiPicker}
              className="p-1.5 hover:bg-gray-100 rounded"
            >
              <Smile size={18} color="#606060" />
            </button>

            {isEmojiPickerOpen && (
              <div className="absolute bottom-full mb-2 z-10">
                <Picker
                  data={data}
                  onEmojiSelect={onEmojiClick}
                  theme="light"
                  onClickOutside={() => setIsEmojiPickerOpen(false)}
                />
              </div>
            )} */}
            </div>
          </div>

          <div className="flex items-center gap-1 py-2 pl-3 pr-4">
            <button
              className="bg-gray-100 rounded py-2 px-4 text-xs"
              onClick={() =>
                dispatch({ type: ACTIONS.IS_EDIT, payload: false })
              }
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="bg-blue-500 rounded py-2 px-4 text-white text-xs"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditMessageBox;
