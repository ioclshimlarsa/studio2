
"use client";

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Papa from 'papaparse';
import { 
    saveSchoolUserAction, 
    updateSchoolUserStatusAction, 
    resetSchoolUserPasswordAction,
    deleteSchoolUserAction,
    bulkAddSchoolUsersAction
} from '@/lib/actions';
import type { SchoolUser, SchoolUserStatus, SchoolUserFormData } from '@/lib/types';
import { SchoolUserFormSchema } from '@/lib/types';
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
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
    MoreHorizontal, 
    PlusCircle, 
    Ban, 
    KeyRound, 
    UserX,
    UserCheck,
    Trash2,
    Upload,
} from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { punjabDistricts } from '@/lib/data';

type SchoolManagementProps = {
  initialSchoolUsers: SchoolUser[];
};

export function SchoolManagement({ initialSchoolUsers }: SchoolManagementProps) {
  const { toast } = useToast();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isBulkOpen, setBulkOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [alertContent, setAlertContent] = useState({ title: '', description: '', onConfirm: () => {} });
  const [selectedUser, setSelectedUser] = useState<SchoolUser | null>(null);
  const [isPending, startTransition] = useTransition();
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const form = useForm<SchoolUserFormData>({
    resolver: zodResolver(SchoolUserFormSchema),
    defaultValues: {
        schoolName: '',
        location: '',
        district: '',
        principalName: '',
        trainerName: '',
        trainerContact: '',
        schoolEmail: '',
        password: '',
        confirmPassword: '',
    },
  });

  const handleNew = () => {
    setSelectedUser(null);
    form.reset();
    setFormOpen(true);
  };
  
  const handleBulkUpload = () => {
    setCsvFile(null);
    setBulkOpen(true);
  };

  const handleStatusChange = (user: SchoolUser, status: SchoolUserStatus) => {
    setSelectedUser(user);
    const actionText = status === 'Active' ? 'activate' : status === 'Inactive' ? 'deactivate' : 'block';
    setAlertContent({
        title: `Confirm ${actionText}`,
        description: `Are you sure you want to ${actionText} "${user.schoolName}"?`,
        onConfirm: () => processStatusUpdate(user.id, status)
    });
    setAlertOpen(true);
  };
  
  const handlePasswordReset = (user: SchoolUser) => {
    setSelectedUser(user);
    setNewPassword('');
    setPasswordDialogOpen(true);
  };
  
  const handleDeletePrompt = (user: SchoolUser) => {
    setSelectedUser(user);
    setAlertContent({
        title: 'Are you absolutely sure?',
        description: `This action cannot be undone. This will permanently delete the user for "${user.schoolName}".`,
        onConfirm: () => processDelete(user.id)
    });
    setAlertOpen(true);
  };

  const processForm = (data: SchoolUserFormData) => {
    startTransition(async () => {
      const result = await saveSchoolUserAction(data);
      if (result.success) {
        toast({ title: 'Success!', description: result.message });
        setFormOpen(false);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    });
  };

  const processBulkUpload = () => {
    if (!csvFile) {
        toast({ variant: "destructive", title: "Error", description: "Please select a CSV file to upload." });
        return;
    }
    
    startTransition(() => {
        Papa.parse(csvFile, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const parsedData = results.data as SchoolUserFormData[];
                const result = await bulkAddSchoolUsersAction(parsedData);
                
                if (result.success) {
                    toast({ title: 'Success!', description: result.message });
                    setBulkOpen(false);
                } else {
                    toast({ variant: 'destructive', title: 'Error', description: result.message });
                }
            },
            error: (error) => {
                toast({ variant: "destructive", title: "CSV Parsing Error", description: error.message });
            }
        });
    });
  };


  const processStatusUpdate = (userId: string, status: SchoolUserStatus) => {
    startTransition(async () => {
        const result = await updateSchoolUserStatusAction(userId, status);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
        setAlertOpen(false);
    });
  };
  
  const processPasswordReset = () => {
    if (!selectedUser || !newPassword) {
        toast({ variant: "destructive", title: "Error", description: "Password cannot be empty." });
        return;
    }
    startTransition(async () => {
        const result = await resetSchoolUserPasswordAction(selectedUser.id, newPassword);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setPasswordDialogOpen(false);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
    });
  };
  
   const processDelete = (userId: string) => {
    startTransition(async () => {
        const result = await deleteSchoolUserAction(userId);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
        setAlertOpen(false);
    });
  };

  const getStatusBadgeVariant = (status: SchoolUserStatus) => {
      switch (status) {
          case 'Active': return 'bg-green-200 text-green-800';
          case 'Inactive': return 'bg-gray-200 text-gray-800';
          case 'Blocked': return 'bg-red-200 text-red-800';
          default: return 'secondary';
      }
  }

  return (
    <>
      <div className="flex justify-end gap-2 mb-4">
        <Button onClick={handleBulkUpload} variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Bulk Upload
        </Button>
        <Button onClick={handleNew} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New School
        </Button>
      </div>

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School Name</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialSchoolUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div>{user.schoolName}</div>
                  <div className="text-xs text-muted-foreground">{user.location}</div>
                </TableCell>
                <TableCell>{user.district}</TableCell>
                <TableCell>
                  <div>{user.trainerName}</div>
                  <div className="text-xs text-muted-foreground">{user.trainerContact}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {user.status !== 'Active' && <DropdownMenuItem onClick={() => handleStatusChange(user, 'Active')}><UserCheck className="mr-2 h-4 w-4" />Activate</DropdownMenuItem>}
                        {user.status === 'Active' && <DropdownMenuItem onClick={() => handleStatusChange(user, 'Inactive')}><UserX className="mr-2 h-4 w-4" />Deactivate</DropdownMenuItem>}
                        {user.status !== 'Blocked' && <DropdownMenuItem onClick={() => handleStatusChange(user, 'Blocked')} className="text-destructive"><Ban className="mr-2 h-4 w-4" />Block</DropdownMenuItem>}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handlePasswordReset(user)}><KeyRound className="mr-2 h-4 w-4" />Reset Password</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeletePrompt(user)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* School User Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline">Add a New School User</DialogTitle>
            <DialogDescription>Fill in the school's details to create a new login.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(processForm)} className="space-y-4">
              <ScrollArea className="h-[60vh] p-4">
                <div className="space-y-4">
                  <FormField control={form.control} name="schoolName" render={({ field }) => (
                      <FormItem><FormLabel>School Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="location" render={({ field }) => (
                      <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} placeholder="e.g. Sector 1, ABC City" /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="district" render={({ field }) => (
                      <FormItem>
                          <FormLabel>District</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Select a district" />
                                  </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                  {punjabDistricts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                              </SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                  )}/>
                  <FormField control={form.control} name="principalName" render={({ field }) => (
                      <FormItem><FormLabel>Principal Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField control={form.control} name="trainerName" render={({ field }) => (
                        <FormItem><FormLabel>Trainer Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                     )}/>
                     <FormField control={form.control} name="trainerContact" render={({ field }) => (
                        <FormItem><FormLabel>Trainer Contact</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                     )}/>
                   </div>
                  <FormField control={form.control} name="schoolEmail" render={({ field }) => (
                      <FormItem><FormLabel>School Login Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                     )}/>
                     <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                        <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                     )}/>
                   </div>
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending}>{isPending ? 'Creating...' : 'Create User'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Bulk CSV Upload Dialog */}
      <Dialog open={isBulkOpen} onOpenChange={setBulkOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Bulk Upload School Users</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file to add multiple school users at once. The CSV must have headers: 
                    `schoolName`, `location`, `district`, `principalName`, `trainerName`, `trainerContact`, `schoolEmail`.
                  </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Label htmlFor="csv-file">CSV File</Label>
                <Input 
                    id="csv-file" 
                    type="file" 
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files ? e.target.files[0] : null)} 
                />
              </div>
              <DialogFooter>
                  <Button variant="ghost" onClick={() => setBulkOpen(false)}>Cancel</Button>
                  <Button onClick={processBulkUpload} disabled={isPending || !csvFile}>
                      {isPending ? 'Uploading...' : 'Upload and Activate'}
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
      
      {/* Confirmation Alert Dialog for Status Change or Delete */}
      <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{alertContent.title}</AlertDialogTitle>
                <AlertDialogDescription>{alertContent.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                    onClick={alertContent.onConfirm} 
                    disabled={isPending}
                    className={alertContent.title.includes('delete') || alertContent.title.includes('Block') ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
                >
                    {isPending ? 'Processing...' : 'Confirm'}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Reset Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setPasswordDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Reset Password for {selectedUser?.schoolName}</DialogTitle>
                  <DialogDescription>Enter a new password for the user.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-password" >New Password</Label>
                      <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="col-span-3"
                      />
                  </div>
              </div>
              <DialogFooter>
                  <Button variant="ghost" onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
                  <Button onClick={processPasswordReset} disabled={isPending}>
                      {isPending ? 'Resetting...' : 'Set Password'}
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}

    