import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Node { id: string; title: string; layer: string; summary: string; order: number; }
interface Link { source: string; target: string; }
interface GraphData { nodes: Node[]; links: Link[]; }

const LAYER_COLORS: Record<string, string> = {
  L0: '#818cf8', L1: '#34d399', L2: '#fb923c', L3: '#e879f9',
};
const LAYER_LABELS: Record<string, string> = {
  L0: 'L0 基础层', L1: 'L1 应用层', L2: 'L2 Agent 层', L3: 'L3 进阶层',
};

export default function KnowledgeGraph({ data }: { data: GraphData }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<Node | null>(null);
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const w = window.innerWidth, h = window.innerHeight;
    const g = svg.append('g');

    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.2, 3])
        .on('zoom', e => g.attr('transform', e.transform))
    );

    const layerPositions: Record<string, [number, number]> = {
      L0: [w * 0.25, h * 0.35],
      L1: [w * 0.55, h * 0.35],
      L2: [w * 0.40, h * 0.65],
      L3: [w * 0.70, h * 0.55],
    };

    const layers = ['L0', 'L1', 'L2', 'L3'];
    layers.forEach(layer => {
      const [x, y] = layerPositions[layer];
      const isExpanded = expandedLayers.has(layer);

      if (!isExpanded) {
        g.append('circle')
          .attr('cx', x).attr('cy', y).attr('r', 60)
          .attr('fill', LAYER_COLORS[layer] + '22')
          .attr('stroke', LAYER_COLORS[layer])
          .attr('stroke-width', 2)
          .style('cursor', 'pointer')
          .on('click', () => {
            setExpandedLayers(prev => {
              const next = new Set(prev);
              next.has(layer) ? next.delete(layer) : next.add(layer);
              return next;
            });
          });

        g.append('text')
          .attr('x', x).attr('y', y + 5)
          .attr('text-anchor', 'middle')
          .attr('fill', LAYER_COLORS[layer])
          .attr('font-size', 13)
          .attr('font-weight', '600')
          .style('pointer-events', 'none')
          .text(LAYER_LABELS[layer]);
      }
    });

    const activeNodes = data.nodes.filter(n => expandedLayers.has(n.layer));
    const activeNodeIds = new Set(activeNodes.map(n => n.id));

    const layerNodePositions: Record<string, { x: number; y: number }> = {};
    const layerGroups: Record<string, Node[]> = {};
    activeNodes.forEach(n => {
      if (!layerGroups[n.layer]) layerGroups[n.layer] = [];
      layerGroups[n.layer].push(n);
    });

    Object.entries(layerGroups).forEach(([layer, nodes]) => {
      const [cx, cy] = layerPositions[layer];
      nodes.forEach((node, i) => {
        const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
        const r = 110 + Math.floor(i / 6) * 60;
        layerNodePositions[node.id] = {
          x: cx + r * Math.cos(angle),
          y: cy + r * Math.sin(angle),
        };
      });
    });

    const activeLinks = data.links.filter(
      l => activeNodeIds.has(l.source as string) && activeNodeIds.has(l.target as string)
    );

    activeLinks.forEach(link => {
      const s = layerNodePositions[link.source as string];
      const t = layerNodePositions[link.target as string];
      if (!s || !t) return;
      g.append('line')
        .attr('x1', s.x).attr('y1', s.y)
        .attr('x2', t.x).attr('y2', t.y)
        .attr('stroke', '#334155')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4 3');
    });

    activeNodes.forEach(node => {
      const pos = layerNodePositions[node.id];
      if (!pos) return;
      const color = LAYER_COLORS[node.layer];

      g.append('circle')
        .attr('cx', pos.x).attr('cy', pos.y).attr('r', 28)
        .attr('fill', color + '18')
        .attr('stroke', color)
        .attr('stroke-width', 1.5)
        .style('cursor', 'pointer')
        .on('click', () => setSelected(node))
        .on('dblclick', () => {
          window.location.href = `/ai-product_manager-map/concepts/${node.id}`;
        });

      g.append('text')
        .attr('x', pos.x).attr('y', pos.y + 5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#e2e8f0')
        .attr('font-size', 10)
        .style('pointer-events', 'none')
        .text(node.title.length > 8 ? node.title.slice(0, 8) + '…' : node.title);
    });

  }, [data, expandedLayers]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100dvh' }}>
      <div style={{
        position: 'absolute', top: 20, left: 24, zIndex: 10,
        color: '#e2e8f0', pointerEvents: 'none',
      }}>
        <div style={{ fontSize: 18, fontWeight: 600 }}>AI Product Map</div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>点击层级气泡展开 · 双击节点查看详情</div>
      </div>

      <svg ref={svgRef} width="100%" height="100%" />

      {selected && (
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 300,
          background: '#111827', borderLeft: '1px solid #1f2937',
          padding: 24, overflowY: 'auto',
        }}>
          <button
            onClick={() => setSelected(null)}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: 16, fontSize: 13 }}
          >
            ✕ 关闭
          </button>
          <div style={{
            display: 'inline-block', padding: '2px 8px', borderRadius: 4,
            background: LAYER_COLORS[selected.layer] + '22',
            color: LAYER_COLORS[selected.layer], fontSize: 11, marginBottom: 12,
          }}>
            {selected.layer}
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{selected.title}</h2>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 20 }}>{selected.summary}</p>
          <a
            href={`/ai-product_manager-map/concepts/${selected.id}`}
            style={{
              display: 'block', textAlign: 'center', padding: '8px 16px',
              background: '#1e3a5f', border: '1px solid #3b82f6',
              borderRadius: 6, color: '#93c5fd', fontSize: 13, cursor: 'pointer',
            }}
          >
            查看详情 →
          </a>
        </div>
      )}
    </div>
  );
}
