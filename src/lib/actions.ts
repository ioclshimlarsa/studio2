'use server';

import { generateCampNotification } from "@/ai/flows/camp-notification-generator";
import { revalidatePath } from "next/cache";
import type { CampFormData, SchoolUser, SchoolUserFormData, SchoolUserStatus, StudentRegistrationData } from "./types";
import { mockSchoolUsers } from "./data";


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

export async function saveSchoolUserAction(data: SchoolUserFormData): Promise<{ success: boolean; message: string; newUser?: SchoolUser; }> {
  try {
    console.log("Saving school user:", data);

    const newUser: SchoolUser = {
      id: `school-${Math.random().toString(36).substr(2, 9)}`,
      status: 'Active',
      createdAt: new Date(),
      ...data
    };
    
    mockSchoolUsers.unshift(newUser);

    console.log(`A new school was added in ${data.district}. A notification should be sent.`);

    revalidatePath("/admin");
    return { success: true, message: `School user "${data.schoolName}" created successfully!`, newUser };
  } catch (error) {
    console.error("Error saving school user:", error);
    return { success: false, message: "An error occurred while creating the school user." };
  }
}

export async function updateSchoolUserStatusAction(userId: string, status: SchoolUserStatus) {
    try {
        console.log(`Updating user ${userId} status to ${status}`);
        const userIndex = mockSchoolUsers.findIndex(u => u.id === userId);
        if (userIndex > -1) {
            mockSchoolUsers[userIndex].status = status;
        }
        revalidatePath("/admin");
        return { success: true, message: `User status updated to ${status}.` };
    } catch (error) {
        return { success: false, message: "Failed to update user status." };
    }
}

export async function resetSchoolUserPasswordAction(userId: string, newPassword?: string) {
    try {
        console.log(`Resetting password for user ${userId} to ${newPassword}`);
        revalidatePath("/admin");
        return { success: true, message: "Password has been reset successfully." };
    } catch (error) {
        return { success: false, message: "Failed to reset password." };
    }
}

export async function deleteSchoolUserAction(userId: string) {
    try {
        console.log(`Deleting user ${userId}`);
        const userIndex = mockSchoolUsers.findIndex(u => u.id === userId);
        if (userIndex > -1) {
            mockSchoolUsers.splice(userIndex, 1);
        } else {
            return { success: false, message: "User not found." };
        }
        revalidatePath("/admin");
        return { success: true, message: "User has been deleted successfully." };
    } catch (error) {
        return { success: false, message: "Failed to delete user." };
    }
}
