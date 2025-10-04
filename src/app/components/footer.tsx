import Link from "next/link";
import { Wordmark } from "@/app/components/logo";
import { Twitter, Facebook, Instagram } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-card border-t py-6">
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <Wordmark />
                    <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
                        <Link href="#about" className="text-muted-foreground hover:text-foreground">About</Link>
                        <Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
                        <Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link>
                        <Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <Link href="#" aria-label="Twitter">
                        <Twitter className="size-5 text-muted-foreground hover:text-foreground" />
                    </Link>
                    <Link href="#" aria-label="Facebook">
                        <Facebook className="size-5 text-muted-foreground hover:text-foreground" />
                    </Link>
                    <Link href="#" aria-label="Instagram">
                        <Instagram className="size-5 text-muted-foreground hover:text-foreground" />
                    </Link>
                </div>
            </div>
            <div className="container mx-auto px-4 md:px-6 mt-4 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} Tabdeel Hub. All rights reserved.
            </div>
        </footer>
    )
}
