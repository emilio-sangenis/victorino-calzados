import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Benefits from "@/components/home/Benefits";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-100 text-neutral-900">
     <Header />
     <Hero />
     <Categories />
     <FeaturedProducts />
     <Benefits />
     <Footer />

    </main>
  );
}