
"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";

const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/a-propos", label: "À Propos" },
    { href: "/formules-tarifs", label: "Formules & Tarifs" },
    { href: "/reservations", label: "Réserver un créneau"},
    { href: "/groupes-seminaires", label: "Groupes & Séminaires" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
];

const Logo = () => (
    <Image src="/img/logo.png" alt="Logo Glisse et Vent" width={96} height={96} className="w-24 h-24" />
);


export function Header({ className, inverted }: { className?: string, inverted?: boolean }) {

  return (
    <header className="p-4 sm:p-6 md:p-8 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-4 group">
        <Logo />
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-4">
        {navLinks.map(link => (
          <Button key={link.href} asChild variant="ghost" className="text-lg tracking-wider">
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Ouvrir le menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
                <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map(link => (
                <SheetClose asChild key={link.href}>
                  <Button asChild variant="ghost" className="justify-start text-2xl p-6 tracking-wider">
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
