import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { cn } from "@/lib/utils";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import  { useState } from 'react';

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const ChatPage = () => {
  const { user } = useUser();
  const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();
  const { isListeningAlong, listenAlongHost, listeners } = usePlayerStore();
  const { socket } = useChatStore();
  const [showPickerFor, setShowPickerFor] = useState<string | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

  const isBannerVisible =
    (isListeningAlong && listenAlongHost) ||
    (!isListeningAlong && listeners.size > 0);

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser.clerkId);
  }, [selectedUser, fetchMessages]);

  console.log({ messages });

  return (
    <main className="bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white h-screen overflow-hidden">
      <Topbar />

      <div className="grid lg:grid-cols-[250px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-150px)] ">
        <UsersList />

        {/* chat message */}
        <div className={cn("flex flex-col h-[calc(100vh-180px)]", isBannerVisible && "pb-10")}>
          {selectedUser ? (
            <>
              <ChatHeader />

              {/* Messages */}
              <ScrollArea className="h-[calc(100vh-340px)]">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex items-start gap-3 ${
                        message.senderId === user?.id ? "flex-row-reverse" : ""
                      }`}
                      onMouseEnter={() => setHoveredMessageId(message._id)}
                      onMouseLeave={() => setHoveredMessageId(null)}
                    >
                      <Avatar className="size-8">
                        <AvatarImage
                          src={
                            message.senderId === user?.id
                              ? user.imageUrl
                              : selectedUser.imageUrl
                          }
                        />
                      </Avatar>

                      <div
                        className={`rounded-lg p-3 max-w-[70%]
													${message.senderId === user?.id ? "bg-blue-500" : "bg-zinc-800"}
												`}
                        style={{ position: 'relative' }}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs text-zinc-300 mt-1 block">
                          {formatTime(message.createdAt)}
                        </span>
                        {/* Emoji Reactions Row */}
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {message.reactions.map((reaction, idx) => (
                              <span
                                key={idx}
                                className={`text-lg px-1 rounded-full ${reaction.userId === user?.id ? 'bg-zinc-700' : ''}`}
                              >
                                {reaction.emoji}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Emoji Picker Button - only show on hover */}
                        {hoveredMessageId === message._id && (
                        <button
                          className="absolute top-1 right-1 text-xl hover:scale-110 transition"
                          onClick={() => setShowPickerFor(showPickerFor === message._id ? null : message._id)}
                          style={{ zIndex: 2 }}
                        >
                          😊
                        </button>
                        )}
                        {/* Emoji Picker */}
                        {showPickerFor === message._id && (
                          <div style={{ position: 'absolute', top: 30, right: 0, zIndex: 10 }}>
                            <Picker
                              data={data}
                              onEmojiSelect={(emoji: any) => {
                                socket.emit('message:react', {
                                  messageId: message._id,
                                  emoji: emoji.native,
                                  userId: user?.id,
                                });
                                setShowPickerFor(null);
                              }}
                              previewPosition="none"
                              skinTonePosition="none"
                              style={{ width: 250 }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <MessageInput />
            </>
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>
      </div>
    </main>
  );
};
export default ChatPage;

const NoConversationPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-6">
    <img src="/logo.png" alt="Spotify" className="size-16 animate-bounce" />
    <div className="text-center">
      <h3 className="text-zinc-300 text-lg font-medium mb-1">
        No conversation selected
      </h3>
      <p className="text-zinc-500 text-sm">Choose a friend to start chatting</p>
    </div>
  </div>
);
