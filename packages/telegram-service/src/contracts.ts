/**
 * Result of a telegram operation.
 */
export interface TelegramOperationResult {
  /** Check if the operation was successful */
  success: boolean;
  /** Error message if the operation failed */
  error?: string;
}
