import React from "react";
import { IoSend } from "react-icons/io5";
import { MdOutlineAttachFile } from "react-icons/md";
import { FileBase64_TYPE } from "@/app/types";

function ChatPageInputs({
  fileBase64List,
  setFileBase64List,
  sendMessage,
  msg,
  setMsg,
  isSendingMessage,
}: {
  fileBase64List: FileBase64_TYPE[];
  setFileBase64List: React.Dispatch<React.SetStateAction<FileBase64_TYPE[]>>;
  sendMessage: (e: { preventDefault: () => void }) => void;
  msg: string;
  setMsg: (value: string) => void;
  isSendingMessage: boolean;
}) {
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

  return (
    <>
      {" "}
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
    </>
  );
}

export default ChatPageInputs;
