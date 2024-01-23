export class CustomError extends Error {
  public code: number;
  public status: number;
  public message: string;
  public context: Array<string>;

  constructor(code: number, status: number, message: string) {
    super(message);
    this.code = code;
    this.status = status;
    this.message = message;
    this.context = [];
  }
}
