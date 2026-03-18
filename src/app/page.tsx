import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AtAGlance from "@/components/AtAGlance";
import About from "@/components/About";
import Expertise from "@/components/Expertise";
import BeforeAfter from "@/components/BeforeAfter";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <AtAGlance />
      <About />
      <Expertise />
      <BeforeAfter />
      <FAQ />
      <Footer />
    </>
  );
}


