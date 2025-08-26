import type { Camp, Registration, SchoolUser } from './types';

const today = new Date();
const getFutureDate = (days: number) => new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
const getPastDate = (days: number) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

export const mockCamps: Camp[] = [];

export const mockSchoolUsers: SchoolUser[] = [];

export const mockRegistrations: Registration[] = [];
