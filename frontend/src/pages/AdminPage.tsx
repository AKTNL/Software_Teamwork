import { Outlet, Link } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import styles from './AdminPage.module.css';

export default function AdminPage() {
  return (
    <div className={styles.panel}>
      <AdminSidebar />
      <main className={styles.content}>
        <Link to="/chat" className={styles.backLink}>← 返回对话</Link>
        <Outlet />
      </main>
    </div>
  );
}
