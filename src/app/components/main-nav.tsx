"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Heart, PlusSquare, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/explore", label: "Explore", icon: Home },
  { href: "/recommended", label: "Recommended", icon: Heart },
  { href: "/list-item", label: "List Item", icon: PlusSquare, isCentral: true },
  { href: "/inbox", label: "Messages", icon: MessageSquare },
  { href: "/profile", label: "Profile", icon: User },
];

export function MainNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  if (isMobile) {
    return (
      <nav className="grid grid-cols-5 items-center justify-around gap-1 p-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          if(item.isCentral) {
              return (
                <Link key={item.href} href={item.href} className="flex justify-center">
                    <Button size="icon" className="size-16 rounded-full bg-accent text-accent-foreground -translate-y-4 shadow-lg hover:bg-accent/90">
                        <Icon className="size-8" />
                        <span className="sr-only">{item.label}</span>
                    </Button>
                </Link>
              )
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg p-2 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.filter(item => !item.isCentral).map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive
                ? "bg-muted text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
        <div className="px-3 mt-4">
            <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/list-item">
                    <PlusSquare className="mr-2 h-4 w-4" /> List an Item
                </Link>
            </Button>
        </div>
    </nav>
  );
}
