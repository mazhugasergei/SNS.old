import mongoose, { Schema, model } from "mongoose"

const UserSchema = new Schema({
  email: String,
  pfp: [String, null],
  username: String,
  display_name: String,
  password: String
}, { timestamps: true })

const User = mongoose.models.user || model('user', UserSchema)

export default User