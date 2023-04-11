// export { default } from 'next-auth/middleware'
import { withAuth } from "next-auth/middleware";
// export { withAuth } from "next-auth/middleware"
import { NextRequest, NextResponse } from "next/server";
import verifyToken from "./lib/verifyToken";

// export default withAuth(
//     // `withAuth` augments your `Request` with the user's token.
//     async function middleware(req) {
//         // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
//         const session: any = req.nextauth.token
//         // const token = req.cookies.get('next-auth.session-token')
//         console.log("SESSION :", session)
//         // console.log("TOKEN :", token)

//         const { nextUrl } = req
//         const { pathname } = nextUrl

//         // CHECK TOKEN IN API ENDPOINT
//         if (pathname.startsWith('/api/v1-appdir')) {
//             const { isAuthenticate, message } = await verifyToken(req, process.env.ACCESS_TOKEN_SECRET!)
//             if (!isAuthenticate) {
//                 return new NextResponse(
//                     JSON.stringify({ code: 401, message: message, data: null }),
//                     { status: 401, headers: { 'content-type': 'application/json' } }
//                 )
//             }
//         }

//         // if ((session.exp * 1000) < new Date().getTime()) {
//         //     console.log("NEXTAUTH SESSION HAS EXPIRED")
//         //     // return NextResponse.rewrite( new URL("/auth?error=Your session has expired, please log back in!", req.url));
//         //     return NextResponse.redirect(new URL(`/auth?error=Your session has expired, please log back in!&callbackUrl=${req.url}`, req.url))
//         // }
//     },
//     // {
//     //     callbacks: {
//     //         authorized: ({ token }) => !!token,
//     //     },
//     // }
// );

export async function middleware(req: NextRequest, ev: any) {
    //Always will Run

    // These are protected routes.
    /**
     * Run NextAuth except api endpoint
     */
    if (!req.nextUrl.pathname.startsWith('/api/v1') && !req.nextUrl.pathname.startsWith('/api/v1-appdir')) {
        // @ts-ignore
        return withAuth(req);
    } else {
        const { isAuthenticate, message } = await verifyToken(req, process.env.ACCESS_TOKEN_SECRET!)
        if (!isAuthenticate) {
            return new NextResponse(
                JSON.stringify({ code: 401, message: message, data: null }),
                { status: 401, headers: { 'content-type': 'application/json' } }
            )
        } else {
            return NextResponse.next()
        }
    }
}

// This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {
//     const { isAuthenticate, message } = await verifyToken(request, process.env.ACCESS_TOKEN_SECRET!)

//     if (!isAuthenticate) {
//         return new NextResponse(
//             JSON.stringify({ code: 401, message: message, data: null }),
//             { status: 401, headers: { 'content-type': 'application/json' } }
//         )
//     }

//     // return NextResponse.next()
// }


export const config = {
    matcher: ['/', '/user/:path*', '/api/v1/:path*', '/api/v1-appdir/:path*'],
    // matcher: [
    //     /*
    //      * Match all request paths except for the ones starting with:
    //      * - api (API routes)
    //      * - static (static files)
    //      * - favicon.ico (favicon file)
    //      */
    //     '/((?!api|static|favicon.ico).*)',
    // ],
}