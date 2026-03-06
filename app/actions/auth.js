"use server"
import { redirect } from "next/navigation";
import { SignupFormSchema , LoginFormSchema } from '../../lib/definitions';

export async function signup(state , formData) {
  // Validate form fields
  console.log("Signup from data = ",formData)
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  
  // Call the provider or db to create a user...
  let response;
  try{
    response = await fetch(`${process.env.DOMAIN}/api/users/signup` , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedFields.data)
    })
    
  }catch(error) {
    return {
      message: "Something went wrong. Please try again.",
    };
  }
    if(response.ok) {
      redirect('/login')
    }

}
export async function login(state , formData) {
      // Validate form fields
  console.log("Login form data = ",formData)
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
 
  // Call the provider or db to create a user...
  let response;
  try{
    response = await fetch(`${process.env.DOMAIN}/api/users/login` , {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      
      },
      body: JSON.stringify(validatedFields.data),
      credentials: "include",
    })
  }catch(error) {
    return {
      message: "Something went wrong. Please try again.",
    };
  }
  if(response.ok) {
    redirect('/')
  }
}