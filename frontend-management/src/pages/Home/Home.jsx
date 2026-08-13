import Hero from "../../components/Hero/Hero";
import SectionDivider from "../../components/Common/SectionDivider";
import FeaturedEvents from "../../components/FeaturedEvents/FeaturedEvents";
import WhyRunSection from "../../components/WhyRun/WhyRunSection";
import EnduranceSection from "../../components/Endurance/EnduranceSection";
import NewsletterSection from "../../components/Newsletter/NewsletterSection";

export default function Home() {
  return (
    <div className="home-page">
      <Hero />
      <SectionDivider />
      <FeaturedEvents />
      <SectionDivider />
      <WhyRunSection />
      <SectionDivider />
      <EnduranceSection />
      <NewsletterSection />
    </div>
  );
}
