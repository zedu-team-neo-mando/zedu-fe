"use client";

import { ReactNode, createContext, useReducer } from "react";

import reducers from "./Reducers";

// Create the context with a default value
export const DataContext = createContext<any>(undefined);

// Define the type for the provider props
interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const initialState = {
    user: null,
    token: null,
    callback: false,
    loading: false,
    channelloading: true,
    notify: null,

    channels: null,

    thread: null,

    channelDetails: null,
    channelName: "",
    dmDetails: null,

    channelBar: false,

    openSidebar: false,

    orgMembers: null,
    orgMembersTotal: 0,
    mentionOrgMembers: null,
    orgInvites: null,

    orgRoles: null,
    permissionsCatalog: null,
    orgAccessLoading: false,

    notifications: [],
    messages: [],
    chats: [],
    dms: [],
    homeDms: null,
    replies: [],

    messageLoading: true,
    integrationsLoading: true,

    orgId: null,

    notificationCallback: false,

    // ----------------------
    orgData: null,
    channelCallback: false,
    channelSubscription: null,
    chatSubscription: null,
    replySubscription: null,
    agentDm: [],
    channelAgents: [],
    mentions: [],
    inviteModal: false,
    showProfile: false,
    hoverProfile: false,
    reply: false,

    profile: null,
    showUserProfile: false,
    profileCallback: false,
    groupCallback: false,

    userTyping: [],
    threadTyping: [],

    isEdit: false,
    isEditReply: false,
    threadReply: null,

    statusCallback: false,
    topLabel: "Active",
    activeAgents: [],
    inactiveAgents: [],
    marketPlaceAgents: [],

    countCallback: false,
    threadCount: 0,
    dmCount: 0,

    userData: null,
    status: false,
    notificationDetail: null,
    notificationBadgeState: { count: 0 },
    channelInvite: false,
    agentModal: false,
    agentState: null,
    agentCallback: false,
    bookmarks: [],

    // subscriptions
    subscriptionPlans: null,
    currentSubscription: null,
    activeTab: "about",
    later: [],
    dataId: "",
    allChannels: [],
    selectedSkills: [],
    skillSidebar: false,
    tasks: [],
    prompts: [],
    colleague: null,
    skill: null,
    agentSkills: [],
    skillsCallback: false,
    tasksCallback: false,

    workflow: null,

    orgCallback: false,
    promptCallback: false,
    orgSlug: "",
    skillLoading: false,
    nodeSidebar: false,

    participant: null,
    participants: [],
    buzzData: [],
    hasJoined: false,
    buzzParticipants: [],
    buzzChats: [],
    floatingEmojis: [],
    threadMentions: null,
    threadMentionsHasMore: false,
    unseenThreadCount: 0,
    muteParticipant: false,
    buzzView: "side",
    buzzSidebar: false,
    buzzSessionMode: null,
    buzzAgoraUintUids: {
      cameraUintUid: undefined,
      screenShareUintUid: undefined,
    },
    buzzIsScreenSharing: false,
    buzzStoppingRecording: false,
    buzzStartingRecording: false,
    showIncomingCallPopup: false,
    incomingCallInfo: null,
    loadThread: false,
    triggerCallback: false,
    joinCallback: false,
    leaveCallback: false,
    createCallback: false,
    homeDmsCallback: false,
    deleteCallback: false,
    dmRenderCallback: false,
    channelReady: true,
    conversationSearchOpen: false,
  };

  const [state, dispatch] = useReducer(reducers, initialState);

  return (
    <DataContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
