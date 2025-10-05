import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroWordmark } from "@/app/components/logo";

export function Hero() {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] bg-card text-foreground flex items-center justify-center">
      <div className="relative container mx-auto flex h-full flex-col items-center justify-center text-center">
        <div className="p-8 rounded-lg">
          <HeroWordmark />
          <h1 className="mt-8 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-primary">
            Swap your stuff, not your money.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Find new homes for things you don’t need, and take home what you want — all through direct exchanges.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/explore">Explore Items</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/signup">Sign In / Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
