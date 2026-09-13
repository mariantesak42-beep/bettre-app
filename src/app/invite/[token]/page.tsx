import InviteClaimClient from "./InviteClaimClient";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <InviteClaimClient token={token} />;
}
