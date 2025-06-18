"use client";

import { useEffect, useState } from "react";
import { getFromLocalStorage } from "@/app/utils/utility";
import { UserData_TYPE } from "@/app/types";

import { useParams } from "next/navigation";
import { useGetChatList } from "@/app/hooks/useGetChatList";
import {
  ChatListUser_TYPE,
  FileBase64_TYPE,
  ChatMessage_TYPE,
} from "@/app/types";
import { IoChevronBackOutline } from "react-icons/io5";

import axios from "axios";
import ChatContactList from "@/app/components/ChatContactList";
import ChatPageInputs from "@/app/components/ChatPageInputs";
import ChatPageConversationContainer from "@/app/components/ChatPageConversationContainer";
function Page() {
  const [fileBase64List, setFileBase64List] = useState<FileBase64_TYPE[]>([]);
  // const MAX_FILE_SIZE_MB = 1;

  const params = useParams();
  const chatId = params.chatId;

  const userData: UserData_TYPE | null = getFromLocalStorage("lendora_user");
  const userID = userData?.detail.user.id;
  const receiverID = chatId ? chatId[0] : null;
  // console.log(chatId);
  const [isShowChatList, setIsShowChatList] = useState(
    receiverID ? false : true
  );
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [msg, setMsg] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const { chatListData, isFetchingChatList, isChatListEError } =
    useGetChatList();
  const handleDisplayHeaderReceiverName = () => {
    const firstName = chatListData?.data?.find(
      (item: ChatListUser_TYPE) => item.partner_id === receiverID
    ).first_name;
    const lastName = chatListData?.data?.find(
      (item: ChatListUser_TYPE) => item.partner_id === receiverID
    ).last_name;

    return firstName + " " + lastName;
  };
  const [chatHistory, setChatHistory] = useState<ChatMessage_TYPE[]>([]);
  const [isLoadingChatHistory, setIsLoadingChatHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(error);

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
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
        const newMessage: ChatMessage_TYPE = JSON.parse(event.data);
        newMessage.id = Math.random().toString(36).substring(2, 10);
        console.log(newMessage);
        setChatHistory((prev) => [...prev, newMessage]);
      } catch (parseError) {
        console.log("❌ Failed to parse WebSocket message:", parseError);
      }
    };

    ws.onerror = (e) => {
      console.log("❌ WebSocket error:", e);
    };

    ws.onclose = (e) => {
      console.log("🔌 Closed:", e.code, e.reason || "No reason");
      if (!e.wasClean) {
        setTimeout(() => {
          setReconnectWebSocket(Math.random()); // your retry logic
        }, 3000);
      }
    };

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
      const messageObject: ChatMessage_TYPE = {
        sender: userID,
        receiver: receiverID.trim(),
        content: msg,
        id: Math.random().toString(36).substring(2, 10),
        content_type: "text/plain",
      };
      // console.log(messageObject);
      if (fileBase64List.length > 0) {
        fileBase64List.forEach((file) => {
          const fileMessageObject: ChatMessage_TYPE = {
            sender: userID,
            receiver: receiverID.trim(),
            content: file.base64,
            content_type: file.type,

            // id: Math.random().toString(36).substring(2, 10),
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
      // scrollToBottom();
    } else {
      console.warn("⚠ WebSocket not ready");
    }
  };

  // chat page
  return (
    <main className=" lg:p-3 flex max-w-7xl mx-auto  flex-col flex-1    min-h-0 w-full">
      <section className=" flex-1 flex  border h-full rounded w-full ">
        <ChatContactList
          isShowChatList={isShowChatList}
          chatListData={chatListData}
          isFetchingChatList={isFetchingChatList}
          isChatListEError={isChatListEError}
          setIsShowChatList={setIsShowChatList}
          receiverID={receiverID}
        />
        {receiverID ? (
          <>
            {" "}
            <div className="w-full white  flex flex-col z">
              <div className=" border-b p-2 bg-white flex overflow-auto">
                <span
                  className="border lg:hidden cursor-pointer mr-4 px-1 py-1 text-sm rounded flex items-center justify-center"
                  onClick={() => setIsShowChatList(true)}
                >
                  <IoChevronBackOutline /> Back
                </span>
                {/* {userData?.detail.user.id} */}
                {/* {chatListData?.data?.find(
                  (item: ChatListUser_TYPE) => item.partner_id === receiverID
                )} */}
                {!isChatListEError && !isFetchingChatList && (
                  <>{handleDisplayHeaderReceiverName()}</>
                )}
                {/* {JSON.stringify(chatListData.data, null, 2)} */}
              </div>

              <ChatPageConversationContainer
                isLoadingChatHistory={isLoadingChatHistory}
                chatHistory={chatHistory}
                userID={userID}
              />

              <ChatPageInputs
                fileBase64List={fileBase64List}
                setFileBase64List={setFileBase64List}
                sendMessage={sendMessage}
                msg={msg}
                setMsg={setMsg}
                isSendingMessage={isSendingMessage}
              />
            </div>
          </>
        ) : (
          <>
            <div className="text-center pt-5 px-3 mt-3 w-full text-sm">
              {/* <h4 className="font-medium mb-1">No Conversations!</h4> */}
              <p>Select chat to view conversations</p>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Page;
