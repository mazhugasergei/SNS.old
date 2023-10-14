"use client"
import Link from "next/link"
import { ChangeEvent, FormEvent, useState } from "react"
import verivicationCode from "@/actions/verivication_code"
import { useDispatch } from "react-redux"
import { setUser } from "@/store/slices/user.slice"
import { useRouter } from "next/navigation"
import LoadingSVG from "@/images/loading.svg"
import Image from "next/image"

export default () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [email, setEmail] = useState("markuswedler8@gmail.com")
  const [password, setPassword] = useState("asd")
  const [repeatPassword, setRepeatPassword] = useState("asd")
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*_.,\b]*$/
  const [error, setError] = useState<{ status: number, message: string } | null>()
  const [pending, setPending] = useState(false)

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const valid = passwordRegex.test(e.target.value)
    if(valid) setPassword(e.target.value)
  }

  const handleRepeatPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const valid = passwordRegex.test(e.target.value)
    if(valid) setRepeatPassword(e.target.value)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    // if passwords do not match
    if(password !== repeatPassword){ setError({ status: 1, message: "Passwords do not match" }); return }
    // button loading animation
    setPending(true)
    // generate verification code
    await verivicationCode(email)
      .then(res => {
        // error
        if(res?.status){
          const { status, message } = res
          setError({ status, message })
          setPending(false)
        }
        // redirect
        else{
          dispatch(setUser({ email, password }))
          router.push("/verification")
        }
      })
  }

  return (
    <main className="sign-up form-cont wrapper">
      <div className="title">Sign up</div>
      <form onSubmit={handleSubmit}>
        <input className={`form-input ${ error?.status === 2 && "error" }`} value={email} onChange={handleEmailChange} type="email" placeholder="Email" required />
        { error?.status === 2 && <div className="error">Uh oh - { error.message }</div> }
        <input className={`form-input ${ error?.status === 1 && "error" }`} value={password} onChange={handlePasswordChange} type="password" placeholder="Password" required />
        <input className={`form-input ${ error?.status === 1 && "error" }`} value={repeatPassword} onChange={handleRepeatPasswordChange} type="password" placeholder="Repeat password" required />
        { error?.status === 1 && <div className="error">Uh oh - { error.message }</div> }
        <button className="btn">{ !pending && "Sign up" }{ pending && <Image className="loading" src={LoadingSVG} alt="" /> }</button>
        <div className="switch-auth">Already have an account? <Link href="/log-in">Log in</Link></div>
      </form>
    </main>
  )
}