import { getCamps, getRegistrations, getSchoolUsers } from '@/lib/data';
import type { Camp, Registration, SchoolUser } from '@/lib/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, Users, Activity, Eye } from 'lucide-react';
import { CampWiseReport } from '@/components/admin/camp-wise-report';

export default async function ReportsPage() {
    const camps = await getCamps();
    const schoolUsers = await getSchoolUsers();
    const registrations = await getRegistrations();

    const getParticipantCount = (campId: string) => {
        return registrations
          .filter(r => r.campId === campId)
          .reduce((sum, reg) => sum + reg.students.length, 0);
    }
    
    const getStatusBadgeVariant = (status: 'Active' | 'Inactive' | 'Blocked') => {
      switch (status) {
          case 'Active': return 'bg-green-200 text-green-800';
          case 'Inactive': return 'bg-gray-200 text-gray-800';
          case 'Blocked': return 'bg-red-200 text-red-800';
          default: return 'secondary';
      }
    }

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold font-headline text-primary">Reports</h1>
                <p className="text-muted-foreground font-body mt-1">
                    View detailed reports on camps, users, and activities.
                </p>
            </header>

            <div className="grid gap-8">
                {/* 1. Camp Report */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            <span>Camp Report</span>
                        </CardTitle>
                        <CardDescription>An overview of all created camps.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Camp Name</TableHead>
                                    <TableHead>District(s)</TableHead>
                                    <TableHead>Dates</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Participants</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {camps.map(camp => (
                                    <TableRow key={camp.id}>
                                        <TableCell>{camp.name}</TableCell>
                                        <TableCell>{camp.district.join(', ')}</TableCell>
                                        <TableCell>{camp.startDate.toLocaleDateString()} - {camp.endDate.toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={camp.status === 'Ongoing' ? 'default' : 'secondary'} className={
                                                camp.status === 'Upcoming' ? 'bg-blue-200 text-blue-800' : 
                                                camp.status === 'Past' ? 'bg-gray-200 text-gray-800' :
                                                'bg-green-200 text-green-800'
                                            }>{camp.status}</Badge>
                                        </TableCell>
                                        <TableCell>{getParticipantCount(camp.id)} / {camp.maxParticipants}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* 2. User Details Report */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            <span>User Details Report</span>
                        </CardTitle>
                        <CardDescription>Details of all registered school users.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>School Name</TableHead>
                                    <TableHead>District</TableHead>
                                    <TableHead>Trainer</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {schoolUsers.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.schoolName}</TableCell>
                                        <TableCell>{user.district}</TableCell>
                                        <TableCell>{user.trainerName}</TableCell>
                                        <TableCell>{user.schoolEmail}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                
                {/* 3. User Activity Details */}
                <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            <span>User Activity Details</span>
                        </CardTitle>
                        <CardDescription>Login and other activity details of all users.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Alert>
                            <AlertTitle>Feature Under Development</AlertTitle>
                            <AlertDescription>
                                Detailed user activity logging requires a more advanced backend implementation and is not yet available in this prototype.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>

                {/* 4. Camp-wise Report */}
                <Card>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5" />
                            <span>Camp-wise Participant Report</span>
                        </CardTitle>
                        <CardDescription>View detailed participant lists for a specific camp.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CampWiseReport camps={camps} registrations={registrations} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
