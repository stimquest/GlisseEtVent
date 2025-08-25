
"use client";

import Link from 'next/link';
import { LayoutDashboard, LogOut, CalendarDays, ListOrdered } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AdminUILayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/planning", label: "Planning", icon: CalendarDays },
    { href: "/admin/reservations", label: "Réservations", icon: ListOrdered },
  ];

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="/img/logo.png" alt="Logo" width={40} height={40} />
            <span className="">Glisse & Vent</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="grid items-start px-4 text-sm font-medium">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    isActive && "bg-muted text-primary"
                  )}
                  href={link.href}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="mt-auto p-4 border-t">
            <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
                <LogOut className="h-4 w-4" />
                Quitter l'admin
            </Link>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
