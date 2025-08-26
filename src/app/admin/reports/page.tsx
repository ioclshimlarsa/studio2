import { getCamps, getRegistrations, getSchoolUsers } from '@/lib/data';
import type { Camp, Registration, SchoolUser } from '@/lib/types';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, Users, Activity, Eye, Download } from 'lucide-react';
import { CampWiseReport } from '@/components/admin/camp-wise-report';

export default async function ReportsPage() {
    const camps = await getCamps();
    const schoolUsers = await getSchoolUsers();
    const registrations = await getRegistrations();

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold font-headline text-primary">Reports</h1>
                <p className="text-muted-foreground font-body mt-1">
                    Download detailed reports on camps, users, and activities.
                </p>
            </header>

            <div className="grid gap-8 md:grid-cols-2">
                {/* 1. Camp Report */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            <span>Camp Report</span>
                        </CardTitle>
                        <CardDescription>Download an overview of all created camps, including participant numbers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button>
                            <Download className="mr-2 h-4 w-4" />
                            Download Camp Report
                        </Button>
                    </CardContent>
                </Card>

                {/* 2. User Details Report */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            <span>User Details Report</span>
                        </CardTitle>
                        <CardDescription>Download details of all registered school users, including their status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button>
                           <Download className="mr-2 h-4 w-4" />
                           Download User Report
                        </Button>
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
                                Detailed user activity logging is not yet available for download in this prototype.
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
                        <CardDescription>Select a camp to download its detailed participant list.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CampWiseReport camps={camps} registrations={registrations} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
