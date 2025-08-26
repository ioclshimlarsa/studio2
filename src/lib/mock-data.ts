import type { Camp, Registration, SchoolUser } from './types';

const today = new Date();
const getFutureDate = (days: number) => new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
const getPastDate = (days: number) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

export const mockCamps: Camp[] = [
  {
    id: 'camp-1',
    name: 'Summer Scout Adventure',
    description: 'A week-long adventure camp focusing on survival skills, teamwork, and leadership. Activities include hiking, orienteering, and campfire cooking.',
    location: 'Forest Hills, Pathankot',
    district: ['Pathankot', 'Gurdaspur'],
    eligibilityCriteria: 'Scouts aged 12-16. Basic swimming ability required.',
    contactPerson: 'Rohan Sharma',
    contactNumber: '9876543210',
    contactEmail: 'rohan.sharma@example.com',
    startDate: getFutureDate(30),
    endDate: getFutureDate(37),
    status: 'Upcoming',
    maxParticipants: 60,
  },
  {
    id: 'camp-2',
    name: 'Digital Literacy Workshop',
    description: 'A 3-day workshop on digital citizenship, online safety, and basic coding for guides. Participants will earn a digital literacy badge.',
    location: 'Tech Park, Mohali',
    district: ['Sahibzada Ajit Singh Nagar (Mohali)'],
    eligibilityCriteria: 'Guides aged 14-17. No prior coding experience needed.',
    contactPerson: 'Priya Mehta',
    contactNumber: '8765432109',
    contactEmail: 'priya.mehta@example.com',
    startDate: getFutureDate(60),
    endDate: getFutureDate(62),
    status: 'Upcoming',
    maxParticipants: 40,
  },
  {
    id: 'camp-3',
    name: 'Monsoon Trekking Expedition',
    description: 'An exciting and challenging trekking expedition in the Shivalik foothills during the monsoon season. Focus on flora, fauna, and conservation.',
    location: 'Shivalik Hills, Hoshiarpur',
    district: ['Hoshiarpur', 'Rupnagar'],
    eligibilityCriteria: 'Experienced scouts and guides aged 15+. Must have completed at least two prior camps.',
    contactPerson: 'Vikram Singh',
    contactNumber: '7654321098',
    contactEmail: 'vikram.singh@example.com',
    startDate: getPastDate(5),
    endDate: getFutureDate(2),
    status: 'Ongoing',
    maxParticipants: 25,
  },
  {
    id: 'camp-4',
    name: 'Heritage and Culture Camp',
    description: 'Explore the rich heritage of Punjab with visits to historical sites, traditional craft workshops, and cultural performances.',
    location: 'Cultural Center, Amritsar',
    district: ['Amritsar', 'Tarn Taran'],
    eligibilityCriteria: 'Open to all registered scouts and guides.',
    contactPerson: 'Simran Kaur',
    contactNumber: '6543210987',
    contactEmail: 'simran.kaur@example.com',
    startDate: getPastDate(45),
    endDate: getPastDate(42),
    status: 'Past',
    maxParticipants: 100,
  },
];

export const mockSchoolUsers: SchoolUser[] = [
  {
    id: 'school-1',
    schoolName: 'Sacred Heart Convent School',
    location: 'Sarabha Nagar, Ludhiana',
    district: 'Ludhiana',
    principalName: 'Mrs. Nirmala Reddy',
    trainerName: 'Mr. Rajesh Kumar',
    trainerContact: '9988776655',
    schoolEmail: 'contact@sacredheartludhiana.com',
    status: 'Active',
    createdAt: getPastDate(30),
  },
  {
    id: 'school-2',
    schoolName: 'Apeejay School',
    location: 'Mahavir Marg, Jalandhar',
    district: 'Jalandhar',
    principalName: 'Mr. Girish Kumar',
    trainerName: 'Ms. Sunita Sharma',
    trainerContact: '9876554321',
    schoolEmail: 'principal.jalandhar@apeejay.edu',
    status: 'Active',
    createdAt: getPastDate(60),
  },
  {
    id: 'school-3',
    schoolName: 'Yadavindra Public School',
    location: 'Sector 51, Mohali',
    district: 'Sahibzada Ajit Singh Nagar (Mohali)',
    principalName: 'Mr. Harish Dhillon',
    trainerName: 'Mr. Manpreet Singh',
    trainerContact: '8877665544',
    schoolEmail: 'info@ypsmohali.in',
    status: 'Inactive',
    createdAt: getPastDate(90),
  },
  {
    id: 'school-4',
    schoolName: 'Delhi Public School',
    location: 'Airport Road, Amritsar',
    district: 'Amritsar',
    principalName: 'Ms. Anjali Verma',
    trainerName: 'Ms. Pooja Gupta',
    trainerContact: '7766554433',
    schoolEmail: 'info@dpsamritsar.com',
    status: 'Blocked',
    createdAt: getPastDate(120),
  },
];


export const mockRegistrations: Registration[] = [
    {
        id: 'reg-1',
        campId: 'camp-3', // Ongoing Camp
        schoolId: 'school-1',
        schoolName: 'Sacred Heart Convent School',
        students: [
            { name: 'Amit Kumar', fatherName: 'Suresh Kumar', dob: new Date('2008-05-10') },
            { name: 'Sunita Sharma', fatherName: 'Rajesh Sharma', dob: new Date('2008-09-15') },
        ]
    },
    {
        id: 'reg-2',
        campId: 'camp-4', // Past Camp
        schoolId: 'school-2',
        schoolName: 'Apeejay School',
        students: [
            { name: 'Deepak Singh', fatherName: 'Manjeet Singh', dob: new Date('2007-02-20') },
            { name: 'Anjali Gupta', fatherName: 'Anil Gupta', dob: new Date('2007-11-30') },
            { name: 'Ravi Verma', fatherName: 'Rakesh Verma', dob: new Date('2007-07-07') },
        ]
    },
     {
        id: 'reg-3',
        campId: 'camp-4', // Past Camp
        schoolId: 'school-1',
        schoolName: 'Sacred Heart Convent School',
        students: [
            { name: 'Priya Singh', fatherName: 'Harpreet Singh', dob: new Date('2007-01-25') },
        ]
    }
];
