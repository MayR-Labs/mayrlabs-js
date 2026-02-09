import { select, log } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";

export async function promptEditorConfig(config: any) {
  log.message(pc.bgWhite(pc.black(" EditorConfig Configuration ")));

  const preset = (await select({
    message: "Select EditorConfig preset:",
    options: [
      { value: "default", label: "Default (Spaces 2)" },
      { value: "spaces4", label: "Spaces 4" },
      { value: "tabs", label: "Tabs" },
    ],
  })) as string;
  config.editorConfigPreset = preset;
}

export async function installEditorConfig(config: any) {
  let content =
    "root = true\n\n[*]\ncharset = utf-8\nend_of_line = lf\ninsert_final_newline = true\ntrim_trailing_whitespace = true\n";

  if (
    config.editorConfigPreset === "default" ||
    config.editorConfigPreset === "spaces2"
  ) {
    content += "indent_style = space\nindent_size = 2\n";
  } else if (config.editorConfigPreset === "spaces4") {
    content += "indent_style = space\nindent_size = 4\n";
  } else if (config.editorConfigPreset === "tabs") {
    content += "indent_style = tab\n";
  }

  await fs.outputFile(".editorconfig", content);
}
