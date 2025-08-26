import type { Camp, Registration, SchoolUser } from './types';

const today = new Date();
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const punjabDistricts = [
  "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", 
  "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", 
  "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga", 
  "Sri Muktsar Sahib", "Pathankot", "Patiala", "Rupnagar", 
  "Sahibzada Ajit Singh Nagar (Mohali)", "Sangrur", "Shaheed Bhagat Singh Nagar", "Tarn Taran"
];

// Mock data for camps
export const mockCamps: Camp[] = [
  {
    id: '1',
    name: 'Summer Scout Adventure',
    description: 'A week-long camp focusing on outdoor skills, leadership, and teamwork.',
    location: 'Scout Complex, Amritsar',
    district: ['Amritsar'],
    eligibilityCriteria: 'Students aged 12-15 from any school in the Amritsar district.',
    contactPerson: 'Mr. Avtar Singh',
    contactNumber: '9876543210',
    contactEmail: 'adventure@punjabscouts.org',
    startDate: addDays(today, 10),
    endDate: addDays(today, 17),
    status: 'Upcoming',
    maxParticipants: 50,
  },
  {
    id: '2',
    name: 'Digital Literacy Workshop',
    description: 'A 3-day workshop to teach students the basics of computer science and online safety.',
    location: 'Ludhiana Public School',
    district: ['Ludhiana'],
    eligibilityCriteria: 'Open to all high school students in Ludhiana.',
    contactPerson: 'Ms. Geeta Sharma',
    contactNumber: '9876543211',
    contactEmail: 'digital@punjabedu.org',
    startDate: addDays(today, -1),
    endDate: addDays(today, 2),
    status: 'Ongoing',
    maxParticipants: 30,
  },
  {
    id: '3',
    name: 'Youth Leadership Summit',
    description: 'A weekend summit for aspiring student leaders to network and learn from experts.',
    location: 'Jalandhar Convention Center',
    district: ['Jalandhar', 'Kapurthala'],
    eligibilityCriteria: 'Nominated student council members from Jalandhar and Kapurthala district schools.',
    contactPerson: 'Mr. Raj Kumar',
    contactNumber: '9876543212',
    contactEmail: 'leaders@punjabconnect.org',
    startDate: addDays(today, 30),
    endDate: addDays(today, 32),
    status: 'Upcoming',
    maxParticipants: 100,
  },
  {
    id: '4',
    name: 'Winter Sports Camp',
    description: 'Experience the thrill of winter sports and learn new skills.',
    location: 'Pathankot Sports Complex',
    district: ['Pathankot'],
    eligibilityCriteria: 'Students aged 14-18 with an interest in sports.',
    contactPerson: 'Mr. Vikram Batra',
    contactNumber: '9876543213',
    contactEmail: 'sports@punjabconnect.org',
    startDate: addDays(today, -40),
    endDate: addDays(today, -33),
    status: 'Past',
    maxParticipants: 40,
  },
    {
    id: '5',
    name: 'Heritage and Culture Tour',
    description: 'Explore the rich cultural heritage of Punjab through visits to historical sites.',
    location: 'Sheesh Mahal, Patiala',
    district: ['Patiala'],
    eligibilityCriteria: 'All students from Patiala are welcome.',
    contactPerson: 'Ms. Simran Kaur',
    contactNumber: '9876543214',
    contactEmail: 'culture@punjabconnect.org',
    startDate: addDays(today, -90),
    endDate: addDays(today, -85),
    status: 'Past',
    maxParticipants: 60,
  },
];

// Mock data for registrations
export const mockRegistrations: Registration[] = [
    {
        campId: '2',
        schoolId: 'school-1',
        schoolName: 'Govt. Model Senior Secondary School',
        students: Array.from({length: 28}, (_, i) => ({name: `Student ${i+1}`, fatherName: `Father ${i+1}`, dob: new Date(2008, i % 12, i + 1)}))
    },
    {
        campId: '4',
        schoolId: 'school-1',
        schoolName: 'Govt. Model Senior Secondary School',
        students: [
            { name: 'Rohan Sharma', fatherName: 'Anil Sharma', dob: new Date(2007, 5, 12) },
            { name: 'Priya Verma', fatherName: 'Sunil Verma', dob: new Date(2006, 8, 24) },
        ]
    },
    {
        campId: '5',
        schoolId: 'school-2',
        schoolName: 'Sacred Heart Convent School',
        students: [
            { name: 'Aarav Singh', fatherName: 'Balwinder Singh', dob: new Date(2009, 1, 3) },
        ]
    }
];

export const mockSchoolUsers: SchoolUser[] = [
  {
    id: 'school-1',
    schoolName: 'Govt. Model Senior Secondary School',
    location: 'Sector 16, Chandigarh',
    district: 'Sahibzada Ajit Singh Nagar (Mohali)',
    principalName: 'Mrs. Sunita Sharma',
    trainerName: 'Mr. Rajesh Kumar',
    trainerContact: '9812345678',
    schoolEmail: 'principal.gmsss16@example.com',
    status: 'Active',
    createdAt: addDays(today, -150),
  },
  {
    id: 'school-2',
    schoolName: 'Sacred Heart Convent School',
    location: 'Sarabha Nagar, Ludhiana',
    district: 'Ludhiana',
    principalName: 'Sr. Jessy',
    trainerName: 'Ms. Maria Gomes',
    trainerContact: '9876512345',
    schoolEmail: 'contact@shcsldh.com',
    status: 'Active',
    createdAt: addDays(today, -120),
  },
  {
    id: 'school-3',
    schoolName: 'Delhi Public School, Amritsar',
    location: 'Manawala, Amritsar',
    district: 'Amritsar',
    principalName: 'Mr. Vikram Singh',
    trainerName: 'Mr. Harpreet Singh',
    trainerContact: '9988776655',
    schoolEmail: 'info@dpsamritsar.com',
    status: 'Inactive',
    createdAt: addDays(today, -90),
  },
    {
    id: 'school-4',
    schoolName: 'Apeejay School, Jalandhar',
    location: 'Mahavir Marg, Jalandhar',
    district: 'Jalandhar',
    principalName: 'Mr. Girish Kumar',
    trainerName: 'Ms. Anjali Verma',
    trainerContact: '9123456789',
    schoolEmail: 'admissions.jalandhar@apeejay.edu',
    status: 'Blocked',
    createdAt: addDays(today, -60),
  }
];

// Simulate fetching all camps
export async function getCamps(): Promise<Camp[]> {
  const now = new Date();
  // In a real app, this would fetch from a database
  return mockCamps.map(camp => {
    let status: 'Upcoming' | 'Ongoing' | 'Past';
    if (now < camp.startDate) {
      status = 'Upcoming';
    } else if (now >= camp.startDate && now <= camp.endDate) {
      status = 'Ongoing';
    } else {
      status = 'Past';
    }
    return { ...camp, status };
  }).sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
}

// Simulate fetching registrations for a camp
export async function getRegistrationsForCamp(campId: string): Promise<Registration[]> {
    return mockRegistrations.filter(r => r.campId === campId);
}

// Simulate fetching all registrations
export async function getRegistrations(): Promise<Registration[]> {
  return mockRegistrations;
}

// Simulate fetching all school users
export async function getSchoolUsers(): Promise<SchoolUser[]> {
  // In a real app, this would fetch from a database
  return mockSchoolUsers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
