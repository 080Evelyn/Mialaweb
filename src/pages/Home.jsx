import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import Navbar from "@/components/home/Navbar";
import OurMission from "@/components/home/OurMission";
import ProductList from "@/components/home/ProductList";
import Testimonial from "@/components/home/Testimonial";
import VideoProof from "@/components/home/VideoProof";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <OurMission />
      <VideoProof />
      <ProductList />
      <Testimonial />
      <Footer />
    </div>
  );
};

export default Home;
