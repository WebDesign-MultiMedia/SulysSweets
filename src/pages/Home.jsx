import { useEffect, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import GallerySection from "../components/GallerySection";
import MenuSection from "../components/MenuSection";
import InstagramSection from "../components/InstagramSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import VantaBackground from "../components/VantaBackground";

const MOBILE_BREAKPOINT = 768;

export default function Home() {
  const [mobilePage, setMobilePage] = useState("home");

  // Force back to the top whenever the visible mobile "page" changes. The
  // double rAF waits for the browser to actually commit the new section's
  // layout before scrolling (see index.css for the matching overflow-anchor
  // fix — without it, scroll anchoring quietly tugs this back down again).
  // The trailing timeout re-asserts it once more shortly after, in case a
  // slower-loading image or font swap shifts layout after the rAFs fire.
  useEffect(() => {
    if (window.innerWidth >= MOBILE_BREAKPOINT) return;
    const toTop = () => window.scrollTo({ top: 0, behavior: "auto" });
    const rafId = requestAnimationFrame(() => requestAnimationFrame(toTop));
    const timeoutId = setTimeout(toTop, 150);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [mobilePage]);

  const handleNavigate = (id, e) => {
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      e.preventDefault();
      setMobilePage(id);
    }
  };

  const pageClass = (id) => (mobilePage === id ? "block" : "hidden md:block");

  return (
    <div>
      <VantaBackground />
      <Header activePage={mobilePage} onNavigate={handleNavigate} />
      <main>
        <div className={pageClass("home")}>
          <Hero onNavigate={handleNavigate} />
        </div>
        <div className={pageClass("about")}>
          <About />
        </div>
        <div className={pageClass("gallery")}>
          <GallerySection />
        </div>
        <div className={pageClass("menu")}>
          <MenuSection />
        </div>
        <div className={pageClass("contact")}>
          <InstagramSection />
          <ContactSection />
        </div>
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
