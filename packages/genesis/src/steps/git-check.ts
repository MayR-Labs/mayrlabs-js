import { commitChanges, isGitDirty, isGitRepository } from "@/utils/git";
import { withCancelHandling } from "@/utils/handle-cancel";
import { prompts } from "@/utils/prompts";
import { spinner } from "@/utils/spinner";

export default async function gitCheck() {
  if (await isGitRepository()) {
    if (await isGitDirty()) {
      const shouldCommit = (await withCancelHandling(async () =>
        prompts.confirm({
          message:
            "Your working directory is dirty. Would you like to commit changes before proceeding?",
        })
      )) as boolean;

      if (shouldCommit) {
        const message = await withCancelHandling(async () =>
          prompts.text({
            message: "Enter commit message:",
            placeholder: "wip: pre-setup commit",
            validate(value) {
              if (value.length === 0) return "Commit message is required";
            },
          })
        );

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
