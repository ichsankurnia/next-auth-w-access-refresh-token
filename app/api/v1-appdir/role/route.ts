import RoleModel from "@/lib/database/user-role"
import { ApplicationError } from "@/lib/errorHandler"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    return getData(request)
}


const getData = async (req: NextRequest) => {
    try {
        // const TokenModel = mongoose.model('TokenModel', tokenSchema);
        let response = { code: 400, message: 'Failed get user role', data: null as any }

        const user = await RoleModel.find()

        response.code = 200
        response.message = 'Success get user role'
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