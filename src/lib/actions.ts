'use server';

import { generateCampNotification } from "@/ai/flows/camp-notification-generator";
import { revalidatePath } from "next/cache";
import { adminDb } from './firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, writeBatch, Timestamp, getDoc } from 'firebase/firestore';

import type { Camp, CampFormData, Registration, SchoolUser, SchoolUserFormData, SchoolUserStatus, StudentRegistrationData } from "./types";
import { firebaseConfig } from "./firebase";
import { initializeApp, getApps, getApp } from "firebase/app";

// Helper to get client-side DB instance. This ensures we don't pull server-only code to client.
const getClientDb = () => {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    return getApp();
}

export async function loginAction(email: string): Promise<{ success: boolean; message: string }> {
    try {
        const schoolUsersQuery = query(collection(adminDb, "schoolUsers"), where("schoolEmail", "==", email.toLowerCase()));
        const querySnapshot = await getDocs(schoolUsersQuery);

        if (!querySnapshot.empty) {
            return { success: true, message: "Login successful." };
        } else {
            return { success: false, message: "No school found with that email address. Please contact an administrator." };
        }
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "An error occurred during login." };
    }
}


export async function saveCampAction(data: CampFormData) {
  try {
    const campCollection = collection(adminDb, 'camps');
    
    const campDataForDb = {
        ...data,
        startDate: Timestamp.fromDate(new Date(data.startDate)),
        endDate: Timestamp.fromDate(new Date(data.endDate)),
    };
    if ('id' in campDataForDb) {
      delete (campDataForDb as { id?: string }).id;
    }


    if (data.id) {
        const campRef = doc(adminDb, 'camps', data.id);
        await updateDoc(campRef, campDataForDb);
    } else {
        await addDoc(campCollection, campDataForDb);
    }

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
    revalidatePath("/school");

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
        await deleteDoc(doc(adminDb, "camps", campId));
        revalidatePath("/admin");
        revalidatePath("/school");
        return { success: true, message: "Camp deleted successfully." };
    } catch (error) {
        console.error("Error deleting camp:", error);
        return { success: false, message: "Failed to delete camp." };
    }
}

export async function registerStudentsAction(data: StudentRegistrationData): Promise<{success: boolean, message: string, newRegistration?: Registration}> {
  try {
    const campRef = doc(adminDb, "camps", data.campId);
    const campSnap = await getDoc(campRef);

    if (!campSnap.exists()) {
        return { success: false, message: "Camp not found." };
    }
    const campData = campSnap.data()!;
    const camp = {
        ...campData,
        id: campSnap.id,
        startDate: (campData.startDate as Timestamp).toDate(),
        endDate: (campData.endDate as Timestamp).toDate()
    } as Camp;
    
    const now = new Date();
    if (now > new Date(camp.startDate)) {
      return { success: false, message: "Registration failed. This camp has already started or is over." };
    }

    const registrationsQuery = query(collection(adminDb, "registrations"), where("campId", "==", data.campId));
    const registrationsSnapshot = await getDocs(registrationsQuery);
    const currentParticipantCount = registrationsSnapshot.docs.reduce((sum, doc) => sum + doc.data().students.length, 0);

    const newParticipantCount = data.students.length;

    if (currentParticipantCount + newParticipantCount > camp.maxParticipants) {
        const availableSlots = camp.maxParticipants - currentParticipantCount;
        return { success: false, message: `Registration failed. Only ${availableSlots} slots remaining.` };
    }
    const schoolId = 'placeholder-school-id';
    const schoolName = "Govt. High School";
    
    const newRegistrationData = {
        campId: data.campId,
        schoolId: schoolId,
        schoolName: schoolName,
        students: data.students.map(s => ({
            ...s,
            dob: Timestamp.fromDate(new Date(s.dob))
        })),
    };
    
    const docRef = await addDoc(collection(adminDb, "registrations"), newRegistrationData);
    
    revalidatePath("/school");
    revalidatePath("/admin");
    
    const finalRegistration = {
        ...newRegistrationData,
        id: docRef.id,
        students: data.students.map(s => ({...s, dob: s.dob.toString()})),
    } as unknown as Registration
    
    return { success: true, message: "Students registered successfully!", newRegistration: finalRegistration };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to register students." };
  }
}

export async function saveSchoolUserAction(data: SchoolUserFormData): Promise<{ success: boolean; message: string; newUser?: SchoolUser; }> {
  try {
    const { password, confirmPassword, ...userData } = data;

    const newUserToSave = {
      ...userData,
      status: 'Active' as SchoolUserStatus,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(adminDb, "schoolUsers"), newUserToSave);
    
    revalidatePath("/admin");

    const savedUser: SchoolUser = {
      id: docRef.id,
      ...newUserToSave,
      createdAt: newUserToSave.createdAt.toDate().toISOString(),
    };

    const message = `School user "${savedUser.schoolName}" created successfully! They can now log in with the email ${savedUser.schoolEmail}.`;
    return { success: true, message, newUser: savedUser };

  } catch (error) {
    console.error("Error saving school user:", error);
    if (error instanceof Error) {
        return { success: false, message: error.message };
    }
    return { success: false, message: "An error occurred while creating the school user." };
  }
}

export async function bulkAddSchoolUsersAction(
  usersData: SchoolUserFormData[]
): Promise<{ success: boolean; message: string; newUsers?: SchoolUser[] }> {
  try {
    const batch = writeBatch(adminDb);
    const newUsers: SchoolUser[] = [];

    for (const data of usersData) {
      const { password, confirmPassword, ...userData } = data;
      const newUserForDb = {
        ...userData,
        status: 'Active' as SchoolUserStatus,
        createdAt: Timestamp.now(),
      };
      
      const docRef = doc(collection(adminDb, 'schoolUsers'));
      batch.set(docRef, newUserForDb);
      newUsers.push({ 
          ...newUserForDb, 
          id: docRef.id,
          createdAt: newUserForDb.createdAt.toDate().toISOString()
      });
    }

    await batch.commit();
    
    revalidatePath("/admin");
    return { 
      success: true, 
      message: `Successfully added and activated ${newUsers.length} new school users. Passwords must be set for them in the Firebase Console.`,
      newUsers
    };
  } catch (error) {
    console.error("Error during bulk school user creation:", error);
    return { success: false, message: "An error occurred during the bulk upload process." };
  }
}

export async function updateSchoolUserStatusAction(userId: string, status: SchoolUserStatus) {
    try {
        const userRef = doc(adminDb, "schoolUsers", userId);
        await updateDoc(userRef, { status: status });
        revalidatePath("/admin");
        return { success: true, message: `User status updated to ${status}.` };
    } catch (error) {
        console.error("Error updating user status:", error);
        return { success: false, message: "Failed to update user status." };
    }
}

export async function resetSchoolUserPasswordAction(userId: string, newPassword?: string) {
    try {
        console.log(`Password reset requested for user ${userId}. New password would be: ${newPassword}`);
        revalidatePath("/admin");
        return { success: true, message: "A password reset has been simulated successfully." };
    } catch (error) {
        return { success: false, message: "Failed to reset password." };
    }
}

export async function deleteSchoolUserAction(userId: string) {
    try {
        await deleteDoc(doc(adminDb, "schoolUsers", userId));
        revalidatePath("/admin");
        return { success: true, message: "User has been deleted successfully." };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, message: "Failed to delete user." };
    }
}

    