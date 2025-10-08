'use client';

import { Hero } from "@/app/components/hero";
import { AboutUs } from "@/app/components/about-us";
import { HowItWorks } from "@/app/components/how-it-works";
import { Testimonials } from "@/app/components/testimonials";
import { Faq } from "@/app/components/faq";
import { Footer } from "@/app/components/footer";
import { AppHeader } from "./components/app-header";
import { ScrollFadeIn } from "./components/scroll-fade-in";
import { useUser } from "@/firebase";

export default function Home() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader isAuthenticated={!!user} />
      <main className="flex-1">
        <Hero />
        
        <div className="h-[200vh]">
          <AboutUs />
        </div>
        
        <div className="relative z-10 -mt-[100vh]">
           <HowItWorks />
        </div>

        <div className="relative z-20 bg-background">
          <ScrollFadeIn delay={0.2}>
            <Testimonials />
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.2}>
            <Faq />
          </ScrollFadeIn>
        </div>

      </main>
      <Footer />
    </div>
  );
}
