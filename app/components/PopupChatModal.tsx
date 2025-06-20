import { useState } from "react";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { useUserStore } from "@/app/utils/useUserStore";
import { useRouter, usePathname } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import ChatPage from "./ChatPage";
function PopupChatModal() {
  const router = useRouter();
  const pathname = usePathname();
  //   console.log(pathname);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  //   const router = useRouter();
  //   const logout = useUserStore((s) => s.logout);
  // 66505609-9039-49fb-8e35-65db84b806c1
  const authStateLoaded = useUserStore((s) => s.authStateLoaded);
  const [isShowChatModal, setIsShowChatModal] = useState(false);
  return (
    <>
      <div
        className={`fixed lg:bottom-28 bottom-0 right-0 w-full lg:right-10 z-[99999999999999999999999999999999] lg:w-80 lg:h-[60vh] h-full p-0 shadow-xl border bg-white rounded flex flex-col transform transition-transform ease-in-out duration-300 ${
          isShowChatModal ? "translate-x-0" : "translate-x-[120%]"
        }`}
      >
        {!authStateLoaded ? (
          <span className=" rounded bg-zinc-100 animate-pulse h-full w-full"></span>
        ) : !isAuthenticated ? (
          <div className="flex flex-col items-center pt-10 relative lg:order-3">
            <h3 className="  px-5 pt-4 text-center font-medium flex items-center text-slate-900 ">
              Login to Chat{" "}
            </h3>
            <IoMdClose
              onClick={() => setIsShowChatModal(false)}
              className="text-lg absolute right-4 top-4 cursor-pointer"
            />{" "}
            {/* <RiCloseLine
                        onClick={() => {
                          setIsShowPurchaseModal(false);
                        }}
                        className="text-xl cursor-pointer absolute top-2 right-2"
                      /> */}
            <div className="px-5 pb-5">
              <p className="text-center text-sm text-gray-700">
                Please log in to chat.
              </p>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => {
                    router.push(`/login?redirect=${pathname}`); // Redirect to login page
                  }}
                  className="bg-orange-400 hover:bg-[#FFAB4E] text-white font-semibold py-2 px-4 rounded"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col ">
            <ChatPage
              setIsShowChatModal={setIsShowChatModal}
              receiver={["6b3d6361-4f8a-464d-9d93-99d8d866b9d9"]}
              isPopup={true}
            />
          </div>
        )}
      </div>

      <div
        onClick={() => setIsShowChatModal(!isShowChatModal)}
        className="size-16 fixed right-6 lg:right-10 bottom-7 cursor-pointer bg-orange-400 flex items-center justify-center rounded-full z-[99999999999999999999999999999999] "
      >
        <IoChatbubbleEllipsesSharp className="text-2xl text-white" />
      </div>
    </>
  );
}

export default PopupChatModal;
