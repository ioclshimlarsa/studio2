import { z } from "zod";

export const CampSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Camp name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  district: z.string().min(2, { message: "District is required." }),
  eligibilityCriteria: z.string().min(10, { message: "Eligibility is required." }),
  contactEmail: z.string().email({ message: "Invalid email address." }),
  startDate: z.date({ required_error: "Start date is required."}),
  endDate: z.date({ required_error: "End date is required."}),
}).refine(data => data.endDate > data.startDate, {
    message: "End date must be after start date.",
    path: ["endDate"],
});

export type CampFormData = z.infer<typeof CampSchema>;

export const StudentRegistrationSchema = z.object({
  campId: z.string(),
  studentNames: z.string().min(1, { message: "Please enter at least one student name." }),
});

export type StudentRegistrationData = z.infer<typeof StudentRegistrationSchema>;


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
