import { isAxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  console.log(error);

  if (!isAxiosError(error)) {
    if (error instanceof Error) {
      return error.message;
    }

    return "Unknown Error";
  }

  if (!error.response) {
    if (error.request) {
      return "Server not responding";
    }

    return error.message;
  }

  if (!error.response.data) {
    return `Server returned with status ${String(error.response.status)}`;
  }

  if (typeof error.response.data !== "object") {
    return String(error.response.data);
  }

  const data = error.response.data as { message?: string };
  return (
    data.message ??
    `Server returned with status ${String(error.response.status)}`
  );
}

export interface LaravelValidationResponse {
  message: string;
  errors: Record<string, string[]>;
}
