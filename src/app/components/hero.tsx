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
          className="object-cover object-bottom -z-10 brightness-50"
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
