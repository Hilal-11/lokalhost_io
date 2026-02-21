"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FaGoogle } from "react-icons/fa6";
import { useState } from "react"
import PrefetchLink from "@/components/pre-fetching"
import { useRouter } from "next/navigation";
import { LoginFormSchema } from "@/lib/definitions"
import { Spinner } from "@/components/ui/spinner"
import Snowfall from "react-snowfall"
import { PiTerminalFill } from "react-icons/pi";

export const dynamic = "force-static";


const  Login = () => {

    const [loading , setLoading] = useState(false);
    const [invalidLoginCradentials , setInvalidLoginCradentials] = useState({
      email: "",
      password: ""
    })

    const [formData , setFormData] = useState({
      email: "",
      password: ""
    })
    const handleFormChange = (event) => {
      const { name, value } = event.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    const handleFocus = (e) => {
      const { name } = e.target;
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
      setInvalidLoginCradentials((prev) => ({
        ...prev,
        [name]: "",
      }))
    }


    const router = useRouter();
    const [errors , setErrors] = useState({
      email: "",
      password: ""
    })

    const handleFormSubmittion = async (event) => {
      event.preventDefault();
      setLoading(true);
      const validatedFields = LoginFormSchema.safeParse({
        email: formData?.email,
        password: formData?.password,
      });
      // If any form fields are invalid, return early
      if (!validatedFields.success) {
        setLoading(false);
        setErrors(validatedFields.error.flatten().fieldErrors)
        return;
      }
      // api call for backend to entry in databse
  
      try{
          const response = await fetch(`/api/users/login` , {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              
            },
            body: JSON.stringify(validatedFields.data),
            credentials: "include",
          })
         
          if(!response.ok) {
            const data = await response.json();
            setInvalidLoginCradentials((prev) => ({
              ...prev,
              email: data?.message,
            }));
            setInvalidLoginCradentials((prev) => ({
              ...prev,
              password: data?.message,
            }));
            return;
          }
          router.push("/")
        }catch(error) {
            console.log(error.message)
        } finally {
          setLoading(false);
        }  
    }

  

  return (
    <div className="w-full h-auto">
    <div className="flex flex-col w-full h-svh relative justify-center items-start lg:justify-center lg:items-center md:justify-center md:items-center">
      
      <div className="w-svw h-[100%] lg:w-[460px] md:w-[460px] md:h-auto lg:h-auto z-30 dg-neutral-50 dark:bg-neutral-900
      shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] px-4 lg:px-2 py-4 flex justify-center items-center md:rounded-xl lg:rounded-xl">
        <form onSubmit={handleFormSubmittion}>

           {/* Brand Header Section */}
            <div className="justify-center flex items-center gap-2 w-full pb-3">
                <span className="text-white font-bold text-3xl"><PiTerminalFill /></span><h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Lokalhost.io</h2>
            </div>
          
            <h1 className="text-xl font-bold ">Login</h1>
            <p className="font-sans font-medium text-sm pl-1.5 text-neutral-700 dark:text-neutral-300 pb-8 py-1">Login to your account if you already have an account.</p>

            <div className="mt-0">
                <Label className="text-[15px] font-sans font-medium pb-1 px-1" htmlFor="email">Email</Label>
                <Input className="py-5" onChange={handleFormChange} onFocus={handleFocus} value={formData.email} id="email" name="email" type="email" placeholder="Enter email ID:- "/>
                <div className='lg:w-[360px] text-red-600 font-sans font-medium px-1 text-[11px] py-px '>{errors?.email}</div>
                <div className='lg:w-[360px] text-red-600 font-sans font-medium px-1 text-[11px] py-px '>{invalidLoginCradentials?.email}</div>

            </div>
            <div className="mt-3">
                <Label className="text-[15px] font-sans font-medium pb-1 px-1" htmlFor="password">Password</Label>
                <Input className="py-5" onChange={handleFormChange} onFocus={handleFocus} value={formData.password} id="password" name="password" type="password" placeholder="Enter Password:-"/>
                <div className='lg:w-[360px] text-red-600 font-sans font-medium px-1 text-[11px] py-px '>{errors?.password}</div>
                <div className='lg:w-[360px] text-red-600 font-sans font-medium px-1 text-[11px] py-px '>{invalidLoginCradentials?.password}</div>
            </div>
             <div className="mt-1 flex justify-between w-full px-2 text-sm font-medium text-neutral-600">
                <div className="flex gap-2 items-center justify-center">
                  <input type="checkbox" id="rememberMe" name="rememberMe" />
                  <p className="dark:text-neutral-300">Remember Me</p>
                </div>
                <div><p className="dark:text-neutral-300">Forget password?</p></div>
            </div>
            <div className="mt-8">
                <Button className="w-full cursor-pointer font-sans font-medium px-10 py-6 rounded-md bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] text-md" type="submit" disabled={loading}>{loading && <div><Spinner/></div>} Login</Button>
            </div>

            <div className="mt-6 mb-6 flex justify-between items-center gap-3 px-4">
              <div className="border border-gray-300 w-full h-px"></div>
              <span className="font-medium font-sans text-sm">OR</span>
              <div className="border border-gray-300 w-full h-px"></div>
            </div>
            <div className="mt-3 flex gap-1 w-full">
                <Button className="w-full cursor-pointer font-sans font-medium px-10 py-6 rounded-md bg-white  text-neutral-800 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] text-md hover:bg-none" type="submit"><span className="text-2xl"><FaGoogle  /></span>Google</Button>
            </div>

            <div className="mt-4 text-center text-sm 0 mx-auto">
                <p >Don not have an account? <PrefetchLink href="/signup" className="font-bold text-neutral-500 pl-1 underline"> signup</PrefetchLink></p>
            </div>

        </form>
      </div>
    </div>
  </div>
  )
}

export default Login

