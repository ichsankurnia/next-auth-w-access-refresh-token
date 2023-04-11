import Joi from 'joi'
import UserModel from '@/lib/database/user'
import RoleModel from '@/lib/database/user-role'
import { ApplicationError, ValidationError } from '@/lib/errorHandler'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: any) {
    const { id } = params

    return getDetail(request, id)
}

export async function PATCH(request: NextRequest, { params }: any) {
    const { id } = params

    return updateData(request, id)
}

export async function DELETE(request: NextRequest, { params }: any) {
    const { id } = params

    return deleteData(request, id)
}


const getDetail = async (req: NextRequest, id: string) => {
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


const updateData = async (req: NextRequest, id: string) => {
    try {
        let response = { code: 400, message: 'Failed update user', data: null as any }

        const reqBody = await req.json()

        const schema = Joi.object({
            username: Joi.string().optional(),
            password: Joi.string().optional().min(5),
            fullname: Joi.string().optional(),
            phone_number: Joi.string().optional().min(9).max(14).pattern(/^[0-9]+$/).message("Phone number must be number only!").allow("").allow(null),
            email: Joi.string().email().optional().allow("").allow(null),
            role_id: Joi.string().optional(),
            updated_by: Joi.string().optional().allow("").allow(null),
        })

        const { error } = schema.validate(reqBody)
        if (error) return ValidationError(error.message)

        if (!reqBody.updated_by) {
            reqBody.updated_by = 'system'
        }
        reqBody.updated_on = new Date()

        const data = await UserModel.findByIdAndUpdate(id, reqBody)

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


const deleteData = async (req: NextRequest, id: string) => {
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