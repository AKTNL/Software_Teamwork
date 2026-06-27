export default function PromptManagement() {
  return (
    <div>
      <h3 style={{ font: 'var(--font-heading-3)', color: 'var(--color-charcoal)', marginBottom: 'var(--spacing-md)' }}>
        提示词管理
      </h3>
      <p style={{ color: 'var(--color-steel)' }}>
        管理 LLM 的 System Prompt、意图识别 Prompt 和 RAG 检索 Prompt 模板。
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
        💬 提示词管理模块 — 待实现
      </div>
    </div>
  );
}
