import AppScreen from '../../../components/AppScreen';

type PageProps = { params: Promise<{ familyId: string }> };

export default async function FamilyDetailsPage({ params }: PageProps) {
  await params;
  return <AppScreen />;
}
