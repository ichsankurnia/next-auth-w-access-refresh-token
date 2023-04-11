import type { NextRequest } from "next/server"
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';


export async function signToken(payload: JWTPayload, secret: string, expiresIn: number): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    // const exp = iat + 60 * 60 * 24                       // 1 Day
    // const exp = iat + 30                                 // 30 Second
    const exp = iat + expiresIn

    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(secret))
}


export async function verify(token: string, secret: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    // run some checks on the returned payload, perhaps you expect some specific values

    // if its all good, return it, or perhaps just return a boolean
    return payload;
}


export default async function verifyToken(req: NextRequest, secret: string, existToken?: string): Promise<{ isAuthenticate: boolean, message: string | any }> {
    try {
        // // get token from request header
        // const requestHeaders = new Headers(request.headers)

        // const bearer = req.header('Authorization') || req.headers['x-access-token'];
        const bearer = req.headers.get('Authorization') || req.headers.get('x-access-token') || req.cookies.get('token')?.value || existToken

        if (!bearer) {
            return { isAuthenticate: false, message: 'Token is required' }
        }

        // // delete text Bearer inside token
        const token = bearer!.replace('Bearer ', '');

        // // verify token
        const decoded = await verify(token, secret || process.env.JWT_KEY!);

        // return NextResponse.next()
        return { isAuthenticate: true, message: decoded }
    } catch (error: any) {
        console.log(error)
        if (error.code) {
            return { isAuthenticate: false, message: `${error.code} ${error.name}` }
        }
        return { isAuthenticate: false, message: error.message }
    }
}