"use client";

import React, { useState, useTransition, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerStudentsAction } from '@/lib/actions';
import { StudentRegistrationSchema, type StudentRegistrationData } from '@/lib/types';
import type { Camp } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Target, Phone, User } from 'lucide-react';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';

type CampDashboardProps = {
  initialCamps: Camp[];
};

function CampCard({ camp, onRegister }: { camp: Camp, onRegister: (camp: Camp) => void }) {
    return (
        <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="font-headline text-primary">{camp.name}</CardTitle>
                <CardDescription className="flex items-center pt-1 gap-2 text-sm">
                    <MapPin className="h-4 w-4" /> {camp.location}, {camp.district}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow font-body space-y-3">
                <p>{camp.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(camp.startDate, "MMM d, yyyy")} - {format(camp.endDate, "MMM d, yyyy")}</span>
                </div>
                 <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Target className="h-4 w-4 mt-1 flex-shrink-0" />
                    <span>{camp.eligibilityCriteria}</span>
                </div>
                <div className="border-t pt-3 mt-3 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{camp.contactPerson}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{camp.contactNumber}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                {camp.status !== 'Past' && (
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => onRegister(camp)}>
                        Register Students
                    </Button>
                )}
                 {camp.status === 'Past' && (
                    <Badge variant="outline" className="w-full justify-center">Camp concluded</Badge>
                )}
            </CardFooter>
        </Card>
    )
}

function CampList({ camps, onRegister }: { camps: Camp[], onRegister: (camp: Camp) => void }) {
    if (camps.length === 0) {
        return <div className="text-center text-muted-foreground py-16">No camps to display in this category.</div>
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {camps.map(camp => <CampCard key={camp.id} camp={camp} onRegister={onRegister} />)}
        </div>
    )
}

export function CampDashboard({ initialCamps }: CampDashboardProps) {
  const { toast } = useToast();
  const [camps] = useState<Camp[]>(initialCamps);
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);
  const [isPending, startTransition] = useTransition();

  const { upcoming, ongoing, past } = useMemo(() => {
    return {
      upcoming: camps.filter(c => c.status === 'Upcoming'),
      ongoing: camps.filter(c => c.status === 'Ongoing'),
      past: camps.filter(c => c.status === 'Past'),
    }
  }, [camps]);

  const form = useForm<StudentRegistrationData>({
    resolver: zodResolver(StudentRegistrationSchema),
    defaultValues: {
        campId: '',
        studentNames: '',
    },
  });

  const handleRegister = (camp: Camp) => {
    setSelectedCamp(camp);
    form.reset({ campId: camp.id, studentNames: '' });
    setFormOpen(true);
  };
  
  const processForm = (data: StudentRegistrationData) => {
    startTransition(async () => {
      const result = await registerStudentsAction(data);
      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        });
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

  return (
    <>
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
            <CampList camps={upcoming} onRegister={handleRegister} />
        </TabsContent>
        <TabsContent value="ongoing" className="mt-6">
            <CampList camps={ongoing} onRegister={handleRegister} />
        </TabsContent>
        <TabsContent value="past" className="mt-6">
            <CampList camps={past} onRegister={handleRegister} />
        </TabsContent>
      </Tabs>

      {/* Registration Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline">Register for {selectedCamp?.name}</DialogTitle>
            <DialogDescription>Enter the names of the students you wish to register. Please enter one name per line.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(processForm)} className="space-y-4">
              <FormField
                control={form.control}
                name="studentNames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Names</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g.&#10;Amrit Kaur&#10;Balwinder Singh"
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending}>{isPending ? 'Registering...' : 'Submit Registration'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
