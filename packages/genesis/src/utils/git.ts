import { execa } from "execa";

export async function isGitRepository(): Promise<boolean> {
  try {
    await execa("git", ["rev-parse", "--is-inside-work-tree"]);
    return true;
  } catch {
    return false;
  }
}

export async function isGitDirty(): Promise<boolean> {
  try {
    const { stdout } = await execa("git", ["status", "--porcelain"]);
    return stdout.length > 0;
  } catch {
    return false;
  }
}

export async function commitChanges(message: string): Promise<void> {
  await execa("git", ["add", "."]);
  await execa("git", ["commit", "-m", message]);
}
