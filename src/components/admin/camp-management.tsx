
"use client";

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { saveCampAction } from '@/lib/actions';
import { deleteCampAction } from '@/lib/actions';
import type { Camp, Registration } from '@/lib/types';
import { CampSchema, type CampFormData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Trash2, FilePenLine, User, Download, Eye } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ScrollArea } from '../ui/scroll-area';
import { MultiSelect } from '../ui/multi-select';
import { punjabDistricts } from '@/lib/data';
import { format } from 'date-fns';

type CampManagementProps = {
  initialCamps: Camp[];
  initialRegistrations: Registration[];
};

const districtOptions = punjabDistricts.map(district => ({
  value: district,
  label: district,
}));

export function CampManagement({ initialCamps, initialRegistrations }: CampManagementProps) {
  const { toast } = useToast();
  const [camps] = useState<Camp[]>(initialCamps);
  const [registrations] = useState<Registration[]>(initialRegistrations);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CampFormData>({
    resolver: zodResolver(CampSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      district: [],
      eligibilityCriteria: '',
      contactPerson: '',
      contactNumber: '',
      contactEmail: '',
      maxParticipants: 50,
    },
  });

  const handleEdit = (camp: Camp) => {
    setSelectedCamp(camp);
    form.reset({
        ...camp,
        startDate: new Date(camp.startDate), 
        endDate: new Date(camp.endDate),
    });
    setFormOpen(true);
  };
  
  const handleNew = () => {
    setSelectedCamp(null);
    form.reset({
      name: '',
      description: '',
      location: '',
      district: [],
      eligibilityCriteria: '',
      contactPerson: '',
      contactNumber: '',
      contactEmail: '',
      maxParticipants: 50,
      startDate: undefined,
      endDate: undefined,
    });
    setFormOpen(true);
  };
  
  const handleViewDetails = (camp: Camp) => {
    setSelectedCamp(camp);
    setDetailsOpen(true);
  };

  const handleDeletePrompt = (camp: Camp) => {
    setSelectedCamp(camp);
    setDeleteOpen(true);
  };

  const processForm = (data: CampFormData) => {
    startTransition(async () => {
      const result = await saveCampAction(data);
      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        if (result.notification) {
          toast({
            title: "Generated Notification Preview",
            description: <pre className="mt-2 w-full rounded-md bg-slate-950 p-4"><code className="text-white">{result.notification}</code></pre>,
            duration: 15000,
          });
        }
        setFormOpen(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message,
        });
      }
    });
  };

  const processDelete = () => {
    if (!selectedCamp) return;
    startTransition(async () => {
      const result = await deleteCampAction(selectedCamp.id);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        setDeleteOpen(false);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    });
  };
  
  const getParticipantCount = (campId: string, registrationsList: Registration[]) => {
      return registrationsList
        .filter(r => r.campId === campId)
        .reduce((sum, reg) => sum + reg.students.length, 0);
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleNew} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Camp
        </Button>
      </div>

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Camp Name</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {camps.map((camp) => (
              <TableRow key={camp.id}>
                <TableCell className="font-medium">{camp.name}</TableCell>
                <TableCell>{getParticipantCount(camp.id, registrations)} / {camp.maxParticipants}</TableCell>
                <TableCell>
                  {format(new Date(camp.startDate), 'PPP')} - {format(new Date(camp.endDate), 'PPP')}
                </TableCell>
                <TableCell>
                  <Badge variant={camp.status === 'Ongoing' ? 'default' : 'secondary'} className={
                    camp.status === 'Upcoming' ? 'bg-blue-200 text-blue-800' : 
                    camp.status === 'Past' ? 'bg-gray-200 text-gray-800' :
                    'bg-green-200 text-green-800'
                  }>{camp.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleViewDetails(camp)}><Eye className="mr-2 h-4 w-4" />View Participants</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(camp)}><FilePenLine className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeletePrompt(camp)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Camp Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline">{selectedCamp ? 'Edit Camp' : 'Create a New Camp'}</DialogTitle>
            <DialogDescription>Fill in the details for the camp. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(processForm)} className="space-y-4">
              <input type="hidden" {...form.register("id")} />
              <ScrollArea className="h-[60vh] p-4">
                <div className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Camp Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea {...field} rows={4} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="location" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl><Input {...field} placeholder="e.g. Govt. Senior Secondary School, Model Town" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District(s)</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={districtOptions}
                            selected={field.value}
                            onChange={field.onChange}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField control={form.control} name="eligibilityCriteria" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Eligibility Criteria</FormLabel>
                        <FormControl><Textarea {...field} rows={3} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField control={form.control} name="maxParticipants" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Participants</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="contactPerson" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField control={form.control} name="contactNumber" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person Number</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                 
                  <FormField control={form.control} name="contactEmail" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="startDate" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl><DatePicker date={field.value} setDate={field.onChange} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="endDate" render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl><DatePicker date={field.value} setDate={field.onChange} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save Camp'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* View Participants Dialog */}
       <Dialog open={isDetailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline">{selectedCamp?.name} - Participants</DialogTitle>
            <DialogDescription>
                Registered: {getParticipantCount(selectedCamp?.id ?? '', registrations)} / {selectedCamp?.maxParticipants}.
                List of students registered for this camp.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto p-1">
            <ScrollArea className="h-full">
              {registrations.filter(r => r.campId === selectedCamp?.id).length > 0 ? (
                  registrations.filter(r => r.campId === selectedCamp?.id).map(reg => (
                      <div key={reg.id} className="mb-4">
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
                                    <TableCell>{format(new Date(student.dob), 'PPP')}</TableCell>
                                  </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                      </div>
                  ))
              ) : (
                  <p className="text-muted-foreground text-center py-8">No participants registered yet.</p>
              )}
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button variant="secondary">
              <Download className="mr-2 h-4 w-4" />
              Export List
            </Button>
            <DialogClose asChild>
              <Button type="button">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>This will permanently delete the camp "{selectedCamp?.name}". This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="ghost" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={processDelete} disabled={isPending}>{isPending ? 'Deleting...' : 'Delete'}</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
