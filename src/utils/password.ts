import zxcvbn from "zxcvbn";

export function validatePassword(
  password: string,
  user: string[],
): string | null {
  const result = zxcvbn(password, user);

  if (result.score === 4) {
    return null;
  }

  if (result.feedback.warning && result.feedback.suggestions.length > 0) {
    return `${result.feedback.warning}. ${result.feedback.suggestions.join(". ")}`;
  }

  if (result.feedback.warning) {
    return result.feedback.warning;
  }

  if (result.feedback.suggestions.length > 0) {
    return result.feedback.suggestions.join(". ");
  }

  return "This password is weak.";
}
