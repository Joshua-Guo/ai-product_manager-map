import { useState } from 'react';

const LOOP = [
  { type: 'thought', label: '思考', content: '用户问的是北京今天天气，我需要调用天气工具查询' },
  { type: 'action', label: '行动', content: 'get_weather(city="北京", date="today")' },
  { type: 'observation', label: '观察', content: '工具返回：北京，晴，18°C，东风2级' },
  { type: 'thought', label: '思考', content: '已获得天气信息，可以直接回答用户了' },
  { type: 'answer', label: '最终回答', content: '北京今天晴天，气温18°C，东风2级，适合出行！' },
];

const TYPE_COLORS: Record<string, string> = {
  thought: '#818cf8', action: '#fb923c', observation: '#34d399', answer: '#f472b6',
};

export default function ReActDemo() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setStep(-1);
    for (let i = 0; i < LOOP.length; i++) {
      await new Promise(r => setTimeout(r, 1000));
      setStep(i);
    }
    setRunning(false);
  };

  return (
    <div style={{ background: '#0f172a', borderRadius: 12, padding: 24 }}>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
        任务：「北京今天天气怎么样？」
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20, minHeight: 240 }}>
        {LOOP.map((item, i) => (
          <div key={i} style={{
            display: 'flex', gap: 10, alignItems: 'flex-start',
            opacity: step >= i ? 1 : 0.15,
            transform: step >= i ? 'translateX(0)' : 'translateX(-8px)',
            transition: 'all 0.4s',
          }}>
            <div style={{
              padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
              background: TYPE_COLORS[item.type] + '22', color: TYPE_COLORS[item.type],
              marginTop: 2,
            }}>
              {item.label}
            </div>
            <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, fontFamily: item.type === 'action' ? 'monospace' : 'inherit' }}>
              {item.content}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={run}
        disabled={running}
        style={{
          padding: '8px 20px', borderRadius: 6, border: '1px solid #fb923c',
          background: running ? '#7c2d1288' : '#7c2d12',
          color: '#fdba74', cursor: running ? 'not-allowed' : 'pointer', fontSize: 13,
        }}
      >
        {running ? '运行中…' : '▶ 运行 ReAct 循环'}
      </button>
    </div>
  );
}
