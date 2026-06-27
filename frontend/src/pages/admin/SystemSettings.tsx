export default function SystemSettings() {
  return (
    <div>
      <h3 style={{ font: 'var(--font-heading-3)', color: 'var(--color-charcoal)', marginBottom: 'var(--spacing-md)' }}>
        系统设置
      </h3>
      <p style={{ color: 'var(--color-steel)' }}>
        全局系统配置，包括 LLM API 连接、向量数据库连接、系统参数等。
      </p>

      {/* LLM Config section */}
      <div style={{
        marginTop: 'var(--spacing-xl)',
        padding: 'var(--spacing-xl)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--rounded-lg)',
        border: '1px solid var(--color-hairline)',
      }}>
        <h4 style={{ font: 'var(--font-heading-5)', color: 'var(--color-charcoal)', marginBottom: 'var(--spacing-lg)' }}>
          LLM 配置
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <div>
            <label style={{ font: 'var(--font-body-sm-medium)', color: 'var(--color-charcoal)', display: 'block', marginBottom: 'var(--spacing-xxs)' }}>
              API 地址
            </label>
            <input
              type="text"
              placeholder="https://api.openai.com/v1"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: 'var(--rounded-md)',
                font: 'var(--font-body-md)',
              }}
            />
          </div>
          <div>
            <label style={{ font: 'var(--font-body-sm-medium)', color: 'var(--color-charcoal)', display: 'block', marginBottom: 'var(--spacing-xxs)' }}>
              模型名称
            </label>
            <input
              type="text"
              placeholder="gpt-4o"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: 'var(--rounded-md)',
                font: 'var(--font-body-md)',
              }}
            />
          </div>
          <div>
            <label style={{ font: 'var(--font-body-sm-medium)', color: 'var(--color-charcoal)', display: 'block', marginBottom: 'var(--spacing-xxs)' }}>
              API 密钥
            </label>
            <input
              type="password"
              placeholder="sk-••••••••"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: 'var(--rounded-md)',
                font: 'var(--font-body-md)',
              }}
            />
          </div>
          <div>
            <label style={{ font: 'var(--font-body-sm-medium)', color: 'var(--color-charcoal)', display: 'block', marginBottom: 'var(--spacing-xxs)' }}>
              超时时间（秒）
            </label>
            <input
              type="number"
              placeholder="30"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: 'var(--rounded-md)',
                font: 'var(--font-body-md)',
              }}
            />
          </div>
        </div>
        <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button style={{
            padding: '10px 20px',
            background: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
            borderRadius: 'var(--rounded-md)',
            font: 'var(--font-button)',
          }}>
            保存配置
          </button>
          <button style={{
            padding: '10px 20px',
            background: 'transparent',
            color: 'var(--color-ink)',
            borderRadius: 'var(--rounded-md)',
            border: '1px solid var(--color-hairline-strong)',
            font: 'var(--font-button)',
          }}>
            测试连接
          </button>
        </div>
      </div>
    </div>
  );
}
