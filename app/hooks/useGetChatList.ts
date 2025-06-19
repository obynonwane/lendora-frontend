"use client";

import useSWR from "swr";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { UserData_TYPE } from "@/app/types";
import { getFromLocalStorage } from "@/app/utils/utility";
import { useUserStore } from "../utils/useUserStore";

const userData: UserData_TYPE | null = getFromLocalStorage("lendora_user");

const fetchSearchList = async (
  url: string,
  router: ReturnType<typeof useRouter>,
  pathname: string,
  logout: () => void
) => {
  if (!userData) {
    throw new Error("User data not found in local storage");
  }

  try {
    const token = getFromLocalStorage("lendora_ac_tk");

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("✅ Chat List response:", response.data);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.data?.status_code;

      if (status === 401) {
        // localStorage.removeItem("lendora_ac_tk");
        // localStorage.removeItem("lendora_user");
        logout();

        return;
      }
    }

    throw error;
  }
};

export function useGetChatList() {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useUserStore((s) => s.logout);

  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/chat/chat-list?userId=${userData?.detail.user.id}`;

  const { data, error, isLoading } = useSWR([url], ([url]) =>
    fetchSearchList(url, router, pathname, logout)
  );

  return {
    chatListData: data,
    isChatListEError: error,
    isFetchingChatList: isLoading,
  };
}
