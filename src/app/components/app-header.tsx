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
                    <Button asChild variant="ghost" className="hover:bg-transparent text-primary relative overflow-hidden transition-all duration-300 ease-in-out before:absolute before:inset-0 before:z-[-1] before:block before:translate-x-[-100%] before:bg-primary before:transition-transform before:duration-300 before:ease-in-out hover:before:translate-x-0 hover:text-primary-foreground">
                        <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild variant="ghost" className="hover:bg-transparent text-accent relative overflow-hidden transition-all duration-300 ease-in-out before:absolute before:inset-0 before:z-[-1] before:block before:translate-x-[-100%] before:bg-accent before:transition-transform before:duration-300 before:ease-in-out hover:before:translate-x-0 hover:text-accent-foreground">
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                </nav>
            )}
        </div>
      </div>
    </header>
  );
}
