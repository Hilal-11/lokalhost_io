import { z } from "zod";

export const stepOneSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  role: z.enum(["Founder / Co-founder", "Developer", "Product Manager", "Designer", "Student", "Other"], {
    required_error: "Please select your role",
  }),
});

export const stepTwoSchema = z.object({
  projectTitle: z.string().min(3, "Project title must be at least 3 characters"),
  projectDescription: z.string().min(20, "Description must be at least 20 characters"),
  problemStatement: z.string().min(10, "Problem statement is required"),
  projectType: z.enum(["Web App", "Mobile App", "Desktop App", "SaaS Platform", "UI/UX Design", "API / Backend"], {
    required_error: "Select a project type",
  }),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  techStack: z.string().optional(),
  referenceLinks: z.string().optional(),
});

export const stepThreeSchema = z.object({
  budget: z.enum(["₹5k – ₹10k", "₹10k – ₹50k", "₹50k – ₹1L", "₹1L+", "To be discussed"], {
    required_error: "Select a budget range",
  }),
  timeline: z.enum(["Urgent (1–2 weeks)", "1 month", "2–3 months", "Flexible"], {
    required_error: "Select a timeline",
  }),
  projectStage: z.enum(["Idea only", "Wireframes ready", "Design ready", "Already started"], {
    required_error: "Select a project stage",
  }),
  featuresNeeded: z.array(z.string()).optional(),
  maintenanceRequired: z.enum(["Yes", "No", "Maybe / Discuss"]).optional(),
});

export const stepFourSchema = z.object({
  preferredDate: z.date({ required_error: "Please select a date" }),
  preferredTime: z.string().min(1, "Please select a time"),
  timezone: z.string().optional(),
  meetingType: z.enum(["Google Meet", "Zoom", "Phone Call"], {
    required_error: "Select a meeting type",
  }),
  callAgenda: z.string().optional(),
  extraNotes: z.string().optional(),
});

export const fullFormSchema = stepOneSchema
  .merge(stepTwoSchema)
  .merge(stepThreeSchema)
  .merge(stepFourSchema);

export type StepOneData = z.infer<typeof stepOneSchema>;
export type StepTwoData = z.infer<typeof stepTwoSchema>;
export type StepThreeData = z.infer<typeof stepThreeSchema>;
export type StepFourData = z.infer<typeof stepFourSchema>;
export type FullFormData = z.infer<typeof fullFormSchema>;