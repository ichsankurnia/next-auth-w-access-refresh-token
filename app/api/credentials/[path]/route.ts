import TokenModel from '@/lib/database/token'
import UserModel from '@/lib/database/user'
import RoleModel from '@/lib/database/user-role'
import { AuthorizationError, ValidationError } from '@/lib/errorHandler'
import verifyToken, { signToken } from '@/lib/verifyToken'
import dayjs from 'dayjs'
import Joi from 'joi'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: any) {
    const { path } = params

    return NextResponse.json({ code: 0, message: "Success", data: path })
}

export async function POST(request: NextRequest, { params }: any) {
    const { path } = params

    switch (path) {
        case 'sign-in':
            return login(request)
        case 'refresh-token':
            return getNewToken(request)
        default:
            return NextResponse.json(
                { code: 404, message: 'URL Not Found', data: null },
                { status: 404 }
            )
    }
}


const login = async (req: NextRequest) => {
    try {
        // const TokenModel = mongoose.model('TokenModel', tokenSchema);
        let response = { code: 401, message: 'Failed Authenticate', data: null }

        const reqBody = await req.json()

        const schema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        })

        const { error } = schema.validate(reqBody)
        if (error) return ValidationError(error.message)

        const findUser = await UserModel.findOne({ username: reqBody.username })

        if (findUser) {
            const populateCollection = [
                {
                    path: "role_id",
                    model: RoleModel
                },
            ]

            // const pwd = await encryptAes(reqBody.password)
            const pwd = reqBody.password
            const findPass = await UserModel.findOne({ username: reqBody.username, password: pwd })
                .select(['_id', 'username', 'fullname', 'phone_number', 'email', 'last_login_on', 'created_on'])
                .populate(populateCollection)

            if (findPass) {

                // Give Token after success verification
                // const accessToken = await signToken(findPass.toJSON(), process.env.ACCESS_TOKEN_SECRET!, 60 * 60 * 24)                      // 1 DAY EXP
                const accessToken = await signToken(findPass.toJSON(), process.env.ACCESS_TOKEN_SECRET!, 10)                      // 10 SECOND EXP
                const refreshToken = await signToken(findPass.toJSON(), process.env.REFRESH_TOKEN_SECRET!, 60 * 60 * 24 * 30)               // 30 DAY EXP

                // STORE REFRESH TOKEN TO DB
                const a = await TokenModel.create({ refresh_token: refreshToken, created_by: reqBody.username })
                console.log("INSERT TOKEN :", a)

                // Update Last Login User
                await UserModel.findOneAndUpdate({ username: reqBody.username }, { last_login_on: dayjs().format('YYYY-MM-DD HH:mm:ss') })

                response = {
                    code: 0,
                    message: 'Success authenticate',
                    data: {
                        ...findPass._doc,
                        ...{
                            access_token: accessToken,
                            refresh_token: refreshToken
                        }
                    }
                }
            } else {
                response.message = 'Wrong password!'
            }
        } else {
            response.message = 'Username not registered!'
        }

        return NextResponse.json(
            response,
            { status: response.code ? response.code : 200 }
        )
    } catch (error: any) {
        console.log(error)
        return AuthorizationError(error.message)
    }
}


const getNewToken = async (req: NextRequest) => {
    try {
        console.log("FETCH NEW TOKEN")
        let response = { code: 401, message: 'Failed to fetch new token', data: null as any }

        const reqBody = await req.json()

        const schema = Joi.object({
            refresh_token: Joi.string().required(),
        })

        console.log("REFRESH TOKEN :", reqBody.refresh_token)

        const { error } = schema.validate(reqBody)
        if (error) return ValidationError(error.message)

        // VERIFY REFRESH TOKEN REQUEST
        const { isAuthenticate, message } = await verifyToken(req, process.env.REFRESH_TOKEN_SECRET!, reqBody.refresh_token)


        if (!isAuthenticate) {
            // return NextResponse.json(
            //     { code: 401, message: `Refresh Token: ${message}`, data: null },
            //     { status: 401, headers: { 'content-type': 'application/json' } }
            // )
            response.message = `Refresh Token: ${message}`
        }

        const findToken = await TokenModel.findOne({ refresh_token: reqBody.refresh_token })
        if (findToken) {
            delete message.exp
            delete message.iat
            delete message?.nbf

            // const newAccessToken = await signToken(message, process.env.ACCESS_TOKEN_SECRET!, 60 * 60 * 24)
            const newAccessToken = await signToken(message, process.env.ACCESS_TOKEN_SECRET!, 10)
            const newRefreshToken = await signToken(message, process.env.REFRESH_TOKEN_SECRET!, 60 * 60 * 24 * 30)

            // UPDATE OLD REFRESH TOKEN IN DB WITH NEW ONE
            await TokenModel.findByIdAndUpdate(findToken._id, { refresh_token: newRefreshToken, updated_on: new Date(), updated_by: message.username })

            response = {
                code: 0,
                message: 'Success to fetch new token',
                data: {
                    access_token: newAccessToken,
                    refresh_token: newRefreshToken
                }
            }
        } else {
            response.message = 'Refresh token not found'
        }

        console.log(response)

        return NextResponse.json(
            response,
            { status: response.code ? response.code : 200 }
        )
    } catch (error: any) {
        console.log(error)
        return AuthorizationError("Refresh token is invalid or expired! " + error.message)
    }
}