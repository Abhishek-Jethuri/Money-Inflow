class ApiResponse {
  statusCode: number;
  message: string;
  data: unknown;
  success: boolean;

  constructor(statusCode: number, message = "Success", data: unknown) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}

export default ApiResponse;
