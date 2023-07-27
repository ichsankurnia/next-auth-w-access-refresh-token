import NextAuth from "next-auth";

declare module 'next-auth' {
    interface Session {
        user: {
            _id: string
            username: string
            fullname: string
            phone_number: string
            email: string
            role_id: string
            created_on: string
            access_token: string
            refresh_token: string
            exp: number
            expired_at: number
        }
    }
}