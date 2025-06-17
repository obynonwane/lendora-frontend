"use client";

import { useEffect, useState } from "react";
import { getFromLocalStorage } from "@/app/utils/utility";
import { UserData_TYPE } from "@/app/types";
import { IoSend } from "react-icons/io5";
import { MdOutlineAttachFile } from "react-icons/md";
import { useParams } from "next/navigation";
import { useGetChatList } from "@/app/hooks/useGetChatList";
import Link from "next/link";
import { ChatHistoryItem } from "@/app/types";
import { IoChatboxEllipses } from "react-icons/io5";
import { useUserStore } from "@/app/store/useUserStore";

import axios from "axios";
function Page() {
  type ChatMessage = {
    sender: string;
    receiver: string;
    content: string;
    sent_at?: number;
  };
  const params = useParams();
  const chatId = params.chatId;

  const userData: UserData_TYPE | null = getFromLocalStorage("lendora_user");

  // console.log(chatId);
  const [isShowChatList, setIsShowChatList] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const userID = userData?.detail.user.id;
  const receiverID = chatId ? chatId[0] : null;
  // const [userID, setUserID] = useState(userData?.detail.user.id);
  // const [receiverID, setReceiverID] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  // console.log(chatId, receiverID);

  const { chatListData, isFetchingChatList, isChatListEError } =
    useGetChatList();
  // console.log(chatListData?.data);

  //   console.log(userData?.detail.user.id);

  // useEffect(() => {
  //   const myID = userData?.detail.user.id;

  //   // const input = "https://api.lendora.ng/api/v1";
  //   // const output = input.replace("https://", "");
  //   // console.log(output); // api.lendora.ng/api/v1
  //   const ws = new WebSocket(
  //     `wss://api.lendora.ng/api/v1/chat/ws?user_id=${myID}`
  //   );
  //   // const ws = new WebSocket(
  //   //   `wss://api.lendora.ng/api/v1/chat/ws?user_id=${myID}`
  //   //   //   `ws://localhost:8080/api/v1/chat/ws?user_id=${myID}`
  //   // );

  //   ws.onopen = () => console.log("✅ Connected to WebSocket as", myID);

  //   ws.onmessage = (event) => {
  //     const newMessage: ChatMessage = JSON.parse(event.data);
  //     setMessages((prev) => [...prev, newMessage]);
  //   };

  //   ws.onerror = (e) => console.error("WebSocket error:", e);
  //   ws.onclose = () => console.log("🔌 Disconnected from WebSocket");

  //   setSocket(ws);

  //   return () => {
  //     ws.close();
  //   };
  // }, [chatId]);

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
        setMessages((prev) => [...prev, newMessage]);
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

  const [chatHistory, setChatHistory] = useState([]);
  const [isLoadingChatHistory, setIsLoadingChatHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const logout = useUserStore((s) => s.logout);
  console.log(error, isLoadingChatHistory, chatHistory, messages, useUserStore);

  // console.log("userid", userData?.detail.user);
  useEffect(() => {
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

    fetchChatHistory();
  }, [chatId]);

  const sendMessage = () => {
    if (!receiverID) {
      return;
    }
    if (!receiverID.trim()) {
      alert("Please enter a valid receiver ID.");
      return;
    }
    console.log({
      sender: userID,
      receiver: receiverID.trim(),
      content: msg,
    });

    if (socket && socket.readyState === WebSocket.OPEN && userID) {
      const messageObject: ChatMessage = {
        sender: userID,
        receiver: receiverID.trim(),
        content: msg,
      };
      socket.send(JSON.stringify(messageObject));
      setMsg("");
    } else {
      console.warn("⚠ WebSocket not ready");
    }
  };

  // chat page
  return (
    <main className="max-w-7xl mx-auto lg:p-3 flex h-full flex-col flex-1   w-full">
      <section className=" flex-1 flex  border h-full rounded w-full ">
        <aside
          className={`lg:w-[350px] border-r flex flex-col bg-white h-full transition-transform duration-[10s] ease-in-out max-h-full overflow-y-auto lg:relative fixed  w-full   ${
            isShowChatList
              ? "lg:left-auto left-0"
              : " lg:-left-0 -left-[100vw] "
          } `}
        >
          <h3 className="p-2 border-b ">Chat List</h3>

          <div className="flex-1 bg-red-100 overflow-y-auto max-h-full">
            ds
            <>
              {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 43434].map((message, index) => (
                <div key={index} className={`p-2  rounded-xl w-fit h-fit`}>
                  <strong>{message}</strong>: {message}l
                </div>
              ))}{" "} */}
            </>
            {!isFetchingChatList && !isChatListEError && chatListData && (
              <>
                {chatListData.data.map((chat: ChatHistoryItem) => (
                  <Link
                    href={`/chat/${chat.receiver_id}`}
                    onClick={() => {
                      setIsShowChatList(false);
                      // setReceiverID(chat.receiver_id);
                    }}
                    key={chat.id}
                    className={`p-3  flex border-b hover:bg-zinc-100 cursor-pointer`}
                  >
                    <p>{chat.first_name + " " + chat.last_name} </p>
                  </Link>
                ))}
              </>
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
        <div className="w-full white flex flex-col">
          <div className=" border-b p-2 bg-white flex">
            <span
              className="border lg:hidden cursor-pointer mr-4"
              onClick={() => setIsShowChatList(true)}
            >
              &lt; back
            </span>
            Your id = {userData?.detail.user.id}
          </div>
          <div className="chat_container h-full flex-1 overflow-y-auto p-3 flex flex-col bg-white gap-8">
            {!chatId ? (
              <div className="w-full text-center py-5 text-6xl flex justify-center text-slate-400 pt-10">
                {" "}
                <IoChatboxEllipses />
              </div>
            ) : (
              <>
                {[
                  1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 22, 33, 44, 55, 66, 77, 363,
                  655,
                ].map((message, index) => (
                  <div
                    key={index}
                    className={`p-2  rounded-xl w-fit h-fit max-w-[65%] ${
                      index % 2 === 0
                        ? "bg-orange-100 self-end"
                        : "bg-slate-200 self-start"
                    }`}
                  >
                    <strong>{message}</strong>: {message}lorem dsjdksd skdj
                    skjeckwjekwjce qricwq rjhirw skjeckwjekwjce qricwq rjhirw
                    skjeckwjekwjce qricwq rjhirw skjeckwjekwjce qricwq rjhirw
                  </div>
                ))}{" "}
              </>
            )}
          </div>
          {/* <div className="h-20 bg-white">image preview</div> */}
          <div className="bg-white px-3 py-2 border-t flex gap-3 items-center">
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
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Your message here"
            ></textarea>
            <button
              onClick={sendMessage}
              disabled={msg.length === 0}
              className="  bg-orange-400 text-2xl   px-4 py-2 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-500 transition-colors duration-300 flex items-center justify-center"
            >
              <IoSend />
            </button>
            {/* </div> */}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Page;
