import spinners from "cli-spinners";
import pc from "picocolors";

export class Spinner {
  private timer: NodeJS.Timeout | null = null;
  private frameIndex = 0;
  private spinner = spinners.dots;
  private text = "";

  start(text: string) {
    this.text = text;
    this.frameIndex = 0;

    // Clear any existing timer
    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      const frame = this.spinner.frames[this.frameIndex];
      // Using \r to return to start of line, avoiding newline
      process.stdout.write(`\r${pc.magenta(frame)} ${this.text}`);
      this.frameIndex = (this.frameIndex + 1) % this.spinner.frames.length;
    }, this.spinner.interval);
  }

  stop(text?: string) {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      // Clear the current line
      process.stdout.write("\r\x1b[K");
      if (text) {
        console.log(text);
      }
    }
  }

  success(text?: string) {
    this.stop();
    console.log(`${pc.green("✔")} ${text || this.text}`);
  }

  fail(text?: string) {
    this.stop();
    console.log(`${pc.red("✖")} ${text || this.text}`);
  }

  message(text: string) {
    this.text = text;
  }
}

export const spinner = () => new Spinner();
