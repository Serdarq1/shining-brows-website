import WorkshopView from './WorkshopView';
import { getWorkshopById } from '@/lib/db/workshops';

export const revalidate = 60;

export default async function WorkshopPage({ params }) {
  const workshop = await getWorkshopById(params.id);
  return <WorkshopView workshop={workshop} />;
}
