export interface Client {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  clientId: string;
  authorId: string;
  content: string;
  createdAt: string;
}
