/**
 * Shared API types (request/response shapes, DTOs).
 * Add more as you add endpoints.
 */

export interface HelloResponse {
  message: string;
  timestamp: string;
  environment: string;
}
