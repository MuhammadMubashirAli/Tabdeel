import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Wordmark } from "@/app/components/logo";

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] text-primary-foreground">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative container mx-auto flex h-full flex-col items-center justify-center text-center">
        <div className="bg-black/50 backdrop-blur-sm p-8 rounded-lg">
          <Wordmark />
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-white">
            Swap your stuff, not your money.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-neutral-200">
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
