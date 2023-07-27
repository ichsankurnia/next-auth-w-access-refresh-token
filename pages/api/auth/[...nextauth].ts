import NextAuth, { AuthOptions, type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import { BASE_URL } from "@/lib/fetch/axios";
import { NextApiRequest, NextApiResponse } from "next";


// const EXP_SESSION = 24 * 60 * 60 // 1 days
const EXP_SESSION = 10 // 10 seconds


async function refreshAccessToken(token: any) {
    // If the access token has expired, try to refresh it
    console.log("=========================== ACCESS TOKEN EXPIRED, REFRESH THE TOKEN ===========================")
    console.log({ token })
    try {
        const response = await fetch(BASE_URL + "/credentials/refresh-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refresh_token: token?.refresh_token
            }),
        })

        const data = await response.json()

        if (!response.ok) throw token

        return {
            ...token, // Keep the previous token properties
            access_token: data.data.access_token,
            expired_at: Math.floor(Date.now() + EXP_SESSION * 1000),
            refresh_token: data.data.refresh_token ?? token.refresh_token,
        }
    } catch (error) {
        console.error("Error refreshing access token", error)
        return { ...token, error: "RefreshAccessTokenError" as const }
    }
}


export const authOptions = (req?: NextApiRequest): AuthOptions => ({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            credentials: {
                username: {},
                password: {}
            },
            async authorize(credentials: any, req) {
                // Add logic here to look up the user from the credentials supplied

                const res = await fetch(BASE_URL + "/credentials/sign-in", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: credentials?.username,
                        password: credentials?.password,
                    }),
                });

                const data: any = await res.json();

                if (res.ok) {
                    if (data) {
                        data.data.expired_at = Date.now() + EXP_SESSION * 1000
                        console.log("LOGIN :", data)
                        return data.data;
                    } else {
                        throw new Error(`Invalid username or password`)
                    }
                } else {
                    throw new Error(data.message)
                }
            },
        })
        // ...add more providers here
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/login',
        // error: '/auth'
    },
    callbacks: {
        async jwt({ token, user, account, profile, trigger, session }: any) {
            // console.log("NEXTAUTH :", { token, user, trigger, session })
            if (trigger === "update" && session?.access_token) {
                // Note, that `session` can be any arbitrary object, remember to validate it!
                console.log("====================================== MASUK KE SESSION ========================================")
                console.log("============================ SESSION UPDATED FROM THE CLIENT ===================================")
                console.log({ session })
                return {
                    ...session, // Keep the previous token properties
                    expired_at: Math.floor(Date.now() + EXP_SESSION * 1000),
                }
                // return session
            }

            if (user) {
                console.log("============================ MASUK KE USER ===================================")
                console.log({ user })
                return {
                    ...token,
                    ...user
                }
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < token.expired_at) {
                console.log('================================= EXISTING ACCESS TOKEN IS VALID ===============================')
                console.log({ DATE_NOW: Date.now(), EXPIRED_AT: token.expired_at })
                return token
            }

            // Access token has expired, so we need to redresh it..
            console.log('ACCESS TOKEN HAS EXPIRED, REFERSHING...')
            return await refreshAccessToken(token)
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            // console.log("SESSION :", { session, token, user })
            session.user = token as any;

            return session;
        },
    },
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    return NextAuth(req, res, authOptions(req))
}

export default handler

// export default NextAuth(authOptions)