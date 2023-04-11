import Joi from 'joi'
import UserModel from '@/lib/database/user'
import RoleModel from '@/lib/database/user-role'
import { ApplicationError, URLNotFoundError, ValidationError } from '@/lib/errorHandler'
import { type NextRequest, NextResponse } from 'next/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { ResponseData } from '@/types/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    try {
        const { id } = req.query
        const { method } = req

        switch (method) {
            case 'GET':
                return getDetail(req, id as string)
            case 'PATCH':
                return updateData(req, id as string)
            case 'DELETE':
                return deleteData(req, id as string)
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


const getDetail = async (req: NextApiRequest, id: string) => {
    try {
        // const TokenModel = mongoose.model('TokenModel', tokenSchema);
        let response = { code: 400, message: 'Failed get user', data: null as any }

        const populateCollection = [
            {
                path: "role_id",
                model: RoleModel
            },
        ]

        const data = await UserModel.findById(id).populate(populateCollection)

        if (data) {
            response.code = 200
            response.message = 'Success get User'
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


const updateData = async (req: NextApiRequest, id: string) => {
    try {
        let response = { code: 400, message: 'Failed update user', data: null as any }

        const schema = Joi.object({
            username: Joi.string().optional(),
            password: Joi.string().optional().min(5),
            fullname: Joi.string().optional(),
            phone_number: Joi.string().optional().min(9).max(14).pattern(/^[0-9]+$/).message("Phone number must be number only!").allow("").allow(null),
            email: Joi.string().email().optional().allow("").allow(null),
            role_id: Joi.string().optional(),
            updated_by: Joi.string().optional().allow("").allow(null),
        })

        const { error } = schema.validate(req.body)
        if (error) return ValidationError(error.message)

        if (!req.body.updated_by) {
            req.body.updated_by = 'system'
        }
        req.body.updated_on = new Date()

        const data = await UserModel.findByIdAndUpdate(id, req.body)

        if (data) {
            response.code = 0
            response.message = 'Success update user'
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


const deleteData = async (req: NextApiRequest, id: string) => {
    try {
        let response = { code: 400, message: 'Failed delete user', data: null as any }

        const data = await UserModel.findByIdAndDelete(id)

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