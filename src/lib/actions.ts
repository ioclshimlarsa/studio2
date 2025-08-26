"use server";

import { generateCampNotification } from "@/ai/flows/camp-notification-generator";
import { revalidatePath } from "next/cache";
import type { CampFormData, StudentRegistrationData } from "./types";


export async function saveCampAction(data: CampFormData) {
  try {
    // In a real app, this would save the data to your database
    console.log("Saving camp:", data);
    const districts = data.district.join(', ');

    const notificationResult = await generateCampNotification({
      schoolName: `Schools in ${districts}`,
      schoolDistrict: districts,
      campName: data.name,
      campDistrict: districts,
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
    if (error instanceof Error) {
        return { success: false, message: error.message };
    }
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
