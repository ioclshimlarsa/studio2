'use server';

import { generateCampNotification } from "@/ai/flows/camp-notification-generator";
import { revalidatePath } from "next/cache";
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, writeBatch, Timestamp, getDoc } from 'firebase/firestore';

import type { CampFormData, Registration, SchoolUser, SchoolUserFormData, SchoolUserStatus, StudentRegistrationData } from "./types";
import { SchoolUserSchema } from "./types";
import { getSchoolUser } from "./data";


export async function saveCampAction(data: CampFormData) {
  try {
    const campCollection = collection(db, 'camps');
    
    // Firestore conversion
    const campDataForDb = {
        ...data,
        startDate: Timestamp.fromDate(data.startDate),
        endDate: Timestamp.fromDate(data.endDate),
    };

    if (data.id) {
        // This is an update
        const campRef = doc(db, 'camps', data.id);
        await updateDoc(campRef, campDataForDb);
    } else {
        // This is a new document
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
        await deleteDoc(doc(db, "camps", campId));
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
    const campRef = doc(db, "camps", data.campId);
    const campSnap = await getDoc(campRef);

    if (!campSnap.exists()) {
        return { success: false, message: "Camp not found." };
    }
    const camp = { ...campSnap.data(), id: campSnap.id } as Camp;
    camp.startDate = (campSnap.data().startDate as Timestamp).toDate(); // convert timestamp
    camp.endDate = (campSnap.data().endDate as Timestamp).toDate(); // convert timestamp
    
    // Check if camp is still upcoming
    const now = new Date();
    if (now > camp.startDate) {
      return { success: false, message: "Registration failed. This camp has already started or is over." };
    }

    const registrationsQuery = query(collection(db, "registrations"), where("campId", "==", data.campId));
    const registrationsSnapshot = await getDocs(registrationsQuery);
    const currentParticipantCount = registrationsSnapshot.docs.reduce((sum, doc) => sum + doc.data().students.length, 0);

    const newParticipantCount = data.students.length;

    if (currentParticipantCount + newParticipantCount > camp.maxParticipants) {
        const availableSlots = camp.maxParticipants - currentParticipantCount;
        return { success: false, message: `Registration failed. Only ${availableSlots} slots remaining.` };
    }

    // In a real app, you'd get the school ID and name from the logged-in user session
    // For this prototype, we'll use a hardcoded school user.
    const schoolUser = await getSchoolUser('school-1'); // Assuming a default school user for now.
    
    if (!schoolUser) {
        return { success: false, message: "Could not identify the school. Please log in again." };
    }

    const newRegistrationData = {
        campId: data.campId,
        schoolId: schoolUser.id,
        schoolName: schoolUser.schoolName,
        students: data.students.map(s => ({
            ...s,
            dob: Timestamp.fromDate(s.dob) // Convert date to Firestore Timestamp
        })),
    };
    
    const docRef = await addDoc(collection(db, "registrations"), newRegistrationData);
    
    revalidatePath("/school");
    revalidatePath("/admin");
    
    const finalRegistration = {
        ...newRegistrationData,
        id: docRef.id,
        students: data.students, // return dates as Date objects
    }
    
    return { success: true, message: "Students registered successfully!", newRegistration: finalRegistration };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to register students." };
  }
}

export async function saveSchoolUserAction(data: SchoolUserFormData): Promise<{ success: boolean; message: string; newUser?: SchoolUser; }> {
  try {
    const newUser: Omit<SchoolUser, 'id'> = {
      status: 'Active',
      createdAt: new Date(),
      ...data
    };
    
    const docRef = await addDoc(collection(db, "schoolUsers"), {
        ...newUser,
        createdAt: Timestamp.fromDate(newUser.createdAt)
    });

    console.log(`A new school was added in ${data.district}. A notification should be sent.`);

    revalidatePath("/admin");
    return { success: true, message: `School user "${data.schoolName}" created successfully!`, newUser: { ...newUser, id: docRef.id } };
  } catch (error) {
    console.error("Error saving school user:", error);
    return { success: false, message: "An error occurred while creating the school user." };
  }
}

export async function bulkAddSchoolUsersAction(
  usersData: SchoolUserFormData[]
): Promise<{ success: boolean; message: string; newUsers?: SchoolUser[] }> {
  try {
    const validationPromises = usersData.map(user => SchoolUserSchema.safeParseAsync(user));
    const validationResults = await Promise.all(validationPromises);
    
    const validUsersData = validationResults.reduce((acc, result, index) => {
        if (result.success) {
            acc.push(result.data);
        } else {
            console.warn(`Invalid data at row ${index + 2}:`, result.error.flatten().fieldErrors);
        }
        return acc;
    }, [] as SchoolUserFormData[]);

    if (validUsersData.length === 0) {
      return { success: false, message: "No valid user data found in the CSV file." };
    }

    const batch = writeBatch(db);
    const newUsers: SchoolUser[] = [];

    validUsersData.forEach(data => {
        const newUser: Omit<SchoolUser, 'id'> = {
            status: 'Active',
            createdAt: new Date(),
            ...data
        };
        const docRef = doc(collection(db, "schoolUsers"));
        batch.set(docRef, {
            ...newUser,
            createdAt: Timestamp.fromDate(newUser.createdAt)
        });
        newUsers.push({ ...newUser, id: docRef.id });
    });

    await batch.commit();

    console.log(`${newUsers.length} new schools were added via bulk upload.`);
    
    revalidatePath("/admin");
    return { 
      success: true, 
      message: `Successfully added and activated ${newUsers.length} new school users.`,
      newUsers
    };
  } catch (error) {
    console.error("Error during bulk school user creation:", error);
    return { success: false, message: "An error occurred during the bulk upload process." };
  }
}

export async function updateSchoolUserStatusAction(userId: string, status: SchoolUserStatus) {
    try {
        const userRef = doc(db, "schoolUsers", userId);
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
        // In a real app, this would integrate with Firebase Auth
        console.log(`Resetting password for user ${userId} to ${newPassword}`);
        revalidatePath("/admin");
        return { success: true, message: "Password has been reset successfully." };
    } catch (error) {
        return { success: false, message: "Failed to reset password." };
    }
}

export async function deleteSchoolUserAction(userId: string) {
    try {
        await deleteDoc(doc(db, "schoolUsers", userId));
        revalidatePath("/admin");
        return { success: true, message: "User has been deleted successfully." };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, message: "Failed to delete user." };
    }
}
