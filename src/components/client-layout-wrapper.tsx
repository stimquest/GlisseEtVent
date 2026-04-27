"use client";

import { useState, type ReactElement, type ReactNode } from "react";
import { AdminProvider } from '@/app/admin/admin-context';
import { AdminUILayout } from "@/components/admin/admin-ui-layout";
import { usePathname } from 'next/navigation';
import { verifyAdminPassword } from "@/app/actions";

function AdminAuthWrapper({ children }: { children: ReactElement }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    
    try {
      const isValid = await verifyAdminPassword(password);
      if (isValid) {
        setIsAuthenticated(true);
        setError("");
      } else {
        setError("Mot de passe incorrect.");
      }
    } catch (err) {
      setError("Erreur lors de la vérification.");
    } finally {
      setIsPending(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-sm p-8 space-y-6 bg-card rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Accès Admin</h1>
            <p className="text-muted-foreground">Veuillez entrer le mot de passe.</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full px-3 py-2 text-base text-foreground bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={isPending}
              className="w-full px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
            >
              {isPending ? "Vérification..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminUILayout>
      {children}
    </AdminUILayout>
  );
}

export function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <AdminProvider>
      {isAdminRoute ? <AdminAuthWrapper>{children as ReactElement}</AdminAuthWrapper> : children}
    </AdminProvider>
  );
}

