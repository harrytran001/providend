import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchClients, fetchNotes, addNote } from '@/api/notes';
import type { Client } from '@/types/notes';

interface NoteItem {
  id: string;
  clientId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export function NotesSection() {
  const { authorId } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newContent, setNewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClients()
      .then(setClients)
      .catch((e) => setError(e.message));
  }, []);

  const loadNotes = useCallback(() => {
    if (!selectedClientId) {
      setNotes([]);
      return;
    }
    setLoading(true);
    setError(null);
    fetchNotes(selectedClientId, authorId)
      .then(setNotes)
      .catch((e) => {
        setError(e.message);
        setNotes([]);
      })
      .finally(() => setLoading(false));
  }, [selectedClientId, authorId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleAddNote = () => {
    if (!selectedClientId || !newContent.trim()) return;
    setSubmitting(true);
    setError(null);
    addNote(selectedClientId, authorId, newContent.trim())
      .then((note) => {
        setNotes((prev) => [note, ...prev]);
        setNewContent('');
      })
      .catch((e) => setError(e.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <section className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-semibold">Notes (assignment check)</h2>

      <div>
        <label className="text-sm text-muted-foreground block mb-1">Client</label>
        <select
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
        >
          <option value="">Select a client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-destructive text-sm">Error: {error}</p>
      )}

      {selectedClientId && (
        <>
          {loading ? (
            <p className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading notes…
            </p>
          ) : (
            <ul className="space-y-2">
              {notes.length === 0 && (
                <li className="text-sm text-muted-foreground">No notes yet.</li>
              )}
              {notes.map((n) => (
                <li
                  key={n.id}
                  className="rounded-md bg-muted p-3 text-sm border-l-2 border-primary/50"
                >
                  <p>{n.content}</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    by {n.authorId} · {new Date(n.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="New note…"
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
            />
            <Button
              onClick={handleAddNote}
              disabled={!newContent.trim() || submitting}
              size="sm"
            >
              {submitting ? 'Adding…' : 'Add'}
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
