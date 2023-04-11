import mongoose from 'mongoose'
import mongodb from './database'

export const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    fullname: {
        type: String,
    },
    phone_number: {
        unique: true,
        type: String,
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        default: "",
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "c_user_role"
    },
    last_login_on: { type: Date },
    created_on: {
        type: Date,
        default: new Date()
    },
    created_by: { type: String },
    updated_on: { type: Date },
    updated_by: { type: String }
})


// const UserModel = mongodb.model("UserModel", userSchema, 'c_user')
// export default UserModel

export default mongodb.models.UserModel || mongodb.model('UserModel', userSchema, 'c_user');