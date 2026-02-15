import fs from "fs";
import path from "path";

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

// @ts-expect-error process.cwd() is not typed in this environment
const REGISTRY_PATH = path.join(process.cwd(), "public/r/registry.json");
// @ts-expect-error process.cwd() is not typed in this environment
const BLOCKS_PATH = path.join(process.cwd(), "public/r");

export async function getRegistry(): Promise<Registry | null> {
  try {
    if (!fs.existsSync(REGISTRY_PATH)) {
      return null;
    }
    const content = await fs.promises.readFile(REGISTRY_PATH, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading registry:", error);
    return null;
  }
}

export async function getAllBlocks(): Promise<RegistryItem[]> {
  const registry = await getRegistry();
  if (!registry) return [];
  return registry.items.filter((item) => item.type === "registry:block");
}

export async function getBlock(name: string): Promise<RegistryItem | null> {
  try {
    const blockPath = path.join(BLOCKS_PATH, `${name}.json`);
    console.log(blockPath);
    if (!fs.existsSync(blockPath)) {
      // Fallback to searching in registry if individual file doesn't exist
      const registry = await getRegistry();
      return registry?.items.find((item) => item.name === name) || null;
    }
    const content = await fs.promises.readFile(blockPath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading block ${name}:`, error);
    return null;
  }
}
