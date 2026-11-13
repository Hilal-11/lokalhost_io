import * as z from 'zod'
export const SignupFormSchema = z.object({
  username: z
    .string()
    .min(3, { error: 'Username must be at least 3 characters long.' })
    .trim(),
  email: z.string()
    .email({ message: 'Please enter a valid email.' })
    .trim(),
  password: z
    .string()
    .min(8, { error: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
    .regex(/[0-9]/, { error: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      error: 'Contain at least one special character.',
    })
    .trim(),
})

export const LoginFormSchema = z.object({
    email: z.string()
    .email({ message: 'Please enter a valid email.' })
    .trim(),
    password: z
    .string()
      .min(8, { error: 'Be at least 8 characters long' })
      .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
      .regex(/[0-9]/, { error: 'Contain at least one number.' })
      .regex(/[^a-zA-Z0-9]/, {
        error: 'Contain at least one special character.',
    })
    .trim(),
    
})

export const FeedbackSchema = z.object({
  feedback_title: z.string()
    .trim().nonempty({ message: "Feedback can't be empty"}),
  feedback_discription: z.string()
    .trim().nonempty({ message: "Feedback can't be empty."})
    .min(10, {message: "Feedback must be more than 10 charcters"})
})


