import mongoose from 'mongoose'
import mongodb from './database'

export const tokenSchema = new mongoose.Schema({
    refresh_token: {
        type: String,
        unique: true,
        required: [true, 'Refresh Token is required']
    },
    created_on: {
        type: Date,
        default: new Date()
    },
    created_by: { type: String },
    updated_on: { type: Date },
    updated_by: { type: String }
})

// const TokenModel = mongodb.model("TokenModel", tokenSchema, 'c_token')
// export default TokenModel

export default mongodb.models.TokenModel || mongodb.model('TokenModel', tokenSchema, 'c_token');