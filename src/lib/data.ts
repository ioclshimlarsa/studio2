import { adminDb } from './firebase';
import { collection, getDocs, query, where, doc, getDoc, Timestamp } from 'firebase/firestore';
import type { Camp, Registration, SchoolUser } from './types';

// Firestore data converters
const firestoreToCamp = (doc: any): Camp => {
    const data = doc.data();
    const camp: Camp = {
        id: doc.id,
        name: data.name,
        description: data.description,
        location: data.location,
        district: data.district,
        eligibilityCriteria: data.eligibilityCriteria,
        contactPerson: data.contactPerson,
        contactNumber: data.contactNumber,
        contactEmail: data.contactEmail,
        startDate: (data.startDate as Timestamp).toDate().toISOString(),
        endDate: (data.endDate as Timestamp).toDate().toISOString(),
        maxParticipants: data.maxParticipants,
        status: 'Upcoming' // This will be calculated
    };
    const now = new Date();
    const startDate = new Date(camp.startDate);
    const endDate = new Date(camp.endDate);

    if (now < startDate) {
      camp.status = 'Upcoming';
    } else if (now >= startDate && now <= endDate) {
      camp.status = 'Ongoing';
    } else {
      camp.status = 'Past';
    }
    return camp;
};

const firestoreToRegistration = (doc: any): Registration => {
    const data = doc.data();
    return {
        id: doc.id,
        campId: data.campId,
        schoolId: data.schoolId,
        schoolName: data.schoolName,
        students: data.students.map((s: any) => ({
            ...s,
            dob: (s.dob as Timestamp).toDate().toISOString()
        }))
    };
};

const firestoreToSchoolUser = (doc: any): SchoolUser => {
    const data = doc.data();
    return {
        id: doc.id,
        schoolName: data.schoolName,
        location: data.location,
        district: data.district,
        principalName: data.principalName,
        trainerName: data.trainerName,
        trainerContact: data.trainerContact,
        schoolEmail: data.schoolEmail,
        status: data.status,
        createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
    };
};


export const punjabDistricts = [
  "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib",
  "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar",
  "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga",
  "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar (Mohali)",
  "Sangrur", "Shaheed Bhagat Singh Nagar", "Sri Muktsar Sahib", "Tarn Taran"
];

// Fetch all camps
export async function getCamps(): Promise<Camp[]> {
  try {
    const campsCol = collection(adminDb, 'camps');
    const campSnapshot = await getDocs(campsCol);
    const camps = campSnapshot.docs.map(doc => firestoreToCamp(doc));
    return camps.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  } catch (error) {
    console.error("Error fetching camps: ", error);
    return [];
  }
}

// Fetch registrations for a specific camp
export async function getRegistrationsForCamp(campId: string): Promise<Registration[]> {
  try {
    const q = query(collection(adminDb, "registrations"), where("campId", "==", campId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => firestoreToRegistration(doc));
  } catch (error) {
    console.error("Error fetching registrations for camp: ", error);
    return [];
  }
}

// Fetch all registrations
export async function getRegistrations(): Promise<Registration[]> {
  try {
    const registrationsCol = collection(adminDb, 'registrations');
    const registrationSnapshot = await getDocs(registrationsCol);
    return registrationSnapshot.docs.map(doc => firestoreToRegistration(doc));
  } catch (error) {
    console.error("Error fetching all registrations: ", error);
    return [];
  }
}

// Fetch all school users
export async function getSchoolUsers(): Promise<SchoolUser[]> {
  try {
    const usersCol = collection(adminDb, 'schoolUsers');
    const userSnapshot = await getDocs(usersCol);
    const users = userSnapshot.docs.map(doc => firestoreToSchoolUser(doc));
    return users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Error fetching school users: ", error);
    return [];
  }
}

export async function getSchoolUser(id: string): Promise<SchoolUser | null> {
    try {
        const docRef = doc(adminDb, 'schoolUsers', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return firestoreToSchoolUser(docSnap);
        }
        return null;
    } catch (error) {
        console.error("Error fetching school user:", error);
        return null;
    }
}

    