import HeroSlider from "@/components/HeroSlider";
import ProductsSection from "@/components/ProductsSection";
import PaymentSection from "@/components/PaymentSection";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - var(--nav-height))',
      paddingBottom: '4rem',
    }}>
      <HeroSlider />
      <ProductsSection title="Produk Terbaru" />
      <div style={{ padding: '0 2rem' }}>
        <hr style={{ border: 'none', borderTop: '1px solid #eaeaea', margin: '1rem auto', maxWidth: 'var(--container-width)' }} />
      </div>
      <ProductsSection title="Produk Terlaris" reverse={true} />
      <PaymentSection />
      <AboutSection />
    </main>
  );
}
