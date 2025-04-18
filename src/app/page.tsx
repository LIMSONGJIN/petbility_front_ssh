import BestProductsSection from "@/components/Home/BestProductsSection";
import HeroSection from "@/components/Home/HeroSection";
import MemorialSection from "@/components/Home/MemorialSection";
import ServiceList from "@/components/Home/ServiceList";
import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";

export default function Home() {
  return (
    <>
      <Header />
      <div className="pt-[68px] h-full flex flex-col gap-8 md:gap-72 pb-20">
        <HeroSection />
        <ServiceList />
        <MemorialSection />
        <BestProductsSection />
      </div>
      <Footer />
    </>
  );
}
