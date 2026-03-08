/**
 * Data model: Client, Note, and assignment (who can act on which client).
 * Real DB columns match these; auth is mocked (authorId from context).
 */
export interface Client {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  clientId: string;
  authorId: string;
  content: string;
  createdAt: string; // ISO
}

/** Mock: current user from "auth" context (header or fake). */
export interface AuthContext {
  authorId: string;
}
