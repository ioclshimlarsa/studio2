import type { Camp, Registration } from './types';

const today = new Date();
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Mock data for camps
export const mockCamps: Camp[] = [
  {
    id: '1',
    name: 'Summer Scout Adventure',
    description: 'A week-long camp focusing on outdoor skills, leadership, and teamwork.',
    location: 'Scout Complex, Amritsar',
    district: 'Amritsar',
    eligibilityCriteria: 'Students aged 12-15 from any school in the Amritsar district.',
    contactPerson: 'Mr. Avtar Singh',
    contactNumber: '9876543210',
    contactEmail: 'adventure@punjabscouts.org',
    startDate: addDays(today, 10),
    endDate: addDays(today, 17),
    status: 'Upcoming',
  },
  {
    id: '2',
    name: 'Digital Literacy Workshop',
    description: 'A 3-day workshop to teach students the basics of computer science and online safety.',
    location: 'Ludhiana Public School',
    district: 'Ludhiana',
    eligibilityCriteria: 'Open to all high school students in Ludhiana.',
    contactPerson: 'Ms. Geeta Sharma',
    contactNumber: '9876543211',
    contactEmail: 'digital@punjabedu.org',
    startDate: addDays(today, -1),
    endDate: addDays(today, 2),
    status: 'Ongoing',
  },
  {
    id: '3',
    name: 'Youth Leadership Summit',
    description: 'A weekend summit for aspiring student leaders to network and learn from experts.',
    location: 'Jalandhar Convention Center',
    district: 'Jalandhar, Kapurthala',
    eligibilityCriteria: 'Nominated student council members from Jalandhar and Kapurthala district schools.',
    contactPerson: 'Mr. Raj Kumar',
    contactNumber: '9876543212',
    contactEmail: 'leaders@punjabconnect.org',
    startDate: addDays(today, 30),
    endDate: addDays(today, 32),
    status: 'Upcoming',
  },
  {
    id: '4',
    name: 'Winter Sports Camp',
    description: 'Experience the thrill of winter sports and learn new skills.',
    location: 'Pathankot Sports Complex',
    district: 'Pathankot',
    eligibilityCriteria: 'Students aged 14-18 with an interest in sports.',
    contactPerson: 'Mr. Vikram Batra',
    contactNumber: '9876543213',
    contactEmail: 'sports@punjabconnect.org',
    startDate: addDays(today, -40),
    endDate: addDays(today, -33),
    status: 'Past',
  },
    {
    id: '5',
    name: 'Heritage and Culture Tour',
    description: 'Explore the rich cultural heritage of Punjab through visits to historical sites.',
    location: 'Sheesh Mahal, Patiala',
    district: 'Patiala',
    eligibilityCriteria: 'All students from Patiala are welcome.',
    contactPerson: 'Ms. Simran Kaur',
    contactNumber: '9876543214',
    contactEmail: 'culture@punjabconnect.org',
    startDate: addDays(today, -90),
    endDate: addDays(today, -85),
    status: 'Past',
  },
];

// Mock data for registrations
export const mockRegistrations: Registration[] = [
    {
        campId: '4',
        schoolId: 'school-1',
        students: [
            { name: 'Rohan Sharma' },
            { name: 'Priya Verma' },
        ]
    },
    {
        campId: '5',
        schoolId: 'school-2',
        students: [
            { name: 'Aarav Singh' },
        ]
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
