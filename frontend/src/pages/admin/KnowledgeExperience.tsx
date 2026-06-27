export default function KnowledgeExperience() {
  return (
    <div>
      <h3 style={{ font: 'var(--font-heading-3)', color: 'var(--color-charcoal)', marginBottom: 'var(--spacing-md)' }}>
        知识体验
      </h3>
      <p style={{ color: 'var(--color-steel)' }}>
        以对话形式测试知识库的检索效果，验证检索结果的相关性和准确性。
      </p>
      {/* Retrieval test area */}
      <div style={{
        marginTop: 'var(--spacing-xl)',
        padding: 'var(--spacing-xl)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--rounded-lg)',
        border: '1px solid var(--color-hairline)',
      }}>
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <label style={{ font: 'var(--font-body-sm-medium)', color: 'var(--color-charcoal)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
            检索测试
          </label>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <input
              type="text"
              placeholder="输入测试问题…"
              style={{
                flex: 1,
                padding: '10px 14px',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: 'var(--rounded-md)',
                font: 'var(--font-body-md)',
              }}
            />
            <button style={{
              padding: '10px 20px',
              background: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              borderRadius: 'var(--rounded-md)',
              font: 'var(--font-button)',
            }}>
              检索
            </button>
          </div>
        </div>
        {/* Placeholder results */}
        <div style={{
          padding: 'var(--spacing-xl)',
          textAlign: 'center',
          color: 'var(--color-muted)',
          background: 'var(--color-canvas)',
          borderRadius: 'var(--rounded-md)',
          border: '1px dashed var(--color-hairline)',
        }}>
          🔍 检索结果将在此展示（来源文档、原文片段、相关性分数）
        </div>
      </div>
    </div>
  );
}
