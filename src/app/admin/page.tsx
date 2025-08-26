import { getCamps, getRegistrationsForCamp, getSchoolUsers } from '@/lib/data';
import { CampManagement } from '@/components/admin/camp-management';
import { SchoolManagement } from '@/components/admin/school-management';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function AdminDashboardPage() {
  const camps = await getCamps();
  const allRegistrations = await Promise.all(
    camps.map(camp => getRegistrationsForCamp(camp.id))
  ).then(res => res.flat());
  const schoolUsers = await getSchoolUsers();

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline text-primary">Admin Dashboard</h1>
        <p className="text-muted-foreground font-body mt-1">Manage camps and school users.</p>
      </header>
      <Tabs defaultValue="camps" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camps">Camp Management</TabsTrigger>
          <TabsTrigger value="schools">School Management</TabsTrigger>
        </TabsList>
        <TabsContent value="camps" className="mt-6">
           <CampManagement initialCamps={camps} initialRegistrations={allRegistrations} />
        </TabsContent>
        <TabsContent value="schools" className="mt-6">
          <SchoolManagement initialSchoolUsers={schoolUsers} />
        </TabsContent>
      </Tabs>
    </>
  );
}
