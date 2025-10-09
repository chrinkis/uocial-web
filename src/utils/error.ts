import { AxiosError, isAxiosError } from "axios";
import invariant from "tiny-invariant";
import ms from "ms";

function getErrorMessageForAxiosError(error: AxiosError) {
  function getMainMessage(error: AxiosError) {
    if (!error.response) {
      if (error.request) {
        return "Server not responding.";
      }

      return error.message;
    }

    if (!error.response.data) {
      return `Server returned with status ${String(error.response.status)}.`;
    }

    if (typeof error.response.data !== "object") {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      return String(error.response.data);
    }

    const data = error.response.data as { message?: string };
    return (
      data.message ??
      `Server returned with status ${String(error.response.status)}.`
    );
  }

  function getRetryAfterTime(error: AxiosError) {
    invariant(error.response?.headers["retry-after"]);

    const retryAfter = error.response.headers["retry-after"] as unknown;

    if (Number.isNaN(Number(retryAfter))) {
      // HTTP-date format
      const retryDate = new Date(retryAfter as string);
      const now = new Date();
      const diffMs = retryDate.getTime() - now.getTime();
      return `Try again in ${ms(diffMs, { long: true })}`;
    } else {
      // delay-seconds format
      return `Try again in ${ms(Number(retryAfter) * 1000, { long: true })}`;
    }
  }

  if (error.response?.headers["retry-after"]) {
    return getMainMessage(error) + getRetryAfterTime(error) + ".";
  }

  return getMainMessage(error);
}

export function getErrorMessage(error: unknown): string {
  console.log(error);

  if (isAxiosError(error)) {
    return getErrorMessageForAxiosError(error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown Error";
}

export interface LaravelValidationResponse {
  message: string;
  errors: Record<string, string[]>;
}
