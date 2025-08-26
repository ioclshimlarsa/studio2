export interface Camp {
  id: string;
  name: string;
  description: string;
  district: string;
  eligibilityCriteria: string;
  contactEmail: string;
  startDate: Date;
  endDate: Date;
  status: 'Upcoming' | 'Ongoing' | 'Past';
}

export interface Student {
  id: string;
  name: string;
  schoolId: string;
}

export interface Registration {
  campId: string;
  schoolId: string;
  students: { name: string }[];
}
