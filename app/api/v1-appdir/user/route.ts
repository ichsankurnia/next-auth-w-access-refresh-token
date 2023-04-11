import UserModel from '@/lib/database/user'
import { ApplicationError, ValidationError } from '@/lib/errorHandler'
import Joi from 'joi'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    return getData(request)
}

export async function POST(request: NextRequest) {
    return createData(request)
}


const getData = async (req: NextRequest) => {
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


const createData = async (req: NextRequest) => {
    try {
        let response = { code: 400, message: 'Failed create user', data: null as any }

        const reqBody = await req.json()

        const schema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required().min(5),
            fullname: Joi.string().required(),
            phone_number: Joi.string().optional().min(9).max(14).pattern(/^[0-9]+$/).message("Phone number must be number only!").allow("").allow(null),
            email: Joi.string().email().optional().allow("").allow(null),
            role_id: Joi.string().optional(),
            created_by: Joi.string().optional().allow("").allow(null),
        })

        const { error } = schema.validate(reqBody)
        if (error) return ValidationError(error.message)

        if (!reqBody.created_by) {
            reqBody.created_by = 'system'
        }

        const data = await UserModel.create(reqBody)

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