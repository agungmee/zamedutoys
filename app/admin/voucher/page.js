import { getVouchers } from '@/app/actions/voucher';
import VoucherTable from './VoucherTable';
import styles from './voucher.module.css';

export const metadata = {
  title: 'Manajemen Voucher — ZAM Edutoys Admin',
};

export default async function AdminVoucherPage() {
  const vouchers = await getVouchers();

  return (
    <div className={styles.page}>
      <VoucherTable initialVouchers={vouchers} />
    </div>
  );
}
