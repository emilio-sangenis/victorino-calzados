import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Benefits from "@/components/home/Benefits";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-300 text-neutral-900">
     <Header />
     <Hero />
     <FeaturedProducts />
     <Benefits />
     <Footer />

    </main>
  );
}
