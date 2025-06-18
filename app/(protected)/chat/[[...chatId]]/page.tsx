"use client";

import { useEffect, useState, useRef } from "react";
import { getFromLocalStorage } from "@/app/utils/utility";
import { UserData_TYPE } from "@/app/types";
import { IoSend } from "react-icons/io5";
import { MdOutlineAttachFile } from "react-icons/md";
import { useParams } from "next/navigation";
import { useGetChatList } from "@/app/hooks/useGetChatList";
import Link from "next/link";
import { ChatHistoryItem } from "@/app/types";
// import { IoChatboxEllipses } from "react-icons/io5";
// import { useUserStore } from "@/app/store/useUserStore";
import { format } from "date-fns";
import { IoChevronBackOutline } from "react-icons/io5";
import { FaFileDownload } from "react-icons/fa";

import axios from "axios";
function Page() {
  type chatListUser = {
    content_type: string;
    created_at: string;
    email: string;
    first_name: string;
    id: string;
    last_message: string;
    last_name: string;
    partner_id: string;
    receiver_id: string;
    sender_id: string;
    sent_at: number;
    type: string;
    updated_at: string;
  };

  type ChatMessage = {
    id?: string;
    content: string;
    content_type?: string; // e.g. "text/plain"
    type?: string; // e.g. "text"
    sender: string;
    receiver: string;
    sent_at?: number; // timestamp (e.g. in ms)
    created_at?: string; // ISO date string
    updated_at?: string; // ISO date string
  };

  const getNewDate = (date: number | undefined) => {
    if (!date) return new Date();
    return new Date(date);
  };

  const handleDisplayMessageContent = (message: ChatMessage) => {
    // console.log({ message });
    // return JSON.stringify(message, null, 2);
    if (
      message.content_type?.includes("image") ||
      message.content?.includes("data:image/")
    ) {
      return (
        <img className="max-h-[40vh]" src={message.content} alt="chatimg" />
      );
    }
    if (
      message.content_type?.includes("video") ||
      message.content?.includes("data:video/")
    ) {
      return <video controls className="max-h-[40vh]" src={message.content} />;
    }
    if (message.content_type === "text/plain") {
      return <span className="block">{message.content}</span>;
    }

    return (
      <a
        href={message.content}
        className=" text-sm pr-2 justify-between bg-white/50  flex items-center g border"
      >
        <span className="w-7 p-2 border rounded">
          <FaFileDownload />
        </span>
        Download File
      </a>
    );
  };

  const [fileBase64List, setFileBase64List] = useState<
    { base64: string; name: string; type: string }[]
  >([]);
  // const MAX_FILE_SIZE_MB = 1;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxSize = 1024 * 1024; // 1MB

    Array.from(files).forEach((file) => {
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Max size is 1MB.`);
        return; // skip this one, continue with others
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const fileData = {
          base64: reader.result as string,
          name: file.name,
          type: file.type,
        };
        setFileBase64List((prev) => [...prev, fileData]);
      };
      reader.readAsDataURL(file);
    });
  };

  const params = useParams();
  const chatId = params.chatId;

  const userData: UserData_TYPE | null = getFromLocalStorage("lendora_user");
  const userID = userData?.detail.user.id;
  const receiverID = chatId ? chatId[0] : null;
  // console.log(chatId);
  const [isShowChatList, setIsShowChatList] = useState(
    receiverID ? false : true
  );
  // const [messages, setMessages] = useState<ChatMessage[] |[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // const [userID, setUserID] = useState(userData?.detail.user.id);
  // const [receiverID, setReceiverID] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  // console.log(chatId, receiverID);

  const { chatListData, isFetchingChatList, isChatListEError } =
    useGetChatList();
  const handleDisplayHeaderReceiverName = () => {
    const firstName = chatListData.data.find(
      (item: chatListUser) => item.partner_id === receiverID
    ).first_name;
    const lastName = chatListData.data.find(
      (item: chatListUser) => item.partner_id === receiverID
    ).last_name;

    return firstName + " " + lastName;
  };
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoadingChatHistory, setIsLoadingChatHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const logout = useUserStore((s) => s.logout);
  console.log(error);
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

  const fetchChatHistory = async () => {
    setIsLoadingChatHistory(true);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/chat/chat-history?userA=${userData?.detail.user.id}&userB=${receiverID}`,
        {
          headers: {
            Authorization: `Bearer ${userData?.access_token}`,
          },
        }
      );
      setChatHistory(response.data.data);
      // console.log(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // console.log(err.response.data.status_code);
      if (err.response.data.status_code === 401) {
        // logout();
      }
      setError(err.message || "Failed to fetch chat history");
    } finally {
      setIsLoadingChatHistory(false);
    }
  };
  useEffect(() => {
    fetchChatHistory();
  }, [chatId]);
  const [reconnectWebSocket, setReconnectWebSocket] = useState(1);
  useEffect(() => {
    const myID = userData?.detail?.user?.id;

    if (!myID || !receiverID) {
      console.warn("❗WebSocket not initialized: missing user ID");
      return;
    }

    let ws: WebSocket;

    try {
      ws = new WebSocket(`wss://api.lendora.ng/api/v1/chat/ws?user_id=${myID}`);
    } catch (err) {
      console.log("❌ WebSocket creation failed:", err);
      return;
    }

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket as", myID);
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const newMessage: ChatMessage = JSON.parse(event.data);
        newMessage.id = Math.random().toString(36).substring(2, 10);

        setChatHistory((prev) => [...prev, newMessage]);

        // setMessages((prev) => [...prev, newMessage]);
      } catch (parseError) {
        console.log("❌ Failed to parse WebSocket message:", parseError);
      }
    };

    ws.onerror = (e) => {
      console.error("❌ WebSocket error:", e);
    };

    ws.onclose = (e) => {
      console.log("🔌 Closed:", e.code, e.reason || "No reason");
      if (!e.wasClean) {
        setTimeout(() => {
          setReconnectWebSocket(Math.random()); // your retry logic
        }, 3000);
      }
    };

    // ws.onclose = (e) => {
    //   console.log(
    //     "🔌 WebSocket closed:",
    //     e.code,
    //     e.reason || "No reason provided"
    //   );
    // };

    return () => {
      ws?.close();
    };
  }, [chatId, receiverID, userData?.detail?.user?.id, reconnectWebSocket]);

  const sendMessage = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!receiverID) {
      return;
    }

    if (!receiverID.trim()) {
      alert("Please enter a valid receiver ID.");
      return;
    }

    if (socket && socket.readyState === WebSocket.OPEN && userID) {
      setIsSendingMessage(true);
      const messageObject: ChatMessage = {
        sender: userID,
        receiver: receiverID.trim(),
        content: msg,
        id: Math.random().toString(36).substring(2, 10),
      };
      // console.log(messageObject);
      if (fileBase64List.length > 0) {
        fileBase64List.forEach((file) => {
          const fileMessageObject: ChatMessage = {
            sender: userID,
            receiver: receiverID.trim(),
            content: file.base64,
            content_type: file.type,

            id: Math.random().toString(36).substring(2, 10),
          };
          socket.send(JSON.stringify(fileMessageObject));
        });
        setFileBase64List([]);
      }
      if (msg.length > 0) {
        socket.send(JSON.stringify(messageObject));
        setMsg("");
      }
      setIsSendingMessage(false);
      scrollToBottom();
    } else {
      console.warn("⚠ WebSocket not ready");
    }
  };

  // chat page
  return (
    <main className=" lg:p-3 flex max-w-7xl mx-auto  flex-col flex-1    min-h-0 w-full">
      <section className=" flex-1 flex  border h-full rounded w-full ">
        <aside
          className={`lg:w-[350px] z-20 border-r flex flex-col bg-white h-full transition-transform duration-[10s] ease-in-out max-h-full overflow-y-auto lg:relative fixed  w-full   ${
            isShowChatList
              ? "lg:left-auto left-0"
              : " lg:-left-0 -left-[100vw] "
          } `}
        >
          <h3 className="p-2 border-b ">Chat List</h3>

          <div className="flex-1 bg-white overflow-y-auto max-h-full">
            <></>
            {!isFetchingChatList && !isChatListEError && chatListData && (
              <>
                {chatListData.data.map((chat: ChatHistoryItem) => (
                  <Link
                    href={`/chat/${chat.partner_id}`}
                    onClick={() => {
                      setIsShowChatList(false);
                      // setReceiverID(chat.receiver_id);
                    }}
                    key={chat.id}
                    className={` ${
                      receiverID === chat.partner_id
                        ? "bg-slate-100"
                        : "hover:bg-zinc-100 cursor-pointer"
                    }  p-3 items-center gap-2 flex border-b  `}
                  >
                    <span className="h-7 w-7 rounded flex items-center justify-center text-xs  bg-slate-200 ">
                      {chat.first_name[0]}
                    </span>
                    <p>{chat.first_name + " " + chat.last_name} </p>
                    {/* {chat.receiver_id} */}
                  </Link>
                ))}
              </>
            )}
            {!isFetchingChatList &&
              !isChatListEError &&
              chatListData &&
              chatListData.data.length === 0 && (
                <div className="text-center pt-5 px-3 mt-3 text-sm">
                  <h4 className="font-medium mb-1">No Chats!</h4>
                  <p>Book/Purchase an item to chat!</p>
                </div>
              )}
            {isFetchingChatList ||
              (isChatListEError && (
                <>
                  <div className=" text-center  pt-20 flex justify-center">
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
                </>
              ))}{" "}
          </div>
        </aside>
        {receiverID ? (
          <>
            {" "}
            <div className="w-full white z-10 flex flex-col z">
              <div className=" border-b p-2 bg-white flex overflow-auto">
                <span
                  className="border lg:hidden cursor-pointer mr-4 px-1 py-1 text-sm rounded flex items-center justify-center"
                  onClick={() => setIsShowChatList(true)}
                >
                  <IoChevronBackOutline /> Back
                </span>
                {/* {userData?.detail.user.id} */}
                {/* {chatListData?.data?.find(
                  (item: chatListUser) => item.partner_id === receiverID
                )} */}
                {!isChatListEError && !isFetchingChatList && (
                  <>{handleDisplayHeaderReceiverName()}</>
                )}
                {/* {JSON.stringify(chatListData.data, null, 2)} */}
              </div>

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
                      ? format(
                          getNewDate(previousMessage.sent_at),
                          "yyyy-MM-dd"
                        )
                      : null;

                    const showDateSeparator = currentDate !== previousDate;

                    return (
                      <div key={message.id} className="flex flex-col gap-1">
                        {/* Date separator */}
                        {showDateSeparator && (
                          <div className="text-center text-xs text-gray-500 my-2 sticky top-0">
                            {format(
                              getNewDate(message.sent_at),
                              "EEEE, MMM d, yyyy"
                            )}
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
                </div>
              )}

              {fileBase64List.length > 0 && (
                <>
                  <div className="flex  w-full overflow-x-auto flex-wrap gap-4 p-2">
                    {fileBase64List.map((file, index) => {
                      const isImage = file.type.startsWith("image/");
                      const isVideo = file.type.startsWith("video/");
                      const ext = file.name.split(".").pop()?.toUpperCase();

                      return (
                        <div key={index} className="relative ">
                          {isImage ? (
                            <div className="relative w-[70px] h-[70px]">
                              <img
                                src={file.base64}
                                alt={file.name}
                                className="rounded shadow-md max-w-full max-h-full object-cover"
                              />
                            </div>
                          ) : isVideo ? (
                            <div className="relative w-[120px] h-[70px]">
                              <video
                                src={file.base64}
                                controls
                                className="rounded shadow-md max-w-full max-h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-[70px] h-[70px] flex items-center justify-center border text-sm rounded text-gray-600 shadow-inner">
                              .{ext || "FILE"}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setFileBase64List((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                            className="absolute top-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 rounded-bl hover:bg-opacity-90"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* {fileBase64List.length === 0 && ( */}
              <form
                onSubmit={sendMessage}
                className="bg-white px-3 relat py-2 border-t flex gap-3 items-center"
              >
                {/* <span>upload</span> */}
                <div className=" relative hover:cursor-pointer hover:text-orange-400">
                  <input
                    onChange={handleFileChange}
                    type="file"
                    accept="*/*"
                    multiple
                    className="opacity-0  absolute inset-0 cursor-pointer"
                    id="file-upload"
                  />
                  <MdOutlineAttachFile className="text-2xl cursor-pointer" />
                </div>

                {/* <div className="text relative w-full flex "> */}
                <textarea
                  className=" h-10 resize-none bg-zinc-100 rounded outline-none flex-1  p-2"
                  name=""
                  id=""
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Your message here"
                ></textarea>
                <button
                  // onClick={sendMessage}
                  type="submit"
                  disabled={msg.length === 0 && fileBase64List.length === 0}
                  className="  bg-orange-400 text-2xl   px-4 py-2 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-500 transition-colors duration-300 flex items-center justify-center"
                >
                  {isSendingMessage ? (
                    <svg
                      aria-hidden="true"
                      className="w-7 h-7 text-white animate-spin  fill-gray-400"
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
                  ) : (
                    <IoSend />
                  )}
                </button>
                {/* </div> */}
              </form>
              {/* )} */}
            </div>
          </>
        ) : (
          <>
            <div className="text-center pt-5 px-3 mt-3 w-full text-sm">
              {/* <h4 className="font-medium mb-1">No Conversations!</h4> */}
              <p>Select chat to view conversations</p>
            </div>
          </>
        )}{" "}
      </section>
    </main>
  );
}

export default Page;
