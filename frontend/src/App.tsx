import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const API_BASE = '/api';

interface HelloResponse {
  message: string;
  timestamp: string;
  environment: string;
}

export default function App() {
  const [hello, setHello] = useState<HelloResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHello = () => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/hello`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.statusText))))
      .then(setHello)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHello();
  }, []);

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Providend – Local Stack</h1>
      <section className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-4">
          Sample endpoint (BE → FE)
        </h2>
        {error && (
          <p className="text-destructive text-sm mb-4">Error: {error}</p>
        )}
        {hello && (
          <pre className="text-sm overflow-auto rounded-md bg-muted p-4 mb-4">
            {JSON.stringify(hello, null, 2)}
          </pre>
        )}
        {loading && !hello && !error && (
          <p className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading…
          </p>
        )}
        <Button onClick={fetchHello} disabled={loading} variant="outline" size="sm">
          {loading ? 'Loading…' : 'Refetch'}
        </Button>
      </section>
    </div>
  );
}
