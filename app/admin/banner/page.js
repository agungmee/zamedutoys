import { getBanners } from '@/app/actions/banner';
import BannerList from './BannerList';
import styles from './banner.module.css';

export const metadata = {
  title: 'Kelola Banner — ZAM Edutoys Admin',
};

export default async function BannerAdminPage() {
  const banners = await getBanners(false); // Fetch all, including inactive

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Kelola Banner Hero</h1>
        <p className={styles.subtitle}>Atur gambar promo dan slide utama di halaman depan.</p>
      </header>

      <BannerList initialBanners={banners} />
    </div>
  );
}
