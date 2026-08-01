import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import MenuSection from "./components/MenuSection";
import InstagramSection from "./components/InstagramSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

const MOBILE_BREAKPOINT = 768;

export default function App() {
  const [mobilePage, setMobilePage] = useState("home");

  // Runs after the new page's content has actually mounted, so the browser's
  // scroll-anchoring can't tug the position away from the top afterward.
  useEffect(() => {
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
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
      <Header activePage={mobilePage} onNavigate={handleNavigate} />
      <main>
        <div className={pageClass("home")}>
          <Hero onNavigate={handleNavigate} />
        </div>
        <div className={pageClass("about")}>
          <About />
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
