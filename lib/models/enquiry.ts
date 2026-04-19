import { Schema, model, models } from "mongoose";

// ── Types ─────────────────────────────────────────────────────────────────────

interface IEnquiry {
  // Step 1 — Identity
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  role: "Founder / Co-founder" | "Developer" | "Product Manager" | "Designer" | "Student" | "Other";

  // Step 2 — Project
  projectTitle: string;
  projectDescription: string;
  problemStatement: string;
  projectType: "Web App" | "Mobile App" | "Desktop App" | "SaaS Platform" | "UI/UX Design" | "API / Backend";
  platforms: string[];
  techStack?: string;
  referenceLinks?: string;

  // Step 3 — Scope
  budget: "₹5k – ₹10k" | "₹10k – ₹50k" | "₹50k – ₹1L" | "₹1L+" | "To be discussed";
  timeline: "Urgent (1–2 weeks)" | "1 month" | "2–3 months" | "Flexible";
  projectStage: "Idea only" | "Wireframes ready" | "Design ready" | "Already started";
  featuresNeeded?: string[];
  maintenanceRequired?: "Yes" | "No" | "Maybe / Discuss";

  // Step 4 — Schedule
  preferredDate: Date;
  preferredTime: string;
  timezone?: string;
  meetingType: "Google Meet" | "Zoom" | "Phone Call";
  callAgenda?: string;
  extraNotes?: string;

  // Meta
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

// ── Schema ────────────────────────────────────────────────────────────────────

const enquirySchema = new Schema<IEnquiry>(
  {
    // Step 1 — Identity
    fullName:  { type: String, required: true,  trim: true },
    email:     { type: String, required: true,  trim: true, lowercase: true },
    phone:     { type: String, required: false, trim: true },
    company:   { type: String, required: false, trim: true },
    role: {
      type: String,
      required: true,
      enum: ["Founder / Co-founder", "Developer", "Product Manager", "Designer", "Student", "Other"],
    },

    // Step 2 — Project
    projectTitle:       { type: String, required: true,  trim: true },
    projectDescription: { type: String, required: true,  trim: true },
    problemStatement:   { type: String, required: true,  trim: true },
    projectType: {
      type: String,
      required: true,
      enum: ["Web App", "Mobile App", "Desktop App", "SaaS Platform", "UI/UX Design", "API / Backend"],
    },
    platforms:      { type: [String], required: true,  default: [] },
    techStack:      { type: String,   required: false, trim: true },
    referenceLinks: { type: String,   required: false, trim: true },

    // Step 3 — Scope
    budget: {
      type: String,
      required: true,
      enum: ["₹5k – ₹10k", "₹10k – ₹50k", "₹50k – ₹1L", "₹1L+", "To be discussed"],
    },
    timeline: {
      type: String,
      required: true,
      enum: ["Urgent (1–2 weeks)", "1 month", "2–3 months", "Flexible"],
    },
    projectStage: {
      type: String,
      required: true,
      enum: ["Idea only", "Wireframes ready", "Design ready", "Already started"],
    },
    featuresNeeded:      { type: [String], required: false, default: [] },
    maintenanceRequired: {
      type: String,
      required: false,
      enum: ["Yes", "No", "Maybe / Discuss"],
    },

    // Step 4 — Schedule
    preferredDate: { type: Date,   required: true },
    preferredTime: { type: String, required: true,  trim: true },
    timezone:      { type: String, required: false, trim: true },
    meetingType: {
      type: String,
      required: true,
      enum: ["Google Meet", "Zoom", "Phone Call"],
    },
    callAgenda:  { type: String, required: false, trim: true },
    extraNotes:  { type: String, required: false, trim: true },

    // Meta
    status: {
      type: String,
      required: true,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// ── Model ─────────────────────────────────────────────────────────────────────

const Enquiry = models.Enquiry || model<IEnquiry>("Enquiry", enquirySchema);
export default Enquiry;