import Header from "../components/Header";
import Hero from "../components/Hero";
import TrustBar from "../components/TrustBar";
import Categories from "../components/Categories";
import HowItWorks from "../components/HowItWorks";
import WhyHerfa from "../components/WhyHerfa";
import Comparison from "../components/Comparison";
import Testimonials from "../components/Testimonials";
import ForBusiness from "../components/ForBusiness";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Categories />
        <HowItWorks />
        <WhyHerfa />
        <Comparison />
        <Testimonials />
        <ForBusiness />
      </main>
      <Footer />
    </>
  );
}
