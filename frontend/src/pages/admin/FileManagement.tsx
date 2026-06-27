export default function FileManagement() {
  return (
    <div>
      <h3 style={{ font: 'var(--font-heading-3)', color: 'var(--color-charcoal)', marginBottom: 'var(--spacing-md)' }}>
        文件管理
      </h3>
      <p style={{ color: 'var(--color-steel)' }}>
        管理系统中的文档文件，包括上传、分类、预览和删除操作。
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
        📁 文件管理模块 — 待实现
      </div>
    </div>
  );
}
