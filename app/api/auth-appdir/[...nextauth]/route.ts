import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import { BASE_URL } from "@/lib/fetch/axios";

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
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
                console.log("LOGIN :", data)

                if (res.ok) {
                    if (data) {
                        // Any object returned will be saved in `user` property of the JWT
                        return data.data;
                    } else {
                        // // If you return null then an error will be displayed advising the user to check their details.
                        // return null;

                        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                        throw new Error(`Invalid username or password`)
                    }
                } else {
                    throw new Error(data.message)
                }

                // const user: any = await UserModel.findOne({ username })
                // if (!user) {
                //     throw new Error('Username not registered!')
                // }

                // const userByPwd = await UserModel.findOne({ username, password })
                // if (!userByPwd) {
                //     throw new Error(`Invalid password for username ${username}`)
                //     // return null
                // }

                // return userByPwd
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
        async jwt({ token, user, trigger, session, account, profile }: any) {
            // console.log("NEXTAUTH :", { token, user, trigger, session })
            if (trigger === "update" && session?.access_token) {
                // Note, that `session` can be any arbitrary object, remember to validate it!
                return session
            }
            return { ...token, ...user };
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            // console.log("SESSION :", { session, token, user })
            session.user = token as any;

            return session;
        },
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }