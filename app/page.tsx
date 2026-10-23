import Footer from "@/components/selen/Footer";
import Contact from "@/components/yagmur/Contact";
import About from "@/components/meryem/About";
import Team from "@/components/zeynep/Team";
import Events from "@/components/gizem/Events";
import Hero from "@/components/nisa/Hero";
import SiteHeader from "@/components/nisa/SiteHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F3EC] text-[#171916]">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Events />
        <Team />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
