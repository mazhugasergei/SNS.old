"use client"
import Link from "next/link"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import sign_up from "@/actions/sign_up"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "@/store/slices/user.slice"
import { useRouter } from "next/navigation"
import LoadingSVG from "@/images/loading.svg"
import Image from "next/image"
import { RootState } from "@/store/store"

export default () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const auth = useSelector((state: RootState) => state.user.auth)
  const [loggedIn,  setLoggedIn] = useState(true)
  const [email, setEmail] = useState("markuswedler8@gmail.com")
  const [username, setUsername] = useState("markuswedler")
  const [fullname, setFullname] = useState("Markus Wedler")
  const [password, setPassword] = useState("asd")
  const usernameRegex = /^[\w\.]*$/
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*_.,\b]*$/
  const [error, setError] = useState<{ status: number, message: string } | null>()
  const [pending, setPending] = useState(false)

  // redirect if logged in
  useEffect(()=>{
    if(auth) router.push("/")
    else setLoggedIn(false)
  })

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setEmail(e.target.value)
  }

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const valid = usernameRegex.test(e.target.value)
    if(valid) setUsername(e.target.value)
    else setError({ status: 2, message: `Only letters, numbers, "_" and "." are allowed` })
  }

  const handleFullnameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setFullname(e.target.value)
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const valid = passwordRegex.test(e.target.value)
    if(valid) setPassword(e.target.value)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    // button loading animation
    setPending(true)
    // generate verification code
    await sign_up(email, username, fullname, password)
      .then(res => {
        // error
        if(res){
          const { status, message } = res
          setError({ status, message })
          setPending(false)
        }
        // redirect
        else{
          dispatch(setUser({ email, is_signing_up: true }))
          setTimeout(() => dispatch(setUser({ email: null, is_signing_up: false })), 300000)
          router.push("/verification")
        }
      })
  }

  return !loggedIn && (
    <main className="sign-up form-cont wrapper">
      <div className="title">Sign up</div>
      <form onSubmit={handleSubmit} method="post">
        {/* Email */}
        <input className={`form-input ${ error?.status === 1 && "error" }`} value={email} onChange={handleEmailChange} type="email" placeholder="Email" required />
        { error?.status === 1 && <div className="error">Uh oh - { error.message }</div> }
        {/* Username */}
        <input className={`form-input ${ error?.status === 2 && "error" }`} value={username} onChange={handleUsernameChange} type="text" placeholder="Username" required />
        { error?.status === 2 && <div className="error">{ error.message }</div> }
        {/* Fullname */}
        <input className="form-input" value={fullname} onChange={handleFullnameChange} type="text" placeholder="Fullname" required />
        {/* Password */}
        <input className="form-input" value={password} onChange={handlePasswordChange} type="password" placeholder="Password" required />
        {/* Submit Button */}
        <button className="btn">{ pending ? <Image className="loading" src={LoadingSVG} alt="" /> : "Sign up" }</button>
        <div className="switch-auth">Already have an account? <Link href="/log-in">Log in</Link></div>
      </form>
    </main>
  )
}