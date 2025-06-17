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

import axios from "axios";
function Page() {
  type ChatMessage = {
    // sender: string;
    // receiver: string;
    // content: string;
    // sent_at?: number;

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

  const params = useParams();
  const chatId = params.chatId;

  const userData: UserData_TYPE | null = getFromLocalStorage("lendora_user");

  // console.log(chatId);
  const [isShowChatList, setIsShowChatList] = useState(false);
  // const [messages, setMessages] = useState<ChatMessage[] |[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const userID = userData?.detail.user.id;
  const receiverID = chatId ? chatId[0] : null;
  // const [userID, setUserID] = useState(userData?.detail.user.id);
  // const [receiverID, setReceiverID] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  // console.log(chatId, receiverID);

  const { chatListData, isFetchingChatList, isChatListEError } =
    useGetChatList();

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
        setChatHistory((prev) => [...prev, newMessage]);
        // setMessages((prev) => [...prev, newMessage]);
      } catch (parseError) {
        console.error("❌ Failed to parse WebSocket message:", parseError);
      }
    };

    ws.onerror = (e) => {
      console.error("❌ WebSocket error:", e);
    };

    ws.onclose = (e) => {
      console.log(
        "🔌 WebSocket closed:",
        e.code,
        e.reason || "No reason provided"
      );
    };

    return () => {
      ws?.close();
    };
  }, [chatId, userData?.detail?.user?.id]);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoadingChatHistory, setIsLoadingChatHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const logout = useUserStore((s) => s.logout);
  console.log(error, isLoadingChatHistory);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };
  useEffect(() => {
    // alert("new");
    scrollToBottom();
  }, [chatHistory]);

  // console.log("userid", userData?.detail.user);

  const fetchChatHistory = async () => {
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
      console.log(response.data);
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

  const sendMessage = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!receiverID) {
      return;
    }

    if (!receiverID.trim()) {
      alert("Please enter a valid receiver ID.");
      return;
    }
    // fetchChatHistory();
    setMsg("");
    scrollToBottom();

    // console.log({
    //   sender: userID,
    //   receiver: receiverID.trim(),
    //   content: msg,
    // });

    if (socket && socket.readyState === WebSocket.OPEN && userID) {
      const messageObject: ChatMessage = {
        sender: userID,
        receiver: receiverID.trim(),
        content: msg,
        id: Math.random().toString(36).substring(2, 10),
      };
      socket.send(JSON.stringify(messageObject));
      setMsg("");
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
                    href={`/chat/${chat.sender_id}`}
                    onClick={() => {
                      setIsShowChatList(false);
                      // setReceiverID(chat.receiver_id);
                    }}
                    key={chat.id}
                    className={` ${
                      receiverID === chat.sender_id
                        ? "bg-slate-100"
                        : "hover:bg-zinc-100 cursor-pointer"
                    }  p-3 items-center gap-2 flex border-b  `}
                  >
                    <span className="h-7 w-7 rounded flex items-center justify-center text-xs  bg-slate-200 ">
                      {chat.first_name[0]}
                    </span>
                    <p>{chat.first_name + " " + chat.last_name} </p>
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
              <div className=" border-b p-2 bg-white flex">
                <span
                  className="border lg:hidden cursor-pointer mr-4 px-1 py-1 text-sm rounded flex items-center justify-center"
                  onClick={() => setIsShowChatList(true)}
                >
                  <IoChevronBackOutline /> Back
                </span>
                {/* Your id = {userData?.detail.user.id} */}
              </div>

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
                        <div className="text-center text-xs text-gray-500 my-2">
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
                        <span className="block">{message.content}</span>
                        <span className="text-[0.7rem] text-gray-500 block text-right mt-1">
                          {format(getNewDate(message.sent_at), "h:mm a")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* <div className="chat_container h-full flex-1 overflow-y-auto p-3 flex flex-col bg-white gap-8">
                <>
                  {chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`p-2  rounded-xl w-fit h-fit max-w-[65%] ${
                        message.sender === userID
                          ? "bg-orange-100 self-end"
                          : "bg-slate-200 self-start"
                      }`}
                    >
                      <span>{message.content}</span>
                    </div>
                  ))}{" "}
                </>
              </div> */}

              {/* <div className="h-20 bg-white">image preview</div> */}
              <form
                onSubmit={sendMessage}
                className="bg-white px-3 py-2 border-t flex gap-3 items-center"
              >
                {/* <span>upload</span> */}
                <div className=" relative">
                  <input
                    type="file"
                    className="opacity-0  absolute inset-0"
                    id="file-upload"
                  />
                  <MdOutlineAttachFile className="text-2xl" />
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
                  disabled={msg.length === 0}
                  className="  bg-orange-400 text-2xl   px-4 py-2 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-500 transition-colors duration-300 flex items-center justify-center"
                >
                  <IoSend />
                </button>
                {/* </div> */}
              </form>
            </div>
          </>
        ) : (
          <>
            <div className="text-center pt-5 px-3 mt-3 w-full text-sm">
              <h4 className="font-medium mb-1">No Conversations!</h4>
              <p>Book/Purchase an item to view conversations!</p>
            </div>
          </>
        )}{" "}
      </section>
    </main>
  );
}

export default Page;
