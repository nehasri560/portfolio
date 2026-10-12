import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import Certifications from "./sections/Certifications";
import Experience from "./sections/Experience";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import RevealObserver from "./ui/RevealObserver";
import { SmoothScroll } from "@/lib/scroll";

export default function App() {
  return (
    <SmoothScroll>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <RevealObserver />
      <Navigation />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Work />
        <Certifications />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <style href="app" precedence="default">{`
        .skip-link{position:fixed;left:16px;top:-80px;z-index:100;background:var(--ink);color:#fff;padding:12px 18px;border-radius:999px;font-size:14px;transition:top .4s var(--ease)}
        .skip-link:focus{top:16px}
      `}</style>
    </SmoothScroll>
  );
}
