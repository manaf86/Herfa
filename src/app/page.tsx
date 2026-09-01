import SiteHeader from "../components/shared/SiteHeader";
import Hero from "../components/Hero";
import TrustBar from "../components/TrustBar";
import Categories from "../components/Categories";
import HowItWorks from "../components/HowItWorks";
import WhyHerfa from "../components/WhyHerfa";
import Infographic from "../components/Infographic";
import Comparison from "../components/Comparison";
import Testimonials from "../components/Testimonials";
import ForBusiness from "../components/ForBusiness";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <SiteHeader variant="marketing" />
      <main>
        <Hero />
        <TrustBar />
        <Categories />
        <HowItWorks />
        <WhyHerfa />
        <Infographic />
        <Comparison />
        <Testimonials />
        <ForBusiness />
      </main>
      <Footer />
    </>
  );
}
