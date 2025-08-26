
"use client";

import React, { useState, useMemo } from 'react';
import type { Camp, Registration } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';

type CampWiseReportProps = {
  camps: Camp[];
  registrations: Registration[];
};

export function CampWiseReport({ camps, registrations }: CampWiseReportProps) {
  const [selectedCampId, setSelectedCampId] = useState<string | null>(null);

  const sortedCamps = useMemo(() => {
    return [...camps].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [camps]);

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <Select onValueChange={setSelectedCampId} value={selectedCampId ?? undefined}>
          <SelectTrigger>
            <SelectValue placeholder="Select a camp..." />
          </SelectTrigger>
          <SelectContent>
            {sortedCamps.map(camp => (
              <SelectItem key={camp.id} value={camp.id}>
                {camp.name} ({format(new Date(camp.startDate), 'PPP')})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button disabled={!selectedCampId}>
        <Download className="mr-2 h-4 w-4" />
        Download Participant List
      </Button>
    </div>
  );
}
