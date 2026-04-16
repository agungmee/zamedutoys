import { getProducts } from '@/app/actions/admin';
import { getBanners } from '@/app/actions/banner';
import { getCategories } from '@/app/actions/category';
import HeroSlider from "@/components/HeroSlider";
import ProductsSection from "@/components/ProductsSection";
import PaymentSection from "@/components/PaymentSection";
import AboutSection from "@/components/AboutSection";
import CategoryIcons from "@/components/CategoryIcons";

export const metadata = {
  title: 'Beranda',
  description: 'ZAM Edutoys hadir dengan berbagai mainan edukasi yang aman, kuat, dan dirancang khusus untuk melatih perkembangan anak sejak usia dini.',
  openGraph: {
    title: 'ZAM Edutoys | Produsen Mainan Edukasi Premium',
    description: 'Jelajahi koleksi mainan edukasi kayu terbaru kami. Didesain untuk merangsang kreativitas dan keterampilan motorik anak.',
  }
};

export default async function Home() {
  const products = await getProducts();
  const banners = await getBanners();
  const categories = await getCategories();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '4rem',
    }}>
      <HeroSlider initialBanners={banners} />
      <CategoryIcons categories={categories} />
      <div style={{ padding: '0 2rem' }}>
        <hr style={{ border: 'none', borderTop: '1px solid #eaeaea', margin: '0 auto', maxWidth: 'var(--container-width)' }} />
      </div>
      <ProductsSection title="Produk Terbaru" />
      <div style={{ padding: '0 2rem' }}>
        <hr style={{ border: 'none', borderTop: '1px solid #eaeaea', margin: '1rem auto', maxWidth: 'var(--container-width)' }} />
      </div>
      <ProductsSection title="Produk Terlaris" reverse={true} />
      <PaymentSection />
      <AboutSection />
    </div>
  );
}

