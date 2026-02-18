import { clientEnv } from "./env/client";

export interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  registryDependencies?: string[];
  dependencies?: string[];
  devDependencies?: string[];
  files: Array<{
    path: string;
    type: string;
    content?: string;
    target?: string;
  }>;
  category?: string;
  subcategory?: string;
  chunks?: Array<{
    name: string;
    description: string;
    component: React.ComponentType;
    file: string;
    container: {
      className?: string;
    };
  }>;
}

export interface Registry {
  name: string;
  homepage: string;
  items: RegistryItem[];
}

export async function getRegistry(): Promise<Registry | null> {
  const res = await fetch(`${clientEnv.NEXT_PUBLIC_APP_URL}/r/registry.json`, {
    cache: "force-cache",
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch registry`);
  }

  const body = await res.json();

  return body as Registry;
}

export async function getAllBlocks(): Promise<RegistryItem[]> {
  const registry = await getRegistry();

  if (!registry) return [];

  return registry.items.filter((item) => item.type === "registry:block");
}

export async function getAllComponents(): Promise<RegistryItem[]> {
  const registry = await getRegistry();

  if (!registry) return [];

  return registry.items.filter((item) => item.type === "registry:component");
}

export async function getBlock(name: string): Promise<RegistryItem | null> {
  try {
    const res = await fetch(`${clientEnv.NEXT_PUBLIC_APP_URL}/r/${name}.json`, {
      cache: "force-cache",
      next: { tags: [`block:${name}`] },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch block: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching block ${name}:`, error);

    return null;
  }
}
