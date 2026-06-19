import WorkshopsView from './WorkshopsView';
import { getWorkshops } from '@/lib/db/workshops';

export const revalidate = 60;

export default async function WorkshopsPage() {
  const workshops = await getWorkshops();
  return <WorkshopsView workshops={workshops} />;
}
