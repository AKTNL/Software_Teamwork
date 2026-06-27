import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { AdminMenuItem } from '../../types';
import styles from './AdminSidebar.module.css';

const menuItems: AdminMenuItem[] = [
  {
    key: 'system',
    label: '系统管理',
    children: [
      { key: 'users', label: '用户管理', path: '/admin/users' },
      { key: 'roles', label: '角色管理', path: '/admin/roles' },
      { key: 'styles', label: '样式管理', path: '/admin/styles' },
      { key: 'report-categories', label: '报告类别', path: '/admin/report-categories' },
      { key: 'files', label: '文件管理', path: '/admin/files' },
    ],
  },
  {
    key: 'templates',
    label: '模板管理',
    path: '/admin/templates',
  },
  {
    key: 'materials',
    label: '材料管理',
    path: '/admin/materials',
  },
  {
    key: 'prompts',
    label: '提示词管理',
    path: '/admin/prompts',
  },
  {
    key: 'rag',
    label: 'RAG 知识库',
    children: [
      { key: 'knowledge', label: '知识管理', path: '/admin/knowledge' },
      { key: 'knowledge-experience', label: '知识体验', path: '/admin/knowledge-experience' },
    ],
  },
  {
    key: 'settings',
    label: '系统设置',
    path: '/admin/settings',
  },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['system', 'rag']));

  const toggle = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderItem = (item: AdminMenuItem) => {
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      const open = expanded.has(item.key);
      return (
        <div key={item.key} className={styles.group}>
          <button
            className={`${styles.groupTitle} ${open ? styles.groupOpen : ''}`}
            onClick={() => toggle(item.key)}
          >
            <span className={styles.arrow}>{open ? '▼' : '▶'}</span>
            <span>{item.label}</span>
          </button>
          {open && (
            <div className={styles.groupChildren}>
              {item.children!.map((child) => (
                <button
                  key={child.key}
                  className={`${styles.childItem} ${isActive(child.path) ? styles.active : ''}`}
                  onClick={() => child.path && navigate(child.path)}
                >
                  {child.label}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.key}
        className={`${styles.singleItem} ${isActive(item.path) ? styles.active : ''}`}
        onClick={() => item.path && navigate(item.path)}
      >
        {item.label}
      </button>
    );
  };

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>管理面板</h2>
      <nav className={styles.nav}>
        {menuItems.map(renderItem)}
      </nav>
    </aside>
  );
}
