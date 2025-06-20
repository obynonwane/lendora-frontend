"use client";

import ChatPage from "@/app/components/ChatPage";

function Page() {
  // chat page
  return (
    <main className=" lg:p-3 flex max-w-7xl mx-auto  flex-col flex-1    min-h-0 w-full">
      <ChatPage isPopup={false} />
    </main>
  );
}

export default Page;
