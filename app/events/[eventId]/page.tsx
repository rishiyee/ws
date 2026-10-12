import { notFound } from 'next/navigation';
import AppScreen from '../../../components/AppScreen';

type PageProps = { params: Promise<{ eventId: string }> };

export default async function EventDetailsPage({ params }: PageProps) {
  const { eventId } = await params;
  if (eventId !== 'picnic') notFound();
  return <AppScreen />;
}
