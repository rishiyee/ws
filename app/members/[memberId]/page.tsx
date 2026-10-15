import { notFound } from 'next/navigation';
import AppScreen from '../../../components/AppScreen';
import { members } from '../../../lib/data';

type PageProps = { params: Promise<{ memberId: string }> };

export function generateStaticParams() {
  return members.map(member => ({ memberId: member.id }));
}

export default async function MemberDetailsPage({ params }: PageProps) {
  const { memberId } = await params;
  if (!members.some(member => member.id === memberId)) notFound();
  return <AppScreen />;
}
