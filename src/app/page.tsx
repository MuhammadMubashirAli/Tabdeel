import { Hero } from "@/app/components/hero";
import { AboutUs } from "@/app/components/about-us";
import { HowItWorks } from "@/app/components/how-it-works";
import { Testimonials } from "@/app/components/testimonials";
import { Faq } from "@/app/components/faq";
import { Footer } from "@/app/components/footer";
import { AppHeader } from "./components/app-header";
import { ScrollFadeIn } from "./components/scroll-fade-in";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1">
        <Hero />
        
        <div>
          <AboutUs />
          <HowItWorks />
        </div>

        <ScrollFadeIn delay={0.2}>
          <Testimonials />
        </ScrollFadeIn>
        <ScrollFadeIn delay={0.2}>
          <Faq />
        </ScrollFadeIn>
      </main>
      <Footer />
    </div>
  );
}
