export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Album {id} — coming soon.</p>
    </div>
  );
}
