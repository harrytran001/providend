import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { NotesSection } from '@/components/NotesSection';

function AppContent() {
  const { authorId, setAuthorId } = useAuth();

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Providend – Notes</h1>

      {/* Mock auth: switch user to test assignment. user-1: both clients; user-2: Acme only. */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Logged in as</span>
        <select
          className="rounded-md border bg-background px-2 py-1 text-sm"
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
        >
          <option value="user-1">user-1</option>
          <option value="user-2">user-2</option>
        </select>
        <span className="text-xs">(mock; real app would use JWT/session)</span>
      </div>

      <NotesSection />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
