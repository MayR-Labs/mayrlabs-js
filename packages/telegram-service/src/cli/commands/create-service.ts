import { text, isCancel, note } from "@clack/prompts";
import fs from "fs";
import path from "path";

export async function createServiceClass() {
  const className = await text({
    message: "Enter the class name (e.g., RegistrationTelegramService)",
    placeholder: "RegistrationTelegramService",
    validate: (value) => {
      if (!value) return "Class name is required";
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(value))
        return "Class name must be PascalCase";
    },
  });

  if (isCancel(className)) return;

  const location = await text({
    message: "Where should the file be created?",
    placeholder: "./src/services/telegram/RegistrationTelegramService.ts",
    initialValue: `./${className}.ts`,
  });

  if (isCancel(location)) return;

  const instanceName =
    className.toString().charAt(0).toLowerCase() +
    className.toString().slice(1);

  const content = `import { TelegramService } from "@mayrlabs/telegram-service";

export interface ${className}Data {
  content: string;
  // Add your custom data properties here
}

export class ${className} extends TelegramService<${className}Data> {
  protected formatMessage(data: ${className}Data): string {
    const lines = [
      "",
      data.content,
      "",
      \`⏰ *Received:* _\${new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Africa/Lagos",
      })}_\`,
    ];

    return lines.join("\\n");
  }
}

export const ${instanceName} = new ${className}();
`;

  const absolutePath = path.resolve(process.cwd(), location.toString());
  const dir = path.dirname(absolutePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(absolutePath, content);

  note(`Created ${className} at ${location}`, "Success");
}
