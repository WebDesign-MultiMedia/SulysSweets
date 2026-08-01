import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MenuSection from "@/components/MenuSection";
import PolicySection from "@/components/PolicySection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div id="top">
      <Header />
      <main>
        <Hero />
        <MenuSection />
        <PolicySection />
      </main>
      <Footer />
    </div>
  );
}
