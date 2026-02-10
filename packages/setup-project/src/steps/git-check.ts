import { commitChanges, isGitDirty, isGitRepository } from "@/utils/git";
import { confirm, spinner, text } from "@clack/prompts";

export default async function gitCheck() {
  if (await isGitRepository()) {
    if (await isGitDirty()) {
      const shouldCommit = await confirm({
        message:
          "Your working directory is dirty. Would you like to commit changes before proceeding?",
      });

      if (shouldCommit) {
        const message = await text({
          message: "Enter commit message:",
          placeholder: "wip: pre-setup commit",
          validate(value) {
            if (value.length === 0) return "Commit message is required";
          },
        });

        if (typeof message === "string") {
          const s = spinner();
          s.start("Committing changes...");
          await commitChanges(message);
          s.stop("Changes committed.");
        }
      }
    }
  }
}
