export default function ReportCategory() {
  return (
    <div>
      <h3 style={{ font: 'var(--font-heading-3)', color: 'var(--color-charcoal)', marginBottom: 'var(--spacing-md)' }}>
        报告类别
      </h3>
      <p style={{ color: 'var(--color-steel)' }}>
        管理问答报告的分类体系，支持自定义报告类型和模板。
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
        📋 报告类别模块 — 待实现
      </div>
    </div>
  );
}
