import { useState } from 'react';

const STEPS = [
  { id: 0, label: '用户提问', desc: '用户输入：「新员工报销流程是什么？」', icon: '💬' },
  { id: 1, label: '向量化 Query', desc: 'Embedding 模型将问题转为 1536 维向量', icon: '🔢' },
  { id: 2, label: '向量检索', desc: '在知识库中计算余弦相似度，召回 Top-3 段落', icon: '🔍' },
  { id: 3, label: '构建 Prompt', desc: '将问题 + 检索结果拼接为最终 Prompt', icon: '📝' },
  { id: 4, label: '生成回答', desc: '大模型基于检索内容生成准确答案，不依赖训练记忆', icon: '✅' },
];

export default function RagDemo() {
  const [current, setCurrent] = useState(0);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setCurrent(0);
    for (let i = 0; i <= 4; i++) {
      await new Promise(r => setTimeout(r, 900));
      setCurrent(i);
    }
    setRunning(false);
  };

  return (
    <div style={{ background: '#0f172a', borderRadius: 12, padding: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        {STEPS.map((step, i) => (
          <div key={step.id} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '10px 14px', borderRadius: 8,
            background: current >= i ? '#1e3a5f' : '#111827',
            border: `1px solid ${current >= i ? '#3b82f6' : '#1f2937'}`,
            opacity: current >= i ? 1 : 0.4,
            transition: 'all 0.4s',
          }}>
            <span style={{ fontSize: 18 }}>{step.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: current >= i ? '#93c5fd' : '#64748b' }}>
                {step.label}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={run}
        disabled={running}
        style={{
          padding: '8px 20px', borderRadius: 6, border: '1px solid #3b82f6',
          background: running ? '#1e3a5f88' : '#1e3a5f',
          color: '#93c5fd', cursor: running ? 'not-allowed' : 'pointer', fontSize: 13,
        }}
      >
        {running ? '运行中…' : '▶ 运行 RAG 流程'}
      </button>
    </div>
  );
}
