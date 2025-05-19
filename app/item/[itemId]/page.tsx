export default async function Page({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const itemId = (await params).itemId;
  return <div>My Post: {itemId}</div>;
}
