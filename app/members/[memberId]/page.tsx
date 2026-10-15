import AppScreen from '../../../components/AppScreen';

type PageProps = { params: Promise<{ memberId: string }> };

export default async function MemberDetailsPage({ params }: PageProps) {
  await params;
  return <AppScreen />;
}
