import mongoose, { Schema, model } from "mongoose"

const VerificationCodeSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  verificationCode: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 120
  }
})

const VerificationCode = mongoose.models.verification_code || model('verification_code', VerificationCodeSchema)

export default VerificationCode