import { select, log } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import { Config } from "@/config/config";
import { EDITOR_CONFIG_OPTIONS } from "@/constants/options";
import { withCancelHandling } from "@/utils/handle-cancel";

export async function promptEditorConfig(config: Config) {
  log.message(pc.bgWhite(pc.black(" EditorConfig Configuration ")));

  const preset = (await withCancelHandling(async () =>
    select({
      message: "Select EditorConfig preset:",
      options: EDITOR_CONFIG_OPTIONS,
    }),
  )) as string as "default" | "spaces4" | "tabs";

  config.get("editorConfig").config = { preset };
}

export async function installEditorConfig(config: Config) {
  let content =
    "root = true\n\n[*]\ncharset = utf-8\nend_of_line = lf\ninsert_final_newline = true\ntrim_trailing_whitespace = true\n";

  const preset = config.get("editorConfig").config?.preset;

  if (preset === "default") {
    content += "indent_style = space\nindent_size = 2\n";
  } else if (preset === "spaces4") {
    content += "indent_style = space\nindent_size = 4\n";
  } else if (preset === "tabs") {
    content += "indent_style = tab\n";
  }

  await fs.outputFile(".editorconfig", content);
}
