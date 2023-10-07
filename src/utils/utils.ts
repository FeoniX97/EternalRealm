export class Log {
  static success(message: string) {
    console.log("\u001b[1;32m" + message + "\u001b[0m");
  }

  static error(message: string) {
    console.log("\u001b[1;31m" + message + "\u001b[0m");
  }
}

export function fromPercent(percent: number) {
  return percent / 100.0;
}
