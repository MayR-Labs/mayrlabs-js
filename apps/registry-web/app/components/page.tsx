import { getAllComponents } from "@/lib/registry";
import { ComponentCard } from "@/components/component-card";

export const metadata = {
  title: "Components",
  description: "Browse our collection of high-quality, copy-paste components.",
};

export default async function ComponentsPage() {
  const items = await getAllComponents();

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl font-bold mb-4 text-white">Components</h1>
        <p className="text-lg text-zinc-400 max-w-2xl">
          Browse our collection of high-quality, copy-paste components.
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ComponentCard key={item.name} component={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-zinc-500">No components found in the registry.</p>
        </div>
      )}
    </main>
  );
}
