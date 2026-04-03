import { useState, useEffect, useRef } from 'react';

const EPOCHS = 20;

function generateLoss(epochs: number): number[] {
  const losses = [];
  for (let i = 0; i < epochs; i++) {
    losses.push(2.8 * Math.exp(-i * 0.18) + 0.15 + (Math.random() - 0.5) * 0.1);
  }
  return losses;
}

export default function TrainingDemo() {
  const losses = useRef(generateLoss(EPOCHS));
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [running, setRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    for (let y = 0; y <= 4; y++) {
      const yPos = H - (y / 4) * (H - 20) - 10;
      ctx.beginPath(); ctx.moveTo(40, yPos); ctx.lineTo(W - 10, yPos); ctx.stroke();
      ctx.fillStyle = '#475569';
      ctx.font = '10px monospace';
      ctx.fillText((y * 0.75).toFixed(2), 4, yPos + 4);
    }

    if (currentEpoch > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      for (let i = 0; i < currentEpoch; i++) {
        const x = 40 + (i / (EPOCHS - 1)) * (W - 50);
        const y = H - ((losses.current[i] / 3) * (H - 20)) - 10;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      const lastX = 40 + ((currentEpoch - 1) / (EPOCHS - 1)) * (W - 50);
      const lastY = H - ((losses.current[currentEpoch - 1] / 3) * (H - 20)) - 10;
      ctx.beginPath();
      ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#60a5fa';
      ctx.fill();
    }
  }, [currentEpoch]);

  const run = async () => {
    losses.current = generateLoss(EPOCHS);
    setRunning(true);
    setCurrentEpoch(0);
    for (let i = 1; i <= EPOCHS; i++) {
      await new Promise(r => setTimeout(r, 200));
      setCurrentEpoch(i);
    }
    setRunning(false);
  };

  const loss = currentEpoch > 0 ? losses.current[currentEpoch - 1] : null;

  return (
    <div style={{ background: '#0f172a', borderRadius: 12, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 12, color: '#64748b' }}>
        <span>训练损失（Loss）曲线</span>
        {loss !== null && (
          <span style={{ color: '#93c5fd' }}>
            Epoch {currentEpoch}/{EPOCHS} · Loss: {loss.toFixed(4)}
          </span>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={520} height={180}
        style={{ width: '100%', height: 180, borderRadius: 6, background: '#070d1a' }}
      />
      <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          onClick={run}
          disabled={running}
          style={{
            padding: '8px 20px', borderRadius: 6, border: '1px solid #818cf8',
            background: running ? '#312e8188' : '#312e81',
            color: '#a5b4fc', cursor: running ? 'not-allowed' : 'pointer', fontSize: 13,
          }}
        >
          {running ? '训练中…' : '▶ 开始训练'}
        </button>
        {currentEpoch === EPOCHS && (
          <span style={{ fontSize: 12, color: '#34d399' }}>✓ 训练完成，模型收敛</span>
        )}
      </div>
    </div>
  );
}
