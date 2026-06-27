export default function RoleManagement() {
  return (
    <div>
      <h3 style={{ font: 'var(--font-heading-3)', color: 'var(--color-charcoal)', marginBottom: 'var(--spacing-md)' }}>
        角色管理
      </h3>
      <p style={{ color: 'var(--color-steel)' }}>
        定义系统角色（管理员、超级管理员等）及其对应的权限矩阵。
      </p>
      <div style={{
        marginTop: 'var(--spacing-xl)',
        padding: 'var(--spacing-xxl)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--rounded-lg)',
        textAlign: 'center',
        color: 'var(--color-muted)',
        border: '1px dashed var(--color-hairline-strong)',
      }}>
        🔑 角色管理模块 — 待实现
      </div>
    </div>
  );
}
