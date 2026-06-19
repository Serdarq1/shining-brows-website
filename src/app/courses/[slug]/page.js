import { notFound } from 'next/navigation';
import OperationView from './OperationView';
import { getTrainers } from '@/lib/db/experts';

export const revalidate = 60;

const OPERATION_SLUGS = ['brow-removal', 'brow-henna', 'hair-brow-vitamin'];

export default async function OperationPage({ params }) {
  if (!OPERATION_SLUGS.includes(params.slug)) notFound();
  const trainers = await getTrainers();
  return <OperationView slug={params.slug} trainers={trainers} />;
}
