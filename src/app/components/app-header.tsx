import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/app/components/user-nav";
import { Wordmark } from "@/app/components/logo";

export function AppHeader({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Wordmark />
          </Link>
        </div>
        
        {/* Mobile Logo */}
        <div className="md:hidden">
            <Link href="/">
                <Wordmark />
            </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
            {isAuthenticated ? (
                <UserNav />
            ) : (
                <nav className="flex items-center gap-2">
                    <Button asChild variant="ghost" className="hover:bg-transparent hover:text-primary">
                        <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                </nav>
            )}
        </div>
      </div>
    </header>
  );
}
