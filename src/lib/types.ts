import { z } from "zod";

export const CampSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Camp name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  location: z.string().min(3, { message: "Location must be at least 3 characters." }),
  district: z.array(z.string()).nonempty({ message: "Please select at least one district." }),
  eligibilityCriteria: z.string().min(10, { message: "Eligibility is required." }),
  contactPerson: z.string().min(3, { message: "Contact person name is required." }),
  contactNumber: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit phone number." }),
  contactEmail: z.string().email({ message: "Invalid email address." }),
  startDate: z.date({ required_error: "Start date is required."}),
  endDate: z.date({ required_error: "End date is required."}),
  maxParticipants: z.coerce.number().int().positive({ message: "Maximum participants must be a positive number." }),
}).refine(data => data.endDate > data.startDate, {
    message: "End date must be after start date.",
    path: ["endDate"],
});

export type CampFormData = z.infer<typeof CampSchema>;

export const StudentSchema = z.object({
  name: z.string().min(3, "Student name is required."),
  fatherName: z.string().min(3, "Father's name is required."),
  dob: z.date({ required_error: "Date of birth is required." }),
});

export const StudentRegistrationSchema = z.object({
  campId: z.string(),
  students: z.array(StudentSchema).nonempty("Please add at least one student."),
});

export type StudentRegistrationData = z.infer<typeof StudentRegistrationSchema>;

export const SchoolUserSchema = z.object({
  id: z.string().optional(),
  schoolName: z.string().min(3, "School name is required."),
  location: z.string().min(3, "Location is required."),
  district: z.string().min(1, "District is required."),
  principalName: z.string().min(3, "Principal's name is required."),
  trainerName: z.string().min(3, "Trainer's name is required."),
  trainerContact: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit phone number." }),
  schoolEmail: z.string().email("Invalid email address."),
});

export type SchoolUserFormData = z.infer<typeof SchoolUserSchema>;

export interface Camp {
  id: string;
  name: string;
  description: string;
  location: string;
  district: string[];
  eligibilityCriteria: string;
  contactPerson: string;
  contactNumber: string;
  contactEmail: string;
  startDate: Date;
  endDate: Date;
  status: 'Upcoming' | 'Ongoing' | 'Past';
  maxParticipants: number;
}

export interface Student {
  name: string;
  fatherName: string;
  dob: Date;
}

export interface Registration {
  campId: string;
  schoolId: string;
  schoolName: string;
  students: Student[];
}

export type SchoolUserStatus = 'Active' | 'Inactive' | 'Blocked';

export interface SchoolUser {
  id: string;
  schoolName: string;
  location: string;
  district: string;
  principalName: string;
  trainerName: string;
  trainerContact: string;
  schoolEmail: string;
  status: SchoolUserStatus;
  createdAt: Date;
}
