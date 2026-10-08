import Footer from "@/components/selen/Footer";
import Contact from "@/components/yagmur/Contact";
import About from "@/components/meryem/About";
import Team from "@/components/zeynep/Team";
import Events from "@/components/gizem/Events";
import Hero from "@/components/nisa/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:px-8">
        <Hero />
        <About />
        <Events />
        <Team />
        <Contact />
      </main>
      <footer className="mx-auto max-w-6xl px-4 pb-10 md:px-8">
        <Footer />
      </footer>
    </div>
  );
}