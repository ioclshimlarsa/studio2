import { db } from './firebase';
import { collection, getDocs, query, where, doc, getDoc, Timestamp } from 'firebase/firestore';
import type { Camp, Registration, SchoolUser } from './types';

export const punjabDistricts = [
  "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", 
  "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", 
  "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga", 
  "Sri Muktsar Sahib", "Pathankot", "Patiala", "Rupnagar", 
  "Sahibzada Ajit Singh Nagar (Mohali)", "Sangrur", "Shaheed Bhagat Singh Nagar", "Tarn Taran"
];

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
        startDate: (data.startDate as Timestamp).toDate(),
        endDate: (data.endDate as Timestamp).toDate(),
        maxParticipants: data.maxParticipants,
        status: 'Upcoming' // This will be calculated
    };
    const now = new Date();
    if (now < camp.startDate) {
      camp.status = 'Upcoming';
    } else if (now >= camp.startDate && now <= camp.endDate) {
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
            dob: (s.dob as Timestamp).toDate()
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
        createdAt: (data.createdAt as Timestamp).toDate(),
    };
};


// Fetch all camps
export async function getCamps(): Promise<Camp[]> {
  try {
    const campsCol = collection(db, 'camps');
    const campSnapshot = await getDocs(campsCol);
    const camps = campSnapshot.docs.map(doc => firestoreToCamp(doc));
    return camps.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  } catch (error) {
    console.error("Error fetching camps: ", error);
    return [];
  }
}

// Fetch registrations for a specific camp
export async function getRegistrationsForCamp(campId: string): Promise<Registration[]> {
  try {
    const q = query(collection(db, "registrations"), where("campId", "==", campId));
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
    const registrationsCol = collection(db, 'registrations');
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
    const usersCol = collection(db, 'schoolUsers');
    const userSnapshot = await getDocs(usersCol);
    const users = userSnapshot.docs.map(doc => firestoreToSchoolUser(doc));
    return users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error("Error fetching school users: ", error);
    return [];
  }
}

export async function getSchoolUser(id: string): Promise<SchoolUser | null> {
    try {
        const docRef = doc(db, 'schoolUsers', id);
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
