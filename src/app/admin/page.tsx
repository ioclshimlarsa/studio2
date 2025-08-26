import { getCamps, getRegistrationsForCamp } from '@/lib/data';
import { CampManagement } from '@/components/admin/camp-management';

export default async function AdminDashboardPage() {
  const camps = await getCamps();
  const allRegistrations = await Promise.all(
    camps.map(camp => getRegistrationsForCamp(camp.id))
  ).then(res => res.flat());

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline text-primary">Camp Management</h1>
        <p className="text-muted-foreground font-body mt-1">Create, view, and manage all camps.</p>
      </header>
      <CampManagement initialCamps={camps} initialRegistrations={allRegistrations} />
    </>
  );
}
