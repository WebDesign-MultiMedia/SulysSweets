import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import MenuSection from "./components/MenuSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <About />
        <MenuSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
