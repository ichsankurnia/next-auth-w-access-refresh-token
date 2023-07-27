"use client";

import { signOut, useSession } from "next-auth/react";
import axios from "../axios";

export const useRefreshToken = () => {
  const { data: session, update } = useSession();

  const refreshToken = async () => {
    try {
      const payload = {
        refresh_token: session?.user.refresh_token,
      }
      const res = await axios.post("/credentials/refresh-token", payload);

      console.log('REFRESH TOKEN FROM CLIENT')
      console.log(res)

      if (session) {
        session.user.access_token = res.data.data.access_token;
        session.user.refresh_token = res.data.data.refresh_token;
        await update(session.user)
        // await update((prev: any) => {...prev, foo: "new session value"})
        // await update((prev: any) => ({ ...prev, access_token: res.data.data.access_token, refresh_token: res.data.data.refresh_token }))
      }
      else signOut();

    } catch (error) {
      signOut()
    }

  };

  return refreshToken;
};
