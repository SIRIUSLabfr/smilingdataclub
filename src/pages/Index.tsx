import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TopicsSection from "@/components/TopicsSection";
import CodeSection from "@/components/CodeSection";
import WaitlistSection from "@/components/WaitlistSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen scanlines relative">
      <HeroSection />
      <AboutSection />
      <TopicsSection />
      <CodeSection />
      <WaitlistSection />
      <FooterSection />
    </div>
  );
};

export default Index;
