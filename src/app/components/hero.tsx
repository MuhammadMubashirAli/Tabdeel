import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

  return (
    <section className="relative w-full h-screen text-foreground flex items-center justify-center">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover object-center md:object-bottom -z-10 brightness-50"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="container mx-auto flex h-full flex-col items-center justify-center text-center p-4">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-white">
              Swap your stuff, not your money.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-200">
              Find new homes for things you don’t need, and take home what you want — all through direct exchanges.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="ghost" className="border border-accent hover:bg-transparent text-accent relative overflow-hidden transition-all duration-300 ease-in-out before:absolute before:inset-0 before:z-[-1] before:block before:translate-x-[-100%] before:bg-accent before:transition-transform before:duration-300 before:ease-in-out hover:before:translate-x-0 hover:text-accent-foreground">
              <Link href="/explore">Explore Items</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="border border-primary hover:bg-transparent text-primary relative overflow-hidden transition-all duration-300 ease-in-out before:absolute before:inset-0 before:z-[-1] before:block before:translate-x-[-100%] before:bg-primary before:transition-transform before:duration-300 before:ease-in-out hover:before:translate-x-0 hover:text-primary-foreground">
              <Link href="/signup">Sign In / Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
