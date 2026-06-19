import CoursesView from './CoursesView';
import { getTrainers } from '@/lib/db/experts';

export const revalidate = 60;

export default async function CoursesPage() {
  const trainers = await getTrainers();
  return <CoursesView trainers={trainers} />;
}
