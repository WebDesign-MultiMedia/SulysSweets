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
import Marquee from "../components/Marquee";
import useMatchMedia from "../hooks/useMatchMedia";

const MOBILE_BREAKPOINT = 768;

export default function Home() {
  const [mobilePage, setMobilePage] = useState("home");
  const isDesktop = useMatchMedia(`(min-width: ${MOBILE_BREAKPOINT}px)`);
  // On phones each section is its own "page". Sections are only mounted
  // once visited, so their photos aren't downloaded up front (hidden
  // lazy images still load). Once mounted they stay, keeping form input.
  const [visited, setVisited] = useState(() => new Set(["home"]));

  // Backup in case mobilePage is ever set from somewhere other than
  // handleNavigate below. `behavior: "instant"` is required here — "auto"
  // does *not* mean instant, it defers to the element's CSS scroll-behavior,
  // which is globally "smooth" on this site (see index.css). An "auto"
  // scroll was silently turning this into an animated scroll that could get
  // interrupted or cut short, landing the page mid-scroll instead of at 0.
  useEffect(() => {
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [mobilePage]);

  const handleNavigate = (id, e) => {
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      e.preventDefault();
      // Instant scroll, before swapping sections, while the old section is
      // still on screen — see the effect above for why "instant" and not
      // "auto" matters here.
      window.scrollTo({ top: 0, behavior: "instant" });
      setMobilePage(id);
      setVisited((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
    }
  };

  const pageClass = (id) => (mobilePage === id ? "block" : "hidden md:block");
  const show = (id) => isDesktop || visited.has(id);

  return (
    <div>
      <VantaBackground />
      <Header activePage={mobilePage} onNavigate={handleNavigate} />
      <main>
        <div className={pageClass("home")}>
          <Hero onNavigate={handleNavigate} />
          <Marquee />
        </div>
        <div className={pageClass("about")}>{show("about") && <About />}</div>
        <div className={pageClass("gallery")}>{show("gallery") && <GallerySection />}</div>
        <div className={pageClass("menu")}>{show("menu") && <MenuSection />}</div>
        <div className={pageClass("contact")}>
          {show("contact") && (
            <>
              <InstagramSection />
              <ContactSection />
            </>
          )}
        </div>
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
