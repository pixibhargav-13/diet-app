import { useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../sections/HeroSection";
import ProductSection from "../sections/ProductSection";
import SolutionSection from "../sections/SolutionSection";
import PlatformSection from "../sections/PlatformSection";
import ResourceSection from "../sections/ResourceSection";
import Footer from "../components/Footer";
import ScrollTopButton from "../components/ScrollTopButton";

function LandingPage() {
  useEffect(() => {
    const hash = globalThis.location.hash.replace("#", "");
    if (!hash) {
      return;
    }

    const scrollToHash = () => {
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const timeoutId = globalThis.setTimeout(scrollToHash, 0);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <Navbar />
      <HeroSection />
      <PlatformSection />
      <SolutionSection />
      <ResourceSection />
      <ProductSection />
      <Footer />
      <ScrollTopButton />
    </>
  );
}

export default LandingPage;
