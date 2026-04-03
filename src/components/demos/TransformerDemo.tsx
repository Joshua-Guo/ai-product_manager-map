import { useState } from 'react';

const TOKENS = ['我', '爱', '学', '习', 'AI'];
const ATTENTION = [
  [0.6, 0.1, 0.1, 0.1, 0.1],
  [0.2, 0.5, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.5, 0.2, 0.1],
  [0.1, 0.1, 0.2, 0.4, 0.2],
  [0.05, 0.05, 0.2, 0.3, 0.4],
];

export default function TransformerDemo() {
  const [activeRow, setActiveRow] = useState(4);

  return (
    <div style={{ background: '#0f172a', borderRadius: 12, padding: 24, fontFamily: 'monospace' }}>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
        点击 Token 查看它对其他词的注意力权重 ↓
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {TOKENS.map((tok, i) => (
          <div
            key={i}
            onClick={() => setActiveRow(i)}
            style={{
              padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
              border: `1px solid ${activeRow === i ? '#3b82f6' : '#1f2937'}`,
              background: activeRow === i ? '#1e3a5f' : '#111827',
              color: activeRow === i ? '#93c5fd' : '#94a3b8',
              fontWeight: activeRow === i ? 600 : 400,
              fontSize: 16, transition: 'all 0.2s',
            }}
          >
            {tok}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
        「{TOKENS[activeRow]}」的注意力分布：
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        {TOKENS.map((tok, j) => {
          const weight = ATTENTION[activeRow][j];
          return (
            <div key={j} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{(weight * 100).toFixed(0)}%</div>
              <div style={{
                width: 44, borderRadius: 4,
                height: Math.max(8, weight * 120),
                background: `rgba(59,130,246,${0.2 + weight * 0.8})`,
                border: '1px solid rgba(59,130,246,0.4)',
                transition: 'height 0.3s, background 0.3s',
              }} />
              <div style={{ fontSize: 14, color: '#e2e8f0' }}>{tok}</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 16, fontSize: 11, color: '#475569' }}>
        柱越高 = 注意力越强。生成「{TOKENS[activeRow]}」时，模型最关注「{TOKENS[ATTENTION[activeRow].indexOf(Math.max(...ATTENTION[activeRow]))]}」
      </div>
    </div>
  );
}
