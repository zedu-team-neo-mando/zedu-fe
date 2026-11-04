"use client";

import {
  AtSign,
  Bold,
  Code,
  SquareCode,
  Hash,
  Italic,
  Upload,
  Link2,
  List,
  ListOrdered,
  Mic,
  SendHorizonal,
  Slash,
  Smile,
  Strikethrough,
  Video,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { ACTIONS } from "~/store/Actions";
import { Button } from "~/components/ui/button";
import { DataContext } from "~/store/GlobalState";
import { EditorContent } from "@tiptap/react";
import { Input } from "~/components/ui/input";
import Picker from "~/components/theme/themed-emoji-picker";
import GifPicker from "~/components/gifs/gif-picker";
import Tooltips from "../tooltip";
import { localGifToFile, type LocalGif } from "~/lib/gifs/local-pack";
import UseTextEditor from "../editor";
import { normalizeOutgoingMessageHtml } from "../editor/normalize-message-html";
import UseTyping from "../typing-users/use-typing";
import TypingUsers from "../typing-users";
import { VoiceRecorder } from "../voice/voice-recorder";
import data from "@emoji-mart/data";
import emojione from "emojione";
import { emoticonMap } from "./emoticon-map";
import { AttachmentList } from "./attachment-list";
import { useAttachments } from "./use-attachments";
import { useParams } from "next/navigation";
import { MessageDelivery, type DeliveryAttempt } from "./message-delivery";
import { uuidv7 } from "uuidv7";
import { CHAT_FILE_ACCEPT } from "~/utils/document-files";
import {
  clearMessageDraft,
  finishMessageDraftSend,
  loadMessageDraft,
  messageDraftKey,
  saveMessageDraft,
} from "./message-drafts";

const MessageBox = ({
  subscription,
  sendMessage,
  show = true,
  channelLoading = false,
  draftKey,
  showTyping = true,
  typingScope = "channel",
}: any) => {
  const { state, dispatch } = useContext(DataContext);
  const params = useParams();
  const id = params.id as string;
  const delivery = useRef(new MessageDelivery());
  const [, refreshDelivery] = useState(0);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isGifPickerOpen, setIsGifPickerOpen] = useState(false);
  const [showFormatting, setShowformatting] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const { attachments, uploaded, readyToSend, add, remove, retry } =
    useAttachments();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    // Create a real FileList to mimic an <input type="file">
    const dt = new DataTransfer();
    Array.from(files).forEach((file) => dt.items.add(file));

    handleFileChange({
      target: {
        files: dt.files, // full FileList with all types
      },
    } as any);
  };

  const handleImagePaste = (file: File) => add([file]);

  const { handleTyping } = UseTyping(subscription);
  const { editor, isEmpty } = UseTextEditor(
    subscription,
    handleImagePaste,
    handleTyping
  );
  const storageKey = messageDraftKey(
    state.user?.user_id ?? state.user?.id ?? "",
    String(params.org ?? ""),
    draftKey || (id ? `conversation:${id}` : "")
  );
  const activeScope = useRef(storageKey);
  activeScope.current = storageKey;
  const attachmentScope = useRef(storageKey);
  useEffect(() => {
    if (attachmentScope.current !== storageKey) {
      // The retry closure retains uploaded media, but previews must not leak
      // into a different conversation's composer.
      attachments.forEach((attachment) => remove(attachment.id));
      attachmentScope.current = storageKey;
    }
  }, [storageKey, attachments, remove]);
  const failedDelivery = delivery.current.get(storageKey);
  const sending = delivery.current.busy;

  const runDelivery = async (attempt: DeliveryAttempt, isRetry = false) => {
    if (delivery.current.busy || channelLoading || !subscription) return;
    if (
      isRetry &&
      (delivery.current.get(attempt.scope) !== attempt ||
        attempt.status !== "failed")
    )
      return;
    const result = delivery.current.deliver(attempt, isRetry);
    dispatch({
      type: ACTIONS.MESSAGE_DELIVERY,
      payload: { id: attempt.id, status: "pending" },
    });
    refreshDelivery((value) => value + 1);
    const sent = await result;
    dispatch({
      type: ACTIONS.MESSAGE_DELIVERY,
      payload: { id: attempt.id, status: sent ? "sent" : "failed" },
    });
    // Preserve staging's late-send draft reconciliation without touching the
    // editor belonging to a different conversation (or an unmounted composer).
    if (
      !mounted.current ||
      activeScope.current !== attempt.scope ||
      editor?.isDestroyed
    ) {
      finishMessageDraftSend(attempt.scope, attempt.html, sent);
    }
    if (!mounted.current) return;
    if (sent && activeScope.current === attempt.scope && !editor?.isDestroyed) {
      // Keep anything composed while the request was in flight.
      if (editor?.getHTML() === attempt.html) {
        editor.commands.clearContent();
        clearMessageDraft(attempt.scope);
        dispatch({ type: ACTIONS.CLEAR_MENTIONS });
      }
      attempt.attachmentIds.forEach(remove);
    }
    refreshDelivery((value) => value + 1);
  };

  useEffect(() => {
    if (!editor || !storageKey) return;

    const persist = () => {
      saveMessageDraft(storageKey, editor.getHTML(), editor.isEmpty);
    };

    const saved = loadMessageDraft(storageKey);
    if (saved) {
      editor.commands.setContent(saved);
      editor.commands.focus("end");
    } else if (!editor.isEmpty) {
      editor.commands.clearContent();
    }

    editor.on("update", persist);

    return () => {
      persist();
      editor.off("update", persist);
    };
  }, [editor, storageKey]);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    add(Array.from(files));
  };

  const replaceEmoticonsWithEmojis = (text: string) => {
    let convertedText = text;
    for (const emoticon in emoticonMap) {
      const escapedEmoticon = emoticon.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapedEmoticon, "g");
      convertedText = convertedText.replace(regex, emoticonMap[emoticon]);
    }
    return convertedText;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (channelLoading || !editor || delivery.current.busy) return;

    // Get full HTML content from editor (keeps links, mentions, etc.)
    const editorText = editor.getText();
    let content = normalizeOutgoingMessageHtml(editor.getHTML(), editorText);

    // Extract plain text to check if there's any content (ignore tags)
    const plainTextContent = editorText.trim();
    const hasTextContent = plainTextContent.length > 0;

    if (!hasTextContent && attachments.length === 0) return;
    if (!readyToSend()) return;

    // Enter/Send on an unchanged failed message is the same retry action.
    if (
      failedDelivery?.status === "failed" &&
      failedDelivery.html === editor.getHTML() &&
      attachments.length === failedDelivery.attachmentIds.length &&
      attachments.every((attachment) =>
        failedDelivery.attachmentIds.includes(attachment.id)
      )
    ) {
      await runDelivery(failedDelivery, true);
      return;
    }

    handleTyping(false);

    // Convert emoticons in the plain text, but apply them inside the HTML
    const textWithEmoticonsConverted =
      replaceEmoticonsWithEmojis(plainTextContent);
    const fullyConvertedText = emojione.shortnameToUnicode(
      textWithEmoticonsConverted
    );

    content = content.replace(plainTextContent, fullyConvertedText);

    if (subscription) {
      const attemptId = uuidv7();
      const media = structuredClone(uploaded);
      const mentions = structuredClone(state?.mentions);
      const attempt: DeliveryAttempt = {
        scope: storageKey,
        id: attemptId,
        html: editor.getHTML(),
        preview: editorText,
        attachmentIds: attachments.map((attachment) => attachment.id),
        status: "sending",
        // Capture the callback too: a later render may point at another thread.
        send: (isRetry) =>
          sendMessage(id, attemptId, content, media, mentions, isRetry),
      };
      await runDelivery(attempt);
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      if (editor?.isActive("codeBlock")) {
        return;
      }

      if (event.shiftKey || event.ctrlKey || event.metaKey) {
        // Mod-Enter is bound by the editor to setHardBreak; returning here
        // stops it from also submitting the message.
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

  const handleGifSelect = async (gif: LocalGif) => {
    setIsGifPickerOpen(false);

    try {
      // Same attach flow as picking a media file
      add([await localGifToFile(gif)]);
    } catch (error) {
      console.error("GIF select failed", error);
    }
  };

  const handleMentionClick = () => {
    editor?.chain().focus().insertContent("@").run();
  };

  const handleChannelMentionClick = () => {
    editor?.chain().focus().insertContent("#").run();
  };

  const handleSlashCommandClick = () => {
    editor?.chain().focus().insertContent("/").run();
  };

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!channelLoading);
    if (!channelLoading) {
      editor.commands.focus();
    }
  }, [editor, channelLoading]);

  const handleSendVoice = (audioBlob: Blob, duration: number) => {
    // Wrap the Blob in a File object for FormData
    const audioFile = new File([audioBlob], `voice_message_${Date.now()}.wav`, {
      type: audioBlob.type || "audio/wav",
    });

    add([audioFile], {
      content: "",
      duration,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    setIsRecording(false);
  };

  const composerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = composerRef.current;
    if (!el) return;

    const updateComposerHeight = () => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty(
        "--chat-composer-height",
        `${Math.max(height, 140)}px`
      );
    };

    updateComposerHeight();
    const observer = new ResizeObserver(updateComposerHeight);
    observer.observe(el);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--chat-composer-height");
    };
  }, []);

  return (
    <div ref={composerRef} className="relative z-20 w-full bg-white pb-3">
      {isRecording && (
        <VoiceRecorder
          onSend={handleSendVoice}
          onCancel={() => setIsRecording(false)}
        />
      )}

      <div className="relative mx-3 md:mx-5 pb-3">
        {failedDelivery?.status === "failed" && (
          <div
            role="alert"
            className="mb-2 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          >
            <div className="min-w-0">
              <p>Message failed to send.</p>
              <p className="truncate text-xs">
                {failedDelivery.preview || "Attached message"}
                {failedDelivery.attachmentIds.length > 0 &&
                  ` (${failedDelivery.attachmentIds.length} attachments)`}
              </p>
            </div>
            <button
              type="button"
              disabled={sending || channelLoading || !subscription}
              className="font-semibold underline disabled:opacity-50"
              onClick={() => void runDelivery(failedDelivery, true)}
            >
              Retry message
            </button>
          </div>
        )}
        {sending && (
          <p role="status" className="mb-2 text-sm text-gray-600">
            Sending message…
          </p>
        )}
        <div
          onClick={() => !channelLoading && editor && editor.commands.focus()}
          onDragOver={handleDragOver}
          onDrop={channelLoading ? undefined : handleDrop}
          aria-disabled={channelLoading}
          className={`bg-white border rounded-xl border-[#E6EAEF] overflow-hidden ${state?.reply ? "sm:right-[520px] right-0" : "right-0"} ${editor?.isFocused ? "border-primary-400" : "border-gray-200"} ${channelLoading ? "pointer-events-none opacity-60" : ""}`}
        >
          {showFormatting && (
            <div className="border-b border-[#E6EAEF] flex items-center gap-2 bg-[#F9FAFB] pl-3 pr-4 py-[5px]">
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
                    <DialogTitle className="font-semibold">
                      Add link
                    </DialogTitle>
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
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
                className={`p-1.5 hover:bg-gray-100 rounded ${
                  editor?.isActive("orderedList")
                    ? "bg-gray-200 font-semibold text-black"
                    : ""
                }`}
              >
                <ListOrdered
                  size={18}
                  color={
                    editor?.isActive("orderedList") ? "#444444" : "#CACACA"
                  }
                />
              </button>

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

              <button
                aria-label="Inline code"
                aria-pressed={editor?.isActive("code") ?? false}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => editor?.chain().focus().toggleCode().run()}
                className={`p-1.5 hover:bg-gray-100 rounded ${
                  editor?.isActive("code")
                    ? "bg-gray-200 font-semibold text-black"
                    : ""
                }`}
                title="Inline code"
              >
                <Code
                  size={18}
                  color={editor?.isActive("code") ? "#444444" : "#CACACA"}
                />
              </button>

              <button
                aria-label="Code block"
                aria-pressed={editor?.isActive("codeBlock") ?? false}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                className={`p-1.5 hover:bg-gray-100 rounded ${
                  editor?.isActive("codeBlock")
                    ? "bg-gray-200 font-semibold text-black"
                    : ""
                }`}
                title="Code block"
              >
                <SquareCode
                  size={18}
                  color={editor?.isActive("codeBlock") ? "#444444" : "#CACACA"}
                />
              </button>
            </div>
          )}

          <div className="md:flex-1 relative px-3">
            <EditorContent
              editor={editor}
              className="py-2 rounded-md flex flex-row overflow-auto"
              onKeyDown={handleKeyDown}
            />

            <AttachmentList
              attachments={attachments}
              onRemove={remove}
              onRetry={retry}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 py-2 pl-3 pr-4">
              <Tooltips text="Upload from your computer">
                <button
                  aria-label="Upload from your computer"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 hover:bg-gray-100 rounded-full bg-[#F2F4F7]"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    accept={CHAT_FILE_ACCEPT}
                    multiple
                  />

                  <Upload size={18} color="#606060" />
                </button>
              </Tooltips>

              <Tooltips
                text={!showFormatting ? "Show formatting" : "Hide formatting"}
              >
                <button
                  aria-label={
                    showFormatting ? "Hide formatting" : "Show formatting"
                  }
                  onClick={() => setShowformatting((prev) => !prev)}
                  className="p-1.5 hover:bg-gray-100 rounded text-[#606060] underline"
                >
                  Aa
                </button>
              </Tooltips>

              <Tooltips text="Emoji">
                <div className="relative">
                  <Popover
                    open={isEmojiPickerOpen}
                    onOpenChange={(open) => {
                      setIsEmojiPickerOpen(open);
                      if (open) setIsGifPickerOpen(false);
                    }}
                  >
                    <PopoverTrigger asChild>
                      <button
                        aria-label="Emoji"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEmojiPickerOpen((prev) => !prev);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded"
                      >
                        <Smile size={18} color="#606060" />
                      </button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="p-0 w-full max-w-xs"
                      onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
                    >
                      <Picker data={data} onEmojiSelect={onEmojiClick} />
                    </PopoverContent>
                  </Popover>
                </div>
              </Tooltips>

              <Tooltips text="GIF">
                <div className="relative">
                  <Popover
                    open={isGifPickerOpen}
                    onOpenChange={(open) => {
                      setIsGifPickerOpen(open);
                      if (open) setIsEmojiPickerOpen(false);
                    }}
                  >
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsGifPickerOpen((prev) => !prev);
                        }}
                        className="px-1.5 py-1 hover:bg-gray-100 rounded"
                        aria-label="GIF"
                      >
                        <span className="block text-[10px] font-bold leading-none tracking-wide text-[#606060] border border-[#606060] rounded px-1 py-0.5">
                          GIF
                        </span>
                      </button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-auto p-0 border-0 shadow-none"
                      align="start"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GifPicker onSelect={handleGifSelect} />
                    </PopoverContent>
                  </Popover>
                </div>
              </Tooltips>

              <Tooltips text="Mention someone">
                <button
                  aria-label="Mention someone"
                  onClick={handleMentionClick}
                  className="p-1.5 hover:bg-gray-100 rounded"
                >
                  <AtSign size={18} color="#606060" />
                </button>
              </Tooltips>

              <Tooltips text="Mention a channel">
                <button
                  aria-label="Mention a channel"
                  onClick={handleChannelMentionClick}
                  className="p-1.5 hover:bg-gray-100 rounded"
                >
                  <Hash size={18} color="#606060" />
                </button>
              </Tooltips>

              <Tooltips text="Slash commands">
                <button
                  aria-label="Slash commands"
                  onClick={handleSlashCommandClick}
                  className="p-1.5 hover:bg-gray-100 rounded"
                >
                  <Slash size={18} color="#606060" />
                </button>
              </Tooltips>

              {show && (
                <Fragment>
                  <div className="w-px h-5 bg-[#E6EAEF] hidden sm:flex" />

                  {/* <Tooltips text="Record video clip">
                  <button className="p-1.5 hover:bg-gray-100 rounded hidden sm:flex">
                    <Video size={18} color="#606060" />
                  </button>
                </Tooltips> */}

                  <Tooltips text="Record audio">
                    <button
                      aria-label="Record audio"
                      className="p-1.5 hover:bg-gray-100 rounded hidden sm:flex"
                      onClick={() => setIsRecording(true)}
                      disabled={isRecording}
                    >
                      <Mic size={18} color="#606060" />
                    </button>
                  </Tooltips>
                </Fragment>
              )}
            </div>

            <div className="flex items-center gap-1 py-2 pl-3 pr-4">
              <button
                aria-label="Send message"
                type="submit"
                className="p-1.5 hover:bg-gray-100 rounded size-8 flex items-center justify-center"
                onClick={handleSubmit}
                disabled={
                  channelLoading ||
                  sending ||
                  (isEmpty && attachments.length === 0)
                }
              >
                <SendHorizonal
                  className={
                    isEmpty && attachments.length === 0
                      ? "text-[#999] dark:text-zinc-500"
                      : "text-zinc-900 dark:text-zinc-100"
                  }
                />
              </button>
            </div>
          </div>
        </div>
        {showTyping ? <TypingUsers scope={typingScope} /> : null}
      </div>
    </div>
  );
};

export default MessageBox;
