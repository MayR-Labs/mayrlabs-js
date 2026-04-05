import { BlockCard } from "@/components/block-card";
import { getAllBlocks } from "@/lib/registry";

export const metadata = {
  title: "Blocks",
  description: "Browse our collection of high-quality, copy-paste components.",
};

export default async function BlocksPage() {
  const items = await getAllBlocks();

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl font-bold mb-4 text-white">Blocks</h1>
        <p className="text-lg text-zinc-400 max-w-2xl">
          Browse our collection of high-quality, copy-paste components.
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <BlockCard key={item.name} block={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-zinc-500">No blocks found in the registry.</p>
        </div>
      )}
    </main>
  );
}
