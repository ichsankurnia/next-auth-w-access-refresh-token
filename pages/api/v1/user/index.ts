import UserModel from '@/lib/database/user'
import { URLNotFoundError } from '@/lib/errorHandler'
import { ApplicationError, ValidationError } from '@/lib/errorHandler'
import { ResponseData } from '@/types/types'
import Joi from 'joi'
import { NextApiRequest, NextApiResponse } from 'next'
import { type NextRequest, NextResponse } from 'next/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    try {

        const { method } = req

        switch (method) {
            case 'GET':
                return getData(req)
            case 'POST':
                return createData(req)
            default:
                return URLNotFoundError()
        }
    } catch (error: any) {
        return ApplicationError(error.message)
    }
}

export const config = {
    api: {
        bodyParser: true, // Defaults to true. Setting this to false disables body parsing and allows you to consume the request body as stream or raw-body.
        responseLimit: false, // Determines how much data should be sent from the response body. It is automatically enabled and defaults to 4mb.
        externalResolver: false, // Disables warnings for unresolved requests if the route is being handled by an external resolver like Express.js or Connect. Defaults to false.
    },
}


const getData = async (req: NextApiRequest) => {
    try {
        // const TokenModel = mongoose.model('TokenModel', tokenSchema);
        let response = { code: 400, message: 'Failed get user', data: null as any }

        const user = await UserModel.find()

        response.code = 200
        response.message = 'Success get User'
        response.data = user

        return NextResponse.json(
            response,
            { status: response.code ? response.code : 200 }
        )
    } catch (error: any) {
        console.log(error)
        return ApplicationError(error.message)
    }
}


const createData = async (req: NextApiRequest) => {
    try {
        let response = { code: 400, message: 'Failed create user', data: null as any }

        const schema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required().min(5),
            fullname: Joi.string().required(),
            phone_number: Joi.string().optional().min(9).max(14).pattern(/^[0-9]+$/).message("Phone number must be number only!").allow("").allow(null),
            email: Joi.string().email().optional().allow("").allow(null),
            role_id: Joi.string().optional(),
            created_by: Joi.string().optional().allow("").allow(null),
        })

        const { error } = schema.validate(req.body)
        if (error) return ValidationError(error.message)

        if (!req.body.created_by) {
            req.body.created_by = 'system'
        }

        const data = await UserModel.create(req.body)

        if (data) {
            response.code = 0
            response.message = 'Success create new user'
            response.data = data
        }

        return NextResponse.json(
            response,
            { status: response.code ? response.code : 200 }
        )
    } catch (error: any) {
        console.log(error)
        return ApplicationError(error.message)
    }
}