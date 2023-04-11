import axios from "axios";
import { getServerSession } from "next-auth";
import { BASE_URL } from "./axios";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// async function refreshToken(refreshToken: string) {
//   const res = await fetch(BASE_URL + "/auth/refresh-token", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       refresh_token: refreshToken,
//     }),
//   });

//   const { data } = await res.json();
//   return data;
// }

async function refreshToken(refreshToken: string) {
  try {
    const res = await axios.post(BASE_URL + "/credentials/refresh-token", {
      refresh_token: refreshToken,
    })

    return res.data.data
  } catch (error) {
    return null
  }
}

export async function AuthGetApi(url: string) {
  const session = await getServerSession(authOptions());

  try {
    // console.log("session fetch api :", session)

    let res = await axios.get(BASE_URL + url, {
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
      }
    })

    if (res.status === 401) {
      // console.log("NOT AUTHORIZE")
      const newToken = await refreshToken(session?.user.refresh_token ?? "")
      // console.log("FETCH NEW TOKEN :", newToken)

      if (session) {
        session.user.access_token = newToken.access_token;
        session.user.refresh_token = newToken.refresh_token;
      }

      let res = await axios.get(BASE_URL + url, {
        headers: {
          Authorization: `Bearer ${session?.user.access_token}`,
        }
      })

      return res.data.data
    }

    return res.data.data
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 401) {
        // console.log("NOT AUTHORIZE, REFRESH TOKEN REQ:", session?.user.refresh_token)
        const newToken = await refreshToken(session?.user.refresh_token ?? "")
        // console.log("FETCH NEW TOKEN :", newToken)

        if (newToken?.access_token) {
          if (session) {
            session.user.access_token = newToken.access_token;
            session.user.refresh_token = newToken.refresh_token;
          }

          let res = await axios.get(BASE_URL + url, {
            headers: {
              Authorization: `Bearer ${session?.user.access_token}`,
            }
          })

          return res.data.data
        }
      }
      return error.response.data
    }
    return error
  }
}
