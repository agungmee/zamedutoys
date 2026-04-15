import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import styles from './admin.module.css';

export const metadata = {
  title: 'Admin Dashboard — ZAM Edutoys',
};

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Jika tidak ada user (misal di halaman login), jangan tampilkan sidebar
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className={styles.adminShell}>
      <AdminSidebar userEmail={user.email} />
      <main className={styles.adminMain}>
        {children}
      </main>
    </div>
  );
}

