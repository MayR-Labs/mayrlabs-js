import * as p from "@clack/prompts";
import { execSync } from "node:child_process";

export async function checkGitStatus(rootDir: string) {
  try {
    const status = execSync("git status --porcelain", { cwd: rootDir })
      .toString()
      .trim();
    if (status) {
      const shouldCommit = await p.confirm({
        message:
          "You have uncommitted changes. Do you want to commit them first?",
        initialValue: true,
      });

      if (p.isCancel(shouldCommit)) {
        p.cancel("Operation cancelled.");
        process.exit(0);
      }

      if (shouldCommit) {
        const message = await p.text({
          message: "Commit message",
          placeholder: "wip: saving changes before cleanup",
          validate: (value) => {
            if (!value) return "Please enter a commit message";
          },
        });

        if (p.isCancel(message)) {
          p.cancel("Operation cancelled.");
          process.exit(0);
        }

        const s = p.spinner();
        s.start("Committing changes...");
        try {
          execSync("git add .", { cwd: rootDir });
          execSync(`git commit -m "${message}"`, { cwd: rootDir });
          s.stop("Changes committed.");
        } catch (e) {
          s.stop("Failed to commit changes.");
          console.error(e);
          process.exit(1);
        }
      } else {
        p.log.warn("Proceeding with uncommitted changes. This is risky.");
      }
    }
  } catch {
    p.log.error("Failed to check git status. Is this a git repository?");
    process.exit(1);
  }
}
