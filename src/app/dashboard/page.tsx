export default function DashboardPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight">
              My Clothing
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              View and manage your clothing items
            </p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight">
              My Outfits
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Create and browse your outfits
            </p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight">
              Favorites
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Quick access to your favorite items
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
