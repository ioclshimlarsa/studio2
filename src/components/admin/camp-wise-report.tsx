"use client";

import React, { useState, useMemo } from 'react';
import type { Camp, Registration } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

type CampWiseReportProps = {
  camps: Camp[];
  registrations: Registration[];
};

export function CampWiseReport({ camps, registrations }: CampWiseReportProps) {
  const [selectedCampId, setSelectedCampId] = useState<string | null>(null);

  const sortedCamps = useMemo(() => {
    return [...camps].sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }, [camps]);

  const selectedCampRegistrations = useMemo(() => {
    if (!selectedCampId) return [];
    return registrations.filter(r => r.campId === selectedCampId);
  }, [selectedCampId, registrations]);

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <Select onValueChange={setSelectedCampId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a camp to view participants..." />
          </SelectTrigger>
          <SelectContent>
            {sortedCamps.map(camp => (
              <SelectItem key={camp.id} value={camp.id}>
                {camp.name} ({format(camp.startDate, 'PPP')})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCampId && (
        selectedCampRegistrations.length > 0 ? (
          <div className="border rounded-lg">
            {selectedCampRegistrations.map(reg => (
              <div key={reg.schoolId} className="p-4 border-b last:border-b-0">
                <h3 className="font-bold my-2 text-primary">{reg.schoolName}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Father's Name</TableHead>
                      <TableHead>Date of Birth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reg.students.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.fatherName}</TableCell>
                        <TableCell>{format(student.dob, 'PPP')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No participants are registered for the selected camp yet.
          </p>
        )
      )}
    </div>
  );
}
