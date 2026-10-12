import { notFound } from 'next/navigation';
import AppScreen from '../../../components/AppScreen';
import { groups } from '../../../lib/data';

type PageProps = { params: Promise<{ groupId: string }> };

export default async function DirectoryGroupPage({ params }: PageProps) {
  const { groupId } = await params;
  if (!groups.some(group => group.id === groupId)) notFound();
  return <AppScreen />;
}
