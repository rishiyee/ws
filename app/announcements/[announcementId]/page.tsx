import { notFound } from 'next/navigation';
import AppScreen from '../../../components/AppScreen';

type PageProps = { params: Promise<{ announcementId: string }> };

export default async function AnnouncementDetailsPage({ params }: PageProps) {
  const { announcementId } = await params;
  if (announcementId !== 'directory') notFound();
  return <AppScreen />;
}
