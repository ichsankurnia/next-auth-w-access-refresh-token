import mongoose from 'mongoose'
import mongodb from './database'

export const roleSchema = new mongoose.Schema({
    role_name: {
        type: String,
        unique: true,
        required: [true, 'role name is required']
    },
    description: { type: String },
})


// const RoleModel = mongodb.model("RoleModel", roleSchema, 'c_user_role')
// export default RoleModel

export default mongodb.models.RoleModel || mongodb.model('RoleModel', roleSchema, 'c_user_role');