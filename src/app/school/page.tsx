import { getCamps } from '@/lib/data';
import { CampDashboard } from '@/components/school/camp-dashboard';

export default async function SchoolDashboardPage() {
  const camps = await getCamps();

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline text-primary">Camp Dashboard</h1>
        <p className="text-muted-foreground font-body mt-1">Discover camps and register your students.</p>
      </header>
      <CampDashboard initialCamps={camps} />
    </>
  );
}
