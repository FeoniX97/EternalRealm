export default class Log {
  static success(message: string) {
    console.log("\u001b[1;32m" + message + "\u001b[0m");
  }

  static error(message: string) {
    console.log("\u001b[1;31m" + message + "\u001b[0m");
  }
}
