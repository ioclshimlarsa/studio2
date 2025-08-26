"use server";

import { z } from "zod";
import { generateCampNotification } from "@/ai/flows/camp-notification-generator";
import { revalidatePath } from "next/cache";

export const CampSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Camp name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  district: z.string().min(2, { message: "District is required." }),
  eligibilityCriteria: z.string().min(10, { message: "Eligibility is required." }),
  contactEmail: z.string().email({ message: "Invalid email address." }),
  startDate: z.date({ required_error: "Start date is required."}),
  endDate: z.date({ required_error: "End date is required."}),
}).refine(data => data.endDate > data.startDate, {
    message: "End date must be after start date.",
    path: ["endDate"],
});

export type CampFormData = z.infer<typeof CampSchema>;


export async function saveCampAction(data: CampFormData) {
  try {
    // In a real app, this would save the data to your database
    console.log("Saving camp:", data);

    const notificationResult = await generateCampNotification({
      schoolName: `Schools in ${data.district}`,
      schoolDistrict: data.district,
      campName: data.name,
      campDistrict: data.district,
      campDescription: data.description,
      eligibilityCriteria: data.eligibilityCriteria,
      contactEmail: data.contactEmail,
    });
    
    revalidatePath("/admin");

    return { 
      success: true,
      message: `Camp "${data.name}" saved successfully!`,
      notification: notificationResult.notificationEmail
    };

  } catch (error) {
    console.error("Error saving camp:", error);
    return { success: false, message: "An error occurred while saving the camp." };
  }
}

export async function deleteCampAction(campId: string) {
    try {
        // In a real app, this would delete from a database
        console.log("Deleting camp with ID:", campId);
        revalidatePath("/admin");
        return { success: true, message: "Camp deleted successfully." };
    } catch (error) {
        return { success: false, message: "Failed to delete camp." };
    }
}

export const StudentRegistrationSchema = z.object({
  campId: z.string(),
  studentNames: z.string().min(1, { message: "Please enter at least one student name." }),
});

export type StudentRegistrationData = z.infer<typeof StudentRegistrationSchema>;

export async function registerStudentsAction(data: StudentRegistrationData) {
  try {
    // In a real app, this would save to a database
    console.log("Registering students:", data);
    revalidatePath("/school");
    return { success: true, message: "Students registered successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to register students." };
  }
}
