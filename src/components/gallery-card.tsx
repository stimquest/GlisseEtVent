
"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

export function GalleryCard({ className }: { className?: string }) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle className="text-4xl flex items-center gap-2">
          <Camera className="w-8 h-8 text-accent" />
          Galerie
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-2">
        <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
            <div className="relative col-span-1 row-span-1 rounded-md overflow-hidden">
                 <Image src="/img/char3.jpg" alt="Char 3" fill className="object-cover" />
            </div>
             <div className="relative col-span-1 row-span-2 rounded-md overflow-hidden">
                 <Image src="/img/Trio.webp" alt="Trio" fill className="object-cover" />
            </div>
             <div className="relative col-span-1 row-span-1 rounded-md overflow-hidden">
                 <Image src="/img/char4.jpg" alt="Char 4" fill className="object-cover" />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
