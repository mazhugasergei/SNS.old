"use client"
import verify from "@/actions/verify"
import { RootState } from "@/store/store"
import { useRouter } from "next/navigation"
import { ChangeEvent, FormEvent, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Image from "next/image"
import LoadingSVG from "@/images/loading.svg"
import { setUser } from "@/store/slices/user.slice"

export default () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const email = useSelector((state: RootState) => state.user.email)
  const [verificationCode,  setVerificationCode] = useState("")
  const [error, setError] = useState<{ status: number, message: string } | null>()
  const [pending, setPending] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const regex = /^[0-9]*$/
    const valid = regex.test(e.target.value)
    if(valid) setVerificationCode(e.target.value)
  }
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setPending(true)
    await verify(email ? email : "", verificationCode)
      .then(res => {
        // error
        if(res?.status){
          const { status, message } = res
          setError({ status, message })
          setPending(false)
        }
        // redirect
        else{
          const { token } = res
          dispatch(setUser({ auth: true, token }))
          router.push("/")
        }
      })
  }

  return (
    <main className="verification form-cont wrapper">
      <div className="title">Email Code</div>
      <form onSubmit={handleSubmit}>
        <input className={`form-input ${ error?.status === 1 && "error" }`} type="text" placeholder="****" maxLength={4} value={verificationCode} onChange={handleInputChange} required />
        { error?.status === 1 && <div className="error">Uh oh - { error.message }</div> }
        <button className="btn">{ pending ? <Image className="loading" src={LoadingSVG} alt="" /> : "Submit" }</button>
      </form>
    </main>
  )
}