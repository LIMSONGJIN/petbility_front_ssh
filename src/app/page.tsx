import BestProductsSection from "@/components/Home/BestProductsSection";
import HeroSection from "@/components/Home/HeroSection";
import MemorialSection from "@/components/Home/MemorialSection";
import ServiceList from "@/components/Home/ServiceList";

export default function Home() {
  return (
    <div className="bg-violet-200 h-full flex flex-col gap-8 pb-20">
      <HeroSection />
      <ServiceList />
      <MemorialSection />
      <BestProductsSection />
    </div>
  );
}
