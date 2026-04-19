"use server";

import { fullFormSchema, type FullFormData } from "@/lib/Schema";
import Enquiry from "@/lib/models/enquiry";
import dbConnect from "@/lib/dbConnect";

export type SubmitResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function submitCustomWorkForm(
  data: FullFormData
): Promise<SubmitResult> {
  try {
    const parsed = fullFormSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Validation failed. Please check your inputs." };
    }

    await dbConnect();

    await Enquiry.create({
      ...parsed.data,
      status: "pending",
    });

    return {
      success: true,
      message: `Thanks ${parsed.data.fullName}! We'll confirm your call at ${parsed.data.email} within 2 hours.`,
    };
  } catch (err) {
    console.error("Submission error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}