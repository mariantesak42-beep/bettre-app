import BetDetailClient from "./BetDetailClient";

export default async function BetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BetDetailClient betId={id} />;
}
