import React from "react";
import { FaFileDownload } from "react-icons/fa";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { FaPlayCircle } from "react-icons/fa";

import { ChatMessage_TYPE } from "@/app/types";
function ChatPageConversationContainer({
  isLoadingChatHistory,
  chatHistory,
  userID,
}: //   isPopup,
{
  isLoadingChatHistory: boolean;
  chatHistory: ChatMessage_TYPE[];
  userID: string | undefined;
  //   isPopup?: boolean;
}) {
  const [selectedMedia, setSelectedMedia] = useState<{
    type: "image" | "video";
    src: string;
  } | null>(null);

  const getNewDate = (date: number | undefined) => {
    if (!date) return new Date();
    return new Date(date);
  };

  const handleDisplayMessageContent = (message: ChatMessage_TYPE) => {
    const content = message.content || "";

    const isImage =
      content.startsWith("data:image/") ||
      /\.(jpg|jpeg|png|gif|webp|bmp|tiff?|svg)$/i.test(content);

    const isVideo =
      content.startsWith("data:video/") || /\.(mp4|webm|ogg)$/i.test(content);

    const isCloudinaryRaw = content.includes("/raw/upload/");
    const isDataFile =
      content.startsWith("data:application/") || isCloudinaryRaw;

    if (isImage) {
      return (
        <img
          onClick={() => setSelectedMedia({ type: "image", src: content })}
          className="max-h-[40vh] cursor-pointer rounded"
          src={content}
          alt="chat-img"
        />
      );
    }

    if (isVideo) {
      return (
        <div className="relative  group">
          <span className="group-hover:scale-110 transition-transform ease-in-out text-white text-2xl bg-black/50 p-3 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <FaPlayCircle />
          </span>
          <video
            onClick={() => setSelectedMedia({ type: "video", src: content })}
            //   controls
            controlsList=""
            className="max-h-[40vh] cursor-pointer rounded"
            src={content}
          />
        </div>
      );
    }

    if (isDataFile) {
      return (
        <a
          href={content}
          download
          className="text-sm pr-2 justify-between bg-white/50 flex items-center border"
        >
          <span className="w-7 p-2 rounded">
            <FaFileDownload />
          </span>
          Download File
        </a>
      );
    }

    return <span className="block max-w-full overflow-auto">{content}</span>;
  };

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);
  return (
    <>
      {" "}
      {isLoadingChatHistory ? (
        <div className=" text-center flex-1 flex justify-center pt-16">
          {" "}
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-400 fill-orange-400"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      ) : (
        <div
          ref={chatContainerRef}
          className="chat_container h-full flex-1 overflow-y-auto p-3 flex flex-col bg-white gap-4"
        >
          {chatHistory.map((message, index) => {
            const currentDate = format(
              getNewDate(message.sent_at),
              "yyyy-MM-dd"
            );
            const previousMessage = chatHistory[index - 1];
            const previousDate = previousMessage
              ? format(getNewDate(previousMessage.sent_at), "yyyy-MM-dd")
              : null;

            const showDateSeparator = currentDate !== previousDate;

            return (
              <div key={message.id} className="flex flex-col gap-1">
                {/* Date separator */}
                {showDateSeparator && (
                  <div className="text-center text-xs text-gray-500 my-2 sticky top-0">
                    {format(getNewDate(message.sent_at), "EEEE, MMM d, yyyy")}
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`p-2 rounded-xl w-fit h-fit max-w-[65%] relative ${
                    message.sender === userID
                      ? "bg-orange-100 self-end"
                      : "bg-slate-200 self-start"
                  }`}
                >
                  {handleDisplayMessageContent(message)}
                  <span className="text-[0.7rem] text-gray-500 block text-right mt-1">
                    {format(getNewDate(message.sent_at), "h:mm a")}
                  </span>
                </div>
              </div>
            );
          })}

          <>
            {selectedMedia && (
              <div
                onClick={() => setSelectedMedia(null)}
                className="fixed inset-0 cursor-pointer bg-black/70 flex items-center justify-center z-[99999999999999999999999999]"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className=" p-2 rounded-lg max-w-full max-h-full overflow-hidden"
                >
                  {selectedMedia.type === "image" ? (
                    <img
                      src={selectedMedia.src}
                      alt="preview"
                      className="max-h-[80vh] cursor-default max-w-[90vw] rounded"
                    />
                  ) : (
                    <video
                      src={selectedMedia.src}
                      controls
                      autoPlay
                      className="max-h-[80vh] max-w-[90vw] rounded"
                    />
                  )}
                </div>
              </div>
            )}
            {/* {selectedMedia && (
              <div
                onClick={() => setSelectedMedia(null)}
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999999999999999999999999]"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className=" p-2 rounded-lg max-w-full max-h-full overflow-hidden"
                >
                  {selectedMedia.type === "image" ? (
                    <img
                      src={selectedMedia.src}
                      alt="preview"
                      className="max-h-[80vh] max-w-[90vw] rounded"
                    />
                  ) : (
                    <video
                      src={selectedMedia.src}
                      controls
                      autoPlay
                      className="max-h-[80vh] max-w-[90vw] rounded"
                    />
                  )}
                </div>
              </div>
            )} */}
          </>
        </div>
      )}
    </>
  );
}

export default ChatPageConversationContainer;
