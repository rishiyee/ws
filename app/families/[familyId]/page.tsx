import { notFound } from 'next/navigation';
import AppScreen from '../../../components/AppScreen';
import { families } from '../../../lib/data';

type PageProps = { params: Promise<{ familyId: string }> };

export function generateStaticParams() {
  return families.map(family => ({ familyId: family.id }));
}

export default async function FamilyDetailsPage({ params }: PageProps) {
  const { familyId } = await params;
  if (!families.some(family => family.id === familyId)) notFound();
  return <AppScreen />;
}
