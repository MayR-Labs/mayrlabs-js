/**
 * Internal payload structure before encryption
 */
export interface M2MPayload {
  app_id: string;
  user_id: string;
  action: string;
  created_at: string;
  payload: unknown;
}

/**
 * Standard API response structure from the Account Center
 * This represents the outer JSON envelope.
 */
export interface M2MResponse {
  success: boolean;
  data?: {
    response: string; // The encrypted response payload
  };
  error?: { message: string; code: string };
}

/**
 * Structure of the decrypted inner response
 */
export interface DecryptedM2MResponse<T> {
  success: boolean;
  data: T;
  error?: { message: string; code: string };
}
