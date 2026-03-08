const API_BASE = '/api';

function headers(authorId: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-Author-Id': authorId,
  };
}

export async function fetchClients(): Promise<{ id: string; name: string }[]> {
  const res = await fetch(`${API_BASE}/clients`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function fetchNotes(
  clientId: string,
  authorId: string
): Promise<{ id: string; clientId: string; authorId: string; content: string; createdAt: string }[]> {
  const res = await fetch(`${API_BASE}/clients/${clientId}/notes`, {
    headers: headers(authorId),
  });
  if (res.status === 403) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Not authorized for this client');
  }
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function addNote(
  clientId: string,
  authorId: string,
  content: string
): Promise<{ id: string; clientId: string; authorId: string; content: string; createdAt: string }> {
  const res = await fetch(`${API_BASE}/clients/${clientId}/notes`, {
    method: 'POST',
    headers: headers(authorId),
    body: JSON.stringify({ content }),
  });
  if (res.status === 403) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Not authorized for this client');
  }
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
