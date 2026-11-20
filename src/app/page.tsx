import { Nav } from "@/components/sections/Nav/Nav";
import { Hero } from "@/components/sections/Hero/Hero";
import { Problem } from "@/components/sections/Problem/Problem";
import { HowItWorks } from "@/components/sections/HowItWorks/HowItWorks";
import { MeetMira } from "@/components/sections/MeetMira/MeetMira";
import { Outcome } from "@/components/sections/Outcome/Outcome";
import { WhoItsFor } from "@/components/sections/WhoItsFor/WhoItsFor";
import { CtaSection, SiteFooter } from "@/components/sections/CtaFooter/CtaFooter";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Problem />
        <HowItWorks />
        <MeetMira />
        <Outcome />
        <WhoItsFor />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
