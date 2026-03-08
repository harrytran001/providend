import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

/**
 * Mock auth: current user id. In production this would come from auth provider / JWT.
 */
const AuthContext = createContext<{
  authorId: string;
  setAuthorId: (id: string) => void;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authorId, setAuthorId] = useState('user-1');
  return (
    <AuthContext.Provider value={{ authorId, setAuthorId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
