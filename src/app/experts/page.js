import ExpertsView from './ExpertsView';
import { getExperts } from '@/lib/db/experts';

export const revalidate = 60; // ISR: refresh roster every minute

export default async function ExpertsPage() {
  const experts = await getExperts();
  return <ExpertsView experts={experts} />;
}
