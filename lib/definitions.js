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


export const validateCustomWorkData = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),

  email: z
    .string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),

  company: z
    .string()
    .min(1, 'Company name is required')
    .max(200, 'Company name must not exceed 200 characters')
    .trim(),

  phone: z
    .string()
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      'Please provide a valid phone number'
    )
    .trim(),

  serviceType: z
    .string()
    .min(1, 'Service type is required')
    .trim(),

  projectDescription: z
    .string()
    .min(50, 'Project description must be at least 50 characters')
    .max(5000, 'Project description must not exceed 5000 characters')
    .trim(),

  timeline: z.enum(
    ['asap', '1-month', '2-3-months', '3-6-months', 'flexible'],
    {
      errorMap: () => ({ message: 'Please select a valid timeline' })
    }
  ),

  referenceUrls: z
    .string()
    .optional()
    .default(''),

  additionalInfo: z
    .string()
    .max(2000, 'Additional information must not exceed 2000 characters')
    .trim()
    .optional()
    .default('')
});


