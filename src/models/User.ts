import mongoose, { Schema, model } from "mongoose"

const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  pfp: {
    type: String,
    default: undefined
  },
  username: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  verification_code: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expires: {
    type: Date,
    default: Date.now,
    expires: 300
  }
})

delete mongoose.models['user']
export default model('user', UserSchema)