'use server';

import { generateCampNotification } from "@/ai/flows/camp-notification-generator";
import { revalidatePath } from "next/cache";
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, writeBatch, Timestamp, getDoc } from 'firebase/firestore';

import type { Camp, CampFormData, Registration, SchoolUser, SchoolUserFormData, SchoolUserStatus, StudentRegistrationData } from "./types";
import { getSchoolUsers } from "./data";

export async function loginAction(email: string): Promise<{ success: boolean; message: string }> {
    try {
        const schoolUsers = await getSchoolUsers();
        const userExists = schoolUsers.some(user => user.schoolEmail.toLowerCase() === email.toLowerCase());
        
        if (userExists) {
            // In a real app with Firebase Auth, you would use signInWithEmailAndPassword here.
            // For this prototype, we're just checking if the user email exists in our Firestore collection.
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
    const campData = campSnap.data();
    const camp = {
        ...campData,
        id: campSnap.id,
        startDate: (campData.startDate as Timestamp).toDate(),
        endDate: (campData.endDate as Timestamp).toDate()
    } as Camp;
    
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
    // For this prototype, we'll find a known school user.
    const schoolUsers = await getSchoolUsers();
    const schoolUser = schoolUsers.find(u => u.schoolName === 'Sacred Heart Convent School');
    
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
    const { password, confirmPassword, ...userData } = data;

    const newUser: Omit<SchoolUser, 'id'> = {
      ...userData,
      status: 'Active',
      createdAt: new Date(),
    };
    
    const docRef = await addDoc(collection(db, "schoolUsers"), {
        ...newUser,
        createdAt: Timestamp.fromDate(newUser.createdAt)
    });
    
    revalidatePath("/admin");

    const message = `School user "${data.schoolName}" created successfully! They can now log in with the email ${data.schoolEmail} and the password you provided.`;
    return { success: true, message, newUser: { ...newUser, id: docRef.id } };

  } catch (error) {
    console.error("Error saving school user:", error);
    return { success: false, message: "An error occurred while creating the school user." };
  }
}

export async function bulkAddSchoolUsersAction(
  usersData: SchoolUserFormData[]
): Promise<{ success: boolean; message: string; newUsers?: SchoolUser[] }> {
  try {
    const batch = writeBatch(db);
    const newUsers: SchoolUser[] = [];

    for (const data of usersData) {
      const { password, confirmPassword, ...userData } = data;
      const newUser: Omit<SchoolUser, 'id'> = {
        status: 'Active',
        createdAt: new Date(),
        ...userData,
      };
      const docRef = doc(collection(db, 'schoolUsers'));
      batch.set(docRef, {
        ...newUser,
        createdAt: Timestamp.fromDate(newUser.createdAt),
      });
      newUsers.push({ ...newUser, id: docRef.id });
    }

    await batch.commit();

    console.log(`${newUsers.length} new schools were added via bulk upload.`);
    
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
        const userRef = doc(db, "schoolUsers", userId);
        await updateDoc(userRef, { status: status });
        // In a real app with Firebase Auth, you might disable the user account here.
        // e.g., admin.auth().updateUser(authUid, { disabled: status !== 'Active' });
        revalidatePath("/admin");
        return { success: true, message: `User status updated to ${status}.` };
    } catch (error) {
        console.error("Error updating user status:", error);
        return { success: false, message: "Failed to update user status." };
    }
}

export async function resetSchoolUserPasswordAction(userId: string, newPassword?: string) {
    try {
        // In a real app with Firebase Auth, you would use the Firebase Admin SDK to update the user's password
        // or send a password reset email.
        // e.g., admin.auth().updateUser(authUid, { password: newPassword });
        // e.g., admin.auth().generatePasswordResetLink(email);
        console.log(`Password reset requested for user ${userId}. New password would be: ${newPassword}`);
        revalidatePath("/admin");
        return { success: true, message: "A password reset has been simulated successfully." };
    } catch (error) {
        return { success: false, message: "Failed to reset password." };
    }
}

export async function deleteSchoolUserAction(userId: string) {
    try {
        await deleteDoc(doc(db, "schoolUsers", userId));
         // In a real app with Firebase Auth, you would also delete the user from the Auth service.
        // e.g., admin.auth().deleteUser(authUid);
        revalidatePath("/admin");
        return { success: true, message: "User has been deleted successfully." };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, message: "Failed to delete user." };
    }
}
