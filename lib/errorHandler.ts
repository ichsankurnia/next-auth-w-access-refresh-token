import { type NextRequest, NextResponse } from 'next/server'

export const ApplicationError = (message?: string, status: number = 500) => {
    const resMessage = `Internal Server Error${message ? ': ' + message : '.'}`

    // return new Response(
    //     JSON.stringify({ code: status, message: resMessage, data: null }),
    //     {
    //         status: status,
    //         // headers: { 'Set-Cookie': `token=${token}` }
    //     }
    // );
    return NextResponse.json(
        { code: status, message: resMessage, data: null },
        { status: status }
    )
    // return res.status(status).json({ code: status, message: resMessage, data: null })
}


export const ValidationError = (message?: string, status: number = 400) => {
    const resMessage = `Validation Error${message ? ': ' + message : '.'}`

    return NextResponse.json(
        { code: status, message: resMessage, data: null },
        { status: status }
    )
}


export const DatabaseError = (message?: string, status: number = 500) => {
    const resMessage = `Database Error${message ? ': ' + message : '.'}`

    return NextResponse.json(
        { code: status, message: resMessage, data: null },
        { status: status }
    )
}


export const AuthorizationError = (message?: string, status: number = 401) => {
    const resMessage = `Unauthorized${message ? ': ' + message : '.'}`

    return NextResponse.json(
        { code: status, message: resMessage, data: null },
        { status: status }
    )
}


export const URLNotFoundError = (message?: string, status: number = 404) => {
    const resMessage = `URL Not Found${message ? ': ' + message : '.'}`

    return NextResponse.json(
        { code: status, message: resMessage, data: null },
        { status: status }
    )
}


export const MethodNotAllowedError = (message?: string, status: number = 405) => {
    const resMessage = `Method Not Allowed${message ? ': ' + message : '.'}`

    return NextResponse.json(
        { code: status, message: resMessage, data: null },
        { status: status }
    )
}