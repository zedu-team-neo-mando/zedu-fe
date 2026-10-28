"use client";
import React, { useEffect, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import {
  Bookmark,
  Forward,
  MessageCircleMore,
  MoreVertical,
  Plus,
  SmilePlus,
  X,
} from "lucide-react";
import images from "~/assets/images";
import { Button } from "~/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { BotMessages } from "../../../constants/messages";
import { uiAvatarUrl } from "~/lib/env-urls";

export interface User {
  id: string;
  fullName: string;
  displayName: string;
  avatar: StaticImageData;
  color: string;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: string;
  avatar: string;
  type: string;
}

interface Platform {
  name: string;
  icon: StaticImageData;
}

const AgentPage = () => {
  const [messages, setMessages] = useState<any[]>(BotMessages);
  // const [showThreads, setShowThreads] = useState(false);
  // const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [handles, setHandles] = useState<{ [key: string]: string }>({});
  const [isEditing, setIsEditing] = useState(true);
  const [links, setLinks] = useState<string[]>([]);
  const [isEditingLinks, setIsEditingLinks] = useState(true);
  const [domainLinks, setDomainLinks] = useState<string[]>([]);
  const [domainNames, setDomainNames] = useState<string[]>([]);
  const [isEditingDomainLinks, setIsEditingDomainLinks] = useState(true);
  const [codeInput, setCodeInput] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("markdown");
  const [selectedCodeOptions, setSelectedCodeOptions] = useState<{
    [key: string]: string;
  }>({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return; // Don't send empty messages

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp: "2021-01-01 12:00:00",
      sender: "Adaeze Ndupu",
      avatar: uiAvatarUrl("Adaeze Ndupu"),
      type: "textBlock",
    };

    // Always add the user message first
    setMessages([...messages, newMessage]);

    // If the message is "paste code", send the code block response after the user message
    if (text.toLowerCase() === "paste code") {
      setTimeout(() => {
        handleSendCodeBlock();
      }, 100); // Small delay to ensure messages appear in correct order
    }

    if (text.toLowerCase() === "apply fix") {
      setTimeout(() => {
        handleApplyFix();
      }, 100); // Small delay to ensure messages appear in correct order
    }
  };

  const handleSendCodeBlock = () => {
    const newMessage = {
      id: Date.now().toString(),
      sender: "Knox - Code Analyser",
      timestamp: "2021-01-01 12:00:00",
      avatar: images.bot,
      color: "#FEE8E6",
      type: "codeBlock",
      language: "markdown",
      code: `-----------------------------------------------
Paste your code below for analysis:
-----------------------------------------------`,
      state: "input", // can be "input" or "display"
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleApplyFix = () => {
    const newMessage = {
      id: 15,
      sender: "Knox - Code Analyser",
      timestamp: "2021-01-01 12:00:00",
      avatar: images.bot,
      type: "codeAlertBlock",
      color: "#FEE8E6",
      text: "Your code is now secure! Let me know if you need another scan.",
      codes: [
        {
          language: "php",
          code: `<?php
$username = $_GET['username'];
// Using prepared statements to prevent SQL injection
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
?>||`,
          alert: "green",
        },
      ],
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // const getPlaceholderText = () => {
  //   return `Message ${user.fullName}`;
  // };

  // const handleThreadClick = () => {
  //   // setSelectedMessage(message);
  //   setShowThreads(true);
  // };

  const removePlatform = (platformName: string) => {
    setPlatforms(platforms.filter((p) => p.name !== platformName));
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const removeDomainLink = (index: number) => {
    setDomainLinks(domainLinks.filter((_, i) => i !== index));
    setDomainNames(domainNames.filter((_, i) => i !== index));
  };

  const addPlatform = () => {
    const availablePlatforms = [
      { name: "Instagram", icon: images.instagram },
      { name: "Twitter", icon: images.twitter },
      { name: "Tiktok", icon: images.tiktok },
      { name: "Facebook", icon: images.facebook },
      { name: "Youtube", icon: images.youtube },
    ];

    const unusedPlatform = availablePlatforms?.find(
      (p) => !platforms.some((existing) => existing.name === p.name)
    );

    if (unusedPlatform) {
      setPlatforms([...platforms, unusedPlatform]);
    }
  };

  const addLink = () => {
    setLinks([...links, ""]);
  };

  const addDomainLink = () => {
    setDomainLinks([...domainLinks, ""]);
    setDomainNames([...domainNames, ""]);
  };

  const handleSubmit = () => {
    if (
      Object.keys(handles).length === platforms.length &&
      Object.values(handles).every((handle) => handle.trim())
    ) {
      setIsEditing(false);
    }
  };

  const handleLinkSubmit = () => {
    if (links.every((link) => link.trim())) {
      setIsEditingLinks(false);
    }
  };

  const handleDomainLinkSubmit = () => {
    if (
      domainLinks.every((link) => link.trim()) &&
      domainNames.every((name) => name.trim())
    ) {
      setIsEditingDomainLinks(false);
    }
  };

  const updateHandle = (platformName: string, value: string) => {
    setHandles({ ...handles, [platformName]: value });
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const updateDomainLink = (index: number, value: string) => {
    const newDomainLinks = [...domainLinks];
    newDomainLinks[index] = value;
    setDomainLinks(newDomainLinks);
  };

  const updateDomainName = (index: number, value: string) => {
    const newDomainNames = [...domainNames];
    newDomainNames[index] = value;
    setDomainNames(newDomainNames);
  };

  const displayMessageBlock = (message: any) => {
    if (message.type === "textBlock") {
      return <p className="text-[#344054] text-[15px] mb-2">{message.text}</p>;
    } else if (message.type === "linkBlock") {
      return (
        <div className="flex flex-col gap-2 mb-2">
          <p className="text-[#344054] text-[15px]">{message.text}</p>
          <div className="p-2 bg-[#F1F1FE] rounded-[5px] flex flex-col gap-4">
            {links.map((link, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1 max-w-[400px] flex items-center bg-white border border-[#E6EAEF] rounded py-[9px] px-3">
                  <div className="text-[#98A2B3] text-sm mr-2 whitespace-nowrap">
                    https:// |
                  </div>
                  <input
                    type="text"
                    placeholder="example.com"
                    value={link}
                    onChange={(e) => updateLink(index, e.target.value)}
                    disabled={!isEditingLinks}
                    className="bg-transparent flex-1 outline-none text-[15px] text-[#344054] placeholder:text-[#98A2B3]"
                  />
                </div>
                {isEditingLinks && (
                  <button onClick={() => removeLink(index)}>
                    <X size={20} strokeWidth={1.5} className="text-[#344054]" />
                  </button>
                )}
              </div>
            ))}
            {isEditingLinks && (
              <div className="flex items-center gap-4">
                <Button
                  className="flex items-center gap-2 p-0"
                  onClick={addLink}
                >
                  <Plus size={14} strokeWidth={1} className="text-[#7141F8]" />
                  <span className="text-[#7141F8] text-xs">Add a link</span>
                </Button>
                <Button
                  className="bg-[#7141F8] text-white h-8 w-full max-w-[75px]"
                  onClick={handleLinkSubmit}
                  disabled={
                    !links.length || !links.every((link) => link.trim())
                  }
                >
                  <span>Send</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    } else if (message.type === "domainLinkBlock") {
      return (
        <div className="flex flex-col w-full gap-2 mb-2">
          <p className="text-[#344054] text-[15px]">{message.text}</p>
          <div className="p-2 bg-[#F1F1FE] rounded-[5px] flex flex-col gap-4 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
            {domainLinks.length > 0 ? (
              domainLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex gap-2 w-full max-w-[500px]">
                    <div className="flex w-[174px] max-w-[174px] items-center bg-white border border-[#E6EAEF] rounded py-[9px] px-3">
                      <input
                        type="text"
                        placeholder="E.g Main Domain"
                        value={domainNames[index] || ""}
                        onChange={(e) =>
                          updateDomainName(index, e.target.value)
                        }
                        disabled={!isEditingDomainLinks}
                        className="bg-transparent flex-1 outline-none text-[15px] text-[#344054] placeholder:text-[#98A2B3]"
                      />
                    </div>
                    <div className="flex flex-1 items-center bg-white border border-[#E6EAEF] rounded py-[9px] px-3 overflow-hidden">
                      <div className="text-[#98A2B3] text-sm mr-2 whitespace-nowrap">
                        https:// |
                      </div>
                      <input
                        type="text"
                        placeholder="example.com"
                        value={link}
                        onChange={(e) =>
                          updateDomainLink(index, e.target.value)
                        }
                        disabled={!isEditingDomainLinks}
                        className="bg-transparent outline-none text-[15px] text-[#344054] placeholder:text-[#98A2B3] min-w-0"
                      />
                    </div>
                  </div>
                  {isEditingDomainLinks && (
                    <button onClick={() => removeDomainLink(index)}>
                      <X
                        size={20}
                        strokeWidth={1.5}
                        className="text-[#344054]"
                      />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex gap-2 w-full max-w-[500px]">
                  <div className="flex w-[174px] max-w-[174px] items-center bg-white border border-[#E6EAEF] rounded py-[9px] px-3">
                    <input
                      type="text"
                      placeholder="E.g Main Domain"
                      className="bg-transparent flex-1 outline-none text-[15px] text-[#344054] placeholder:text-[#98A2B3]"
                      onChange={(e) => {
                        if (domainNames.length === 0) {
                          updateDomainName(0, e.target.value);
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-1 items-center bg-white border border-[#E6EAEF] rounded py-[9px] px-3 overflow-hidden">
                    <div className="text-[#98A2B3] text-sm mr-2 whitespace-nowrap">
                      https:// |
                    </div>
                    <input
                      type="text"
                      placeholder="example.com"
                      className="bg-transparent outline-none text-[15px] text-[#344054] placeholder:text-[#98A2B3]"
                      onChange={(e) => {
                        if (domainLinks.length === 0) {
                          updateDomainLink(0, e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (domainLinks.length === 0 && domainNames.length === 0) {
                      setDomainLinks([""]);
                      setDomainNames([""]);
                    }
                  }}
                >
                  <X size={20} strokeWidth={1.5} className="text-[#344054]" />
                </button>
              </div>
            )}
            {isEditingDomainLinks && (
              <div className="flex items-center gap-4">
                <Button
                  className="flex items-center gap-2 p-0"
                  onClick={addDomainLink}
                >
                  <Plus size={14} strokeWidth={1} className="text-[#7141F8]" />
                  <span className="text-[#7141F8] text-xs">Add a link</span>
                </Button>
                <Button
                  className="bg-[#7141F8] text-white h-8 w-full max-w-[75px]"
                  onClick={handleDomainLinkSubmit}
                  disabled={
                    !domainLinks.length ||
                    !domainLinks.every((link) => link.trim()) ||
                    !domainNames.every((name) => name.trim())
                  }
                >
                  <span>Send</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    } else if (message.type === "socialMediaBlock") {
      // Initialize platforms from message if not already set
      if (platforms.length === 0 && message.platforms) {
        setPlatforms(message.platforms);
      }

      return (
        <div className="flex flex-col gap-2 mb-2">
          <p className="text-[#344054] text-[15px]">{message.text}</p>
          <div className="p-2 bg-[#F1F1FE] rounded-[5px] flex flex-col gap-4">
            {platforms.map((platform, index) => (
              <div
                key={`${platform.name}-${index}`}
                className="flex items-center gap-3"
              >
                <Image
                  src={platform.icon}
                  alt={platform.name}
                  width={36}
                  height={36}
                  className="rounded-[3px]"
                />
                <div className="flex-1 w-full max-w-[400px] flex items-center bg-white border border-[#E6EAEF] rounded py-[9px] px-3">
                  <div className="text-[#98A2B3] text-sm mr-2 whitespace-nowrap">
                    @ |
                  </div>
                  <input
                    type="text"
                    placeholder="socialmediahandle"
                    value={handles[platform.name] || ""}
                    onChange={(e) =>
                      updateHandle(platform.name, e.target.value)
                    }
                    disabled={!isEditing}
                    className="bg-transparent flex-1 outline-none text-[15px] text-[#344054] placeholder:text-[#98A2B3]"
                  />
                </div>
                {isEditing && (
                  <button onClick={() => removePlatform(platform.name)}>
                    <X size={20} strokeWidth={1.5} className="text-[#344054]" />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <div className="flex items-center gap-4">
                <Button
                  className="flex items-center gap-2 p-0"
                  onClick={addPlatform}
                  disabled={platforms.length >= 5}
                >
                  <Plus
                    size={14}
                    strokeWidth={1}
                    className="text-[#7141F8] disabled:text-[#98A2B3]"
                  />
                  <span className="text-[#7141F8] disabled:text-[#98A2B3] text-xs">
                    Add an account
                  </span>
                </Button>
                <Button
                  className="bg-[#7141F8] text-white h-8 w-full max-w-[75px]"
                  onClick={handleSubmit}
                  disabled={
                    Object.keys(handles).length !== platforms.length ||
                    !Object.values(handles).every((handle) => handle.trim())
                  }
                >
                  <span>Send</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    } else if (message.type === "optionBlock") {
      return (
        <div className="flex flex-col gap-2 mb-2">
          <p className="text-[#344054] text-[15px]">{message.text}</p>
          <div className="flex flex-wrap gap-4 p-2 rounded-[5px] bg-[#F1F1FE]">
            {message.options.map((option: string, index: number) => (
              <div
                key={index}
                className="flex items-center gap-3 p-[10px] rounded-[9px] border border-[#E6EAEF] bg-white"
              >
                <label
                  htmlFor={`option-${index}`}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <span className="text-[#344054] text-sm">{option}</span>
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="option"
                      id={`option-${index}`}
                      className="peer h-4 w-4 appearance-none rounded-full border border-[#C5CCD3] bg-white checked:border-[#6868F7] cursor-pointer"
                      defaultChecked={index === 0}
                    />
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 ">
                      <div className="h-1.5 w-1.5 bg-[#6868F7] rounded-full" />
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (message.type === "optionSubmitBlock") {
      return (
        <div className="flex flex-col gap-2 w-full mb-2">
          <p className="text-[#344054] text-[15px]">{message.text}</p>
          <div className="flex justify-between flex-1 items-center gap-4 p-2 rounded-[5px] bg-[#F1F1FE]">
            <div className="w-fit flex gap-4">
              {message.options.map((option: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-[10px] rounded-[9px] border border-[#E6EAEF] bg-white"
                >
                  <label
                    htmlFor={`optionSubmit-${index}`}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <span className="text-[#344054] text-sm">{option}</span>
                    <div className="relative flex items-center">
                      <input
                        type="radio"
                        name="optionSubmit"
                        id={`optionSubmit-${index}`}
                        className="peer h-4 w-4 appearance-none rounded-full border border-[#C5CCD3] bg-white checked:border-[#6868F7] cursor-pointer"
                        defaultChecked={index === 0}
                      />
                      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 ">
                        <div className="h-1.5 w-1.5 bg-[#6868F7] rounded-full" />
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <Button className="bg-[#7141F8] text-white h-8 w-full max-w-[75px]">
              {message.submitText}
            </Button>
          </div>
        </div>
      );
    } else if (message.type === "alertBlock") {
      return (
        <div className="flex flex-col gap-2 w-full mb-2">
          <p className="text-[#344054] text-[15px]">{message.text}</p>
          <div className="flex flex-col w-full gap-2 p-2 rounded-[5px] bg-[#F1F1FE]">
            {message.options.map((option: any, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-[#667085] text-[15px]">
                  {option.icon} {option.name}:
                </span>
                <span className="text-[#344054] text-[15px]">
                  {option.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (message.type === "postBlock") {
      return (
        <div className="flex flex-col gap-2 w-full mb-2">
          <div className="flex flex-col w-full space-y-4 p-2 rounded-[5px] bg-[#F1F1FE]">
            {message.posts.map((post: any, index: number) => (
              <React.Fragment key={index}>
                <div className="flex gap-2">
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`w-[6px] h-[6px] rounded-[2px] ${post.alert === "red" ? "bg-[#FB6B61]" : post.alert === "black" ? "bg-[#344054]" : "bg-[#5EDF9A]"}`}
                    />
                    <div
                      className={`w-[1px] h-full ${post.alert === "red" ? "bg-[#FC9A93]" : post.alert === "black" ? "bg-[#98A2B3]" : "bg-[#91E9BA]"}`}
                    />
                    <div
                      className={`w-[6px] h-[6px] rounded-[2px] ${post.alert === "red" ? "bg-[#FB6B61]" : post.alert === "black" ? "bg-[#344054]" : "bg-[#5EDF9A]"}`}
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    {index === 0 && (
                      <div className="flex items-center gap-2">
                        <Image
                          src={message.icon}
                          alt={message.name}
                          width={24}
                          height={24}
                          className="rounded-[3px]"
                        />
                        <span className="text-[#344054] text-[15px]">
                          {message.platform} Update
                        </span>
                      </div>
                    )}
                    <h4 className="text-[#344054] text-[15px]">
                      {post.review}
                    </h4>
                    <div className="flex items-center gap-2 py-1 px-[6px] rounded-[3px] bg-white">
                      {post.type === "media" && (
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={72}
                          height={72}
                          className="rounded-[3px] border border-black/5"
                        />
                      )}
                      <div className="flex flex-col gap-2">
                        {post.type === "media" && (
                          <h5 className="text-[#344054] text-[15px]">
                            &quot;{post?.title}&quot;
                          </h5>
                        )}
                        {post.type === "media" &&
                          (post?.likes || post?.comments || post?.shares) && (
                            <div className="flex items-center gap-1">
                              <span className="text-[#667085] text-[15px]">
                                {post?.likes} Likes
                              </span>
                              <span className="text-[#667085] text-[15px]">
                                |
                              </span>
                              <span className="text-[#667085] text-[15px]">
                                {post?.comments} Comments
                              </span>
                              <span className="text-[#667085] text-[15px]">
                                |
                              </span>
                              <span className="text-[#667085] text-[15px]">
                                {post?.shares} Shares
                              </span>
                            </div>
                          )}

                        {post.type === "comment" && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-[#667085] text-[15px]">
                              @{post?.sender}:
                            </span>
                            <span className="text-[#344054] text-[15px]">
                              &quot;{post?.comment}&quot;
                            </span>
                          </div>
                        )}
                        <Button className="p-0 h-fit text-[#7141F8] text-[13px] w-fit">
                          {post.type === "media" ? "View Post" : "View Comment"}
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[#667085] text-[15px]">
                        Suggested Action:
                      </span>
                      <span className="text-[#344054] text-[15px]">
                        {post?.suggestion}
                      </span>
                    </div>
                  </div>
                </div>
                {index !== message.posts.length - 1 && (
                  <div className="h-[1px] bg-white w-full" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      );
    } else if (message.type === "codeOptionsBlock") {
      const hasSelectedOption = selectedCodeOptions[message.id];

      return (
        <div className="flex flex-col gap-2 w-full mb-2">
          <p className="text-[#344054] text-[15px]">{message.text}</p>
          <div className="flex gap-4 p-2 rounded-[5px] bg-[#F1F1FE]">
            {message.options.map((option: string, index: number) => {
              const isSelected = selectedCodeOptions[message.id] === option;

              if (hasSelectedOption) {
                return (
                  <div
                    key={index}
                    className={`text-[13px] flex items-center ${
                      isSelected ? "text-[#7141F8]" : "text-[#667085]"
                    }`}
                  >
                    {option}
                  </div>
                );
              }

              return (
                <Button
                  key={index}
                  className={`h-8 ${
                    index === 0
                      ? "border border-[#7141F8] bg-white text-[#7141F8]"
                      : "bg-[#7141F8] text-white"
                  }`}
                  onClick={() => {
                    setSelectedCodeOptions({
                      ...selectedCodeOptions,
                      [message.id]: option,
                    });
                    handleSendMessage(option);
                  }}
                >
                  {option}
                </Button>
              );
            })}
          </div>
        </div>
      );
    } else if (message.type === "codeBlock") {
      return (
        <div className="w-full p-2 rounded-[5px] bg-[#F1F1FE] mb-2">
          <div className="border border-[#D0D0FD] rounded-[7px] overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 h-[42px] bg-[#F6F7F9] ">
              <span className="text-[#344054] text-[13px] font-semibold">
                {message.state === "input"
                  ? detectedLanguage
                  : message.language}
              </span>

              <Button
                className={`p-0 h-fit text-[#667085] ${message.state === "display" ? "text-opacity-100" : "text-opacity-40"} text-[13px]`}
                onClick={() => navigator.clipboard.writeText(message.code)}
                disabled={message.state !== "display"}
              >
                Copy code
              </Button>
            </div>

            {message.state === "input" ? (
              <div className="p-4 bg-white">
                <pre className="whitespace-pre-wrap mb-2 text-[#344054] text-[13px]">
                  {message.code}
                </pre>
                <textarea
                  value={codeInput}
                  onChange={(e) => {
                    setCodeInput(e.target.value);
                    // detect language logic
                    setDetectedLanguage("php");
                  }}
                  className="w-full h-[150px] outline-none resize-none text-[#344054] text-[13px]"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    className="bg-[#7141F8] text-white h-8 px-6 py-3"
                    disabled={!codeInput}
                    onClick={() => {
                      const updatedMessage = {
                        ...message,
                        code: message.code + "\n" + codeInput,
                        language: detectedLanguage,
                        state: "display",
                      };
                      setMessages(
                        messages.map((m) =>
                          m.id === message.id ? updatedMessage : m
                        )
                      );
                      setCodeInput("");
                    }}
                  >
                    Send
                  </Button>
                </div>
              </div>
            ) : (
              <pre className="p-4 bg-white overflow-x-auto text-[#344054] text-[13px]">
                <code>{message.code}</code>
              </pre>
            )}
          </div>
        </div>
      );
    } else if (message.type === "codeAlertBlock") {
      return (
        <div className="flex flex-col gap-2 w-full mb-2">
          <p className="text-[#344054] text-[15px]">{message.text}</p>
          <div className="flex flex-col w-full space-y-4 p-2 rounded-[5px] bg-[#F1F1FE]">
            {message.codes.map((code: any, index: number) => (
              <React.Fragment key={index}>
                <div className="flex gap-2">
                  <div className="relative flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-[6px] h-[6px] rounded-[2px] ${code.alert === "red" ? "bg-[#FB6B61]" : code.alert === "black" ? "bg-[#344054]" : "bg-[#5EDF9A]"}`}
                    />
                    <div
                      className={`w-[1px] h-full ${code.alert === "red" ? "bg-[#FC9A93]" : code.alert === "black" ? "bg-[#98A2B3]" : "bg-[#91E9BA]"}`}
                    />
                    <div
                      className={`w-[6px] h-[6px] rounded-[2px] ${code.alert === "red" ? "bg-[#FB6B61]" : code.alert === "black" ? "bg-[#344054]" : "bg-[#5EDF9A]"}`}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full overflow-hidden">
                    {code.review && (
                      <p className="text-[#344054] text-[15px] break-words">
                        {code.review}
                      </p>
                    )}
                    {code.problem &&
                      code.riskLevel &&
                      code.solution &&
                      [
                        { label: "Problem", value: code.problem },
                        { label: "Risk Level", value: code.riskLevel },
                        { label: "Solution", value: code.solution },
                      ].map((item: any, index: number) => (
                        <div key={index} className="flex flex-wrap gap-1">
                          <span className="text-[#667085] text-[15px]">
                            {item.label}:
                          </span>
                          <span className="text-[#344054] text-[15px] break-words">
                            {item.value}
                          </span>
                        </div>
                      ))}

                    <div className="border border-[#D0D0FD] rounded-[7px] overflow-hidden">
                      <div className="flex justify-between items-center px-4 py-2 h-[42px] bg-[#F6F7F9]">
                        <span className="text-[#344054] text-[13px] font-semibold">
                          {code.language}
                        </span>

                        <Button
                          className={`p-0 h-fit text-[#667085] text-[13px]`}
                          onClick={() =>
                            navigator.clipboard.writeText(code.code)
                          }
                        >
                          Copy code
                        </Button>
                      </div>

                      <pre className="p-4 bg-white overflow-x-auto text-[#344054] text-[13px] max-w-full">
                        <code className="break-words whitespace-pre-wrap">
                          {code.errorLines ? (
                            <>
                              {code.code
                                .split("\n")
                                .map((line: string, i: number) => (
                                  <div
                                    key={i}
                                    className={
                                      code.errorLines?.includes(i + 1)
                                        ? "bg-[#FEE8E6] text-[#F81404] px-1 rounded"
                                        : ""
                                    }
                                  >
                                    {line}
                                  </div>
                                ))}
                            </>
                          ) : (
                            code.code
                          )}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
                {index !== message.codes.length - 1 && (
                  <div className="h-[1px] bg-white w-full" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      );
    } else if (message.type === "summaryReportBlock") {
      return (
        <div className="flex flex-col gap-2 w-full mb-2">
          <p className="text-[#344054] text-[15px]">{message.text}</p>
          <div className="w-full flex gap-2 p-2 rounded-[5px] bg-[#F1F1FE] mb-2">
            <div className="relative flex flex-col items-center flex-shrink-0">
              <div
                className={`w-[6px] h-[6px] rounded-[2px] ${message.alert === "red" ? "bg-[#FB6B61]" : message.alert === "black" ? "bg-[#344054]" : "bg-[#5EDF9A]"}`}
              />
              <div
                className={`w-[1px] h-full ${message.alert === "red" ? "bg-[#FC9A93]" : message.alert === "black" ? "bg-[#98A2B3]" : "bg-[#91E9BA]"}`}
              />
              <div
                className={`w-[6px] h-[6px] rounded-[2px] ${message.alert === "red" ? "bg-[#FB6B61]" : message.alert === "black" ? "bg-[#344054]" : "bg-[#5EDF9A]"}`}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2">
                <Image
                  src={uiAvatarUrl("org")}
                  alt={"org"}
                  width={24}
                  height={24}
                  className="rounded-[3px]"
                />
                <span className="text-[#344054] text-[15px]">
                  Timbu Tech Ltd
                </span>
              </div>
              <div className="w-full border border-[#D0D0FD] rounded-[7px] overflow-hidden">
                <div className="px-4 py-2 h-[42px] bg-[#F6F7F9] border-b border-[#DDE6EB]">
                  <span className="text-[#344054] text-[13px] font-semibold">
                    {message.title}
                  </span>
                </div>
                <div className="py-4 bg-white flex flex-col overflow-x-auto text-[#344054] text-[13px]">
                  {/* donut chart */}
                  <div className="flex items-center justify-center gap-5 flex-wrap border-b border-[#E6EAEF] w-full">
                    <div className="h-[250px] w-[200px] flex justify-center items-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={message.chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {message.chartData.map(
                              (entry: any, index: number) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              )
                            )}
                            <Label
                              content={({ viewBox }) => {
                                const { cx, cy } = viewBox as {
                                  cx: number;
                                  cy: number;
                                };
                                return (
                                  <text
                                    x={cx}
                                    y={cy}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-xs fill-[#344054]"
                                  >
                                    Full Scan
                                  </text>
                                );
                              }}
                              position="center"
                            />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-3 justify-center">
                      {message.chartData.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-1">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-[#667085] text-xs">
                            {item.name}{" "}
                            <span className="text-black font-semibold ml-1">
                              {item.value}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* chart end */}
                  <div className="p-6">
                    {/* table overview */}
                    <div className="flex items-center gap-[10px]">
                      <span className="text-[#475467] text-[13px] font-medium">
                        {message.tableOverview.title}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-[#E4E7EC]" />
                      <span className="text-[#475467] text-[13px] font-medium">
                        {message.tableOverview.linkCount} links
                      </span>
                      <span className="w-2 h-2 rounded-full bg-[#E4E7EC]" />
                      <span className="text-[#475467] text-[13px] font-medium">
                        <span className="text-[#FD7072]">
                          {message.tableOverview.brokenLinkCount}
                        </span>{" "}
                        broken
                      </span>
                    </div>

                    {/* table */}
                    <div className="mt-4 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden rounded-[7px] border border-[#E4E7EC]">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-[#F6F7F9] h-[32px]">
                            <th className="text-left text-[10px] font-medium text-[#667085] p-[10px]">
                              Link
                            </th>
                            <th className="text-left text-[10px] font-medium text-[#667085] p-[10px]">
                              Status
                            </th>
                            <th className="text-left text-[10px] font-medium text-[#667085] p-[10px]">
                              Issue Type
                            </th>
                            <th className="text-left text-[10px] font-medium text-[#667085] p-[10px]">
                              Suggested Fix
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {message.tableData.map((item: any, index: number) => (
                            <tr
                              key={index}
                              className={`${index !== message.tableData.length - 1 ? "border-b border-[#F6F7F9]" : ""}`}
                            >
                              <td className="text-xs text-[#5F5FE1] p-[10px] h-[56px]">
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {item.link}
                                </a>
                              </td>
                              <td className="text-xs p-[10px] h-[56px]">
                                <span
                                  className={`px-4 py-1 rounded-[20px] text-xs border capitalize ${
                                    item.status === "broken"
                                      ? "bg-[#FEE8E6] text-[#700902] border-[#FC9A93]"
                                      : "bg-[#E6FAEF] text-[#005C2B] border-[#91E9BA]"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </td>
                              <td className="text-xs text-[#475467] p-[10px] h-[56px]">
                                {item.issueType}
                              </td>
                              <td className="text-xs text-[#475467] p-[10px] h-[56px]">
                                {item.suggestedFix}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-[calc(100vh-70px)] relative w-full overflow-hidden">
      <div
        className={`flex flex-col flex-1 transition-[margin] duration-300 ease-in-out`}
      >
        <div className="flex-1 flex flex-col justify-end relative overflow-hidden">
          <div className="overflow-y-auto pb-5 mb-[180px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Empty intro section for users that are selected */}
            {/* Messages section */}
            <div className="flex flex-col">
              {messages.map((message, index) => {
                const previousMessage = index > 0 ? messages[index - 1] : null;
                const showHeader =
                  !previousMessage || previousMessage.sender !== message.sender;
                const showDateDivider =
                  !previousMessage ||
                  formatDate(message.timestamp) !==
                    formatDate(previousMessage.timestamp);

                return (
                  <React.Fragment key={message.id}>
                    {showDateDivider && (
                      <div className="sticky top-0 z-10 my-4 bg-white">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-dotted border-[#E6EAEF]"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-white px-4 py-1 text-[13px] text-[#101828] border border-[#E6EAEF] rounded-[30px]">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    )}
                    <div
                      className={`bg-white group hover:bg-gray-50 transition-colors flex items-start px-5 ${
                        showHeader && "mt-5"
                      }`}
                    >
                      <div className="w-8 flex-shrink-0 mr-2 flex items-center justify-center">
                        {showHeader ? (
                          <Image
                            src={message.avatar}
                            alt="avatar"
                            width={40}
                            height={40}
                            className="rounded-[7px]"
                            style={{
                              backgroundColor: message?.color,
                              border: "1px solid #E6EAEF",
                            }}
                          />
                        ) : (
                          <span className="text-xs text-[#98A2B3] opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                            {new Date(message.timestamp).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              }
                            )}
                          </span>
                        )}
                      </div>
                      <div className="flex-grow">
                        {showHeader && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-[15px] text-[#1D2939]">
                              {message.sender}
                            </span>
                            <span className="text-xs text-[#98A2B3]">
                              {new Date(message.timestamp).toLocaleTimeString(
                                [],
                                {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </span>
                          </div>
                        )}
                        <div className="flex items-start justify-between relative">
                          {displayMessageBlock(message)}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center ml-4 absolute right-0 bottom-full bg-white shadow-md rounded-[8px] border border-[#E6EAEF] p-[2px]">
                            <button className="pb-[4px] px-[10px] hover:bg-gray-200 rounded">
                              <span className="inline-flex items-center justify-center w-4 h-4 text-base">
                                ✅
                              </span>
                            </button>
                            <button className="pb-[4px] px-[10px] hover:bg-gray-200 rounded">
                              <span className="inline-flex items-center justify-center w-4 h-4 text-base">
                                👀
                              </span>
                            </button>
                            <button className="pb-[4px] px-[10px] hover:bg-gray-200 rounded">
                              <span className="inline-flex items-center justify-center w-4 h-4 text-base">
                                🙌
                              </span>
                            </button>
                            <button className="py-[7px] px-[10px] hover:bg-gray-200 rounded">
                              <SmilePlus size={16} className="text-[#667085]" />
                            </button>
                            <button
                              className="py-[7px] px-[10px] hover:bg-gray-200 rounded"
                              // onClick={() => handleThreadClick(message)}
                            >
                              <MessageCircleMore
                                size={16}
                                className="text-[#667085]"
                              />
                            </button>
                            <button className="py-[7px] px-[10px] hover:bg-gray-200 rounded">
                              <Forward size={16} className="text-[#667085]" />
                            </button>
                            <button className="py-[7px] px-[10px] hover:bg-gray-200 rounded">
                              <Bookmark size={16} className="text-[#667085]" />
                            </button>
                            <button className="py-[7px] px-[10px] hover:bg-gray-200 rounded">
                              <MoreVertical
                                size={16}
                                className="text-[#667085]"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPage;
