"use server"
import User from "@/models/User"
import VerificationCode from "@/models/VerificationCode"
import nodemailer from "nodemailer"

export default async (email: string) => {
  // does the user exist?
  const user = await User.findOne({ email })
  if(user) return { status: 2, message: "This Email is in use" }

  // create a transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  })
  
  // create verification code
  const verificationCode = Math.floor((Math.random() * 10000)).toString().padStart(4, '0')

  // create message
  const message = {
    from: `${process.env.APP_NAME} <${process.env.EMAIL}>`,
    to: `Recipient <${email}>`,
    subject: `Registration verification code`,
    text: `Your verification code: ${verificationCode}`
  }

  // send email
  transporter.sendMail(message)

  // create/update a code record with expiration in 1 minute
  const code = await VerificationCode.findOne({ email })
  // update
  if(code) await VerificationCode.updateOne({ email, verificationCode })
  // create
  else await VerificationCode.create({ email, verificationCode })

  return
}