export type Result<T = string> =
  | { success: true; data: T }
  | { success: false; error: Error };
