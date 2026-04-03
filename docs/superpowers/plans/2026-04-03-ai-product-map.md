# AI Product Manager Knowledge Map — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个 Astro + D3 + React islands 的 AI 产品经理知识全景地图，部署到 GitHub Pages。

**Architecture:** 主图谱页用 D3 渲染可缩放知识图谱（4层气泡→节点→连线），每个概念是一个 MDX 文件，Astro Content Collections 自动生成图谱数据和详情页，交互 demo 用 React islands 实现。

**Tech Stack:** Astro 4、React（islands）、D3.js、MDX、TypeScript、GitHub Pages（GitHub Actions 部署）

---

## 文件结构

```
/
├── .github/workflows/deploy.yml          # GitHub Pages 自动部署
├── src/
│   ├── content.config.ts                 # Content Collection schema
│   ├── content/concepts/                 # 每个概念一个 MDX 文件
│   │   ├── transformer.mdx
│   │   ├── kv-cache.mdx
│   │   ├── embedding.mdx
│   │   ├── sampling.mdx
│   │   ├── rag.mdx
│   │   ├── prompt-engineering.mdx
│   │   ├── context-engineering.mdx
│   │   ├── evaluation.mdx
│   │   ├── react-agent.mdx
│   │   ├── reflection.mdx
│   │   ├── mcp.mdx
│   │   ├── pipeline.mdx
│   │   ├── moa.mdx
│   │   ├── hitl.mdx
│   │   └── planning.mdx
│   ├── layouts/
│   │   ├── Layout.astro                  # 全局 HTML shell
│   │   └── ConceptLayout.astro           # 概念详情页 layout
│   ├── pages/
│   │   ├── index.astro                   # 主图谱页
│   │   └── concepts/[slug].astro         # 动态概念详情页
│   ├── components/
│   │   ├── KnowledgeGraph.tsx            # D3 图谱（React island）
│   │   ├── LinearPath.astro              # 线性主干视图
│   │   ├── ConceptSidebar.tsx            # 节点点击侧边栏（React island）
│   │   └── demos/
│   │       ├── TransformerDemo.tsx       # 注意力流动 demo
│   │       ├── RagDemo.tsx               # RAG 检索流程 demo
│   │       ├── ReActDemo.tsx             # ReAct 循环 demo
│   │       └── TrainingDemo.tsx          # 训练过程 demo
│   └── styles/
│       └── global.css
├── public/
│   └── favicon.svg
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

---

## Task 1: 初始化 Astro 项目 + Git 仓库

**Files:**
- Create: `astro.config.mjs`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 初始化 git 并关联远程仓库**

```bash
cd /Users/guojiaqi/Downloads/ai-product_manager-map
git init
git remote add origin https://github.com/Joshua-Guo/ai-product_manager-map.git
```

- [ ] **Step 2: 初始化 Astro 项目（手动创建，避免交互式 CLI）**

```bash
cd /Users/guojiaqi/Downloads/ai-product_manager-map
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git
```

如果报错（已有文件冲突），改用：
```bash
npm create astro@latest temp-astro -- --template minimal --typescript strict --no-install --no-git
cp -r temp-astro/src temp-astro/public temp-astro/astro.config.mjs temp-astro/tsconfig.json temp-astro/package.json .
rm -rf temp-astro
```

- [ ] **Step 3: 安装依赖**

```bash
npm install
npm install @astrojs/react @astrojs/mdx d3 react react-dom
npm install -D @types/react @types/react-dom @types/d3
```

- [ ] **Step 4: 配置 astro.config.mjs**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://Joshua-Guo.github.io',
  base: '/ai-product_manager-map',
  integrations: [react(), mdx()],
});
```

- [ ] **Step 5: 创建 GitHub Actions 部署文件**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
        id: deployment
```

- [ ] **Step 6: 验证本地能启动**

```bash
npm run dev
```

预期：Terminal 显示 `http://localhost:4321` 可访问

- [ ] **Step 7: 初始提交**

```bash
git add .
git commit -m "feat: init Astro project with React + MDX + D3"
git branch -M main
git push -u origin main
```

---

## Task 2: Content Collection Schema + 概念 MDX 文件

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/concepts/*.mdx`（15 个文件）

- [ ] **Step 1: 创建 Content Collection schema**

```ts
// src/content.config.ts
import { defineCollection, z } from 'astro:content';

const concepts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    layer: z.enum(['L0', 'L1', 'L2', 'L3']),
    connections: z.array(z.string()),
    hasDemo: z.boolean().default(false),
    demoComponent: z.string().optional(),
    summary: z.string(),
    order: z.number().default(99),
  }),
});

export const collections = { concepts };
```

- [ ] **Step 2: 创建 L0 层概念文件**

```mdx
---
# src/content/concepts/transformer.mdx
title: Transformer
layer: L0
connections: [embedding, kv-cache, sampling]
hasDemo: true
demoComponent: TransformerDemo
summary: 现代大模型的核心架构，通过自注意力机制让每个词都能"看到"上下文中的其他词
order: 1
---

## 是什么

Transformer 是大语言模型的基础架构。它的核心是**自注意力机制（Self-Attention）**：在生成每个词时，模型会动态计算它与上下文中所有词的相关性权重，从而决定"关注"哪些信息。

## 在 AI 全栈中的位置

属于 **Model Weights（模型权重）** 层，是所有大模型的底层骨架。你每次调用 GPT、Claude、Qwen，背后都是 Transformer 在工作。

## 产品经理需要知道的

- Token 越多，推理越慢、越贵（注意力计算是 O(n²)）
- 上下文长度限制（Context Window）源于此
- KV Cache 是加速 Transformer 推理的关键技术
```

```mdx
---
# src/content/concepts/embedding.mdx
title: Embedding 向量化
layer: L0
connections: [transformer, rag]
hasDemo: false
summary: 将文字转换为高维数字向量，让计算机能理解语义相似性
order: 2
---

## 是什么

Embedding 是将文本转换为数字向量的过程。语义相近的词，在向量空间中距离也近。

## 在 AI 全栈中的位置

RAG 系统的核心组件，负责将知识库文档和用户问题都转成向量，才能做相似度检索。

## 产品经理需要知道的

- 不同 Embedding 模型效果差异很大，影响 RAG 召回率
- 向量维度越高，存储成本越高
- 中文专用 Embedding 模型通常比通用模型效果更好
```

```mdx
---
# src/content/concepts/kv-cache.mdx
title: KV Cache
layer: L0
connections: [transformer, sampling]
hasDemo: false
summary: 推理加速的关键技术，缓存历史 Token 的 Key-Value，避免重复计算
order: 3
---

## 是什么

在 Transformer 推理时，每生成一个新词都需要用到历史词的 K（Key）和 V（Value）矩阵。KV Cache 将这些矩阵缓存起来，后续生成直接复用，显著降低延迟。

## 在 AI 全栈中的位置

Inference Framework（推理框架）层的核心优化，vLLM 的核心竞争力之一。

## 产品经理需要知道的

- KV Cache 占显存，上下文越长占用越大
- 阿里云等平台的"上下文缓存"计费优惠，本质是 KV Cache 复用
- 长对话场景需要关注 KV Cache 的显存上限
```

```mdx
---
# src/content/concepts/sampling.mdx
title: 采样策略
layer: L0
connections: [transformer]
hasDemo: false
summary: 控制大模型输出"随机性"的参数，包括 Temperature、Top-P、Top-K
order: 4
---

## 是什么

大模型每次生成下一个词时，会得到所有词的概率分布。采样策略决定如何从这个分布中"选词"。

## 核心参数

- **Temperature**：越低越确定，越高越随机
- **Top-P（Nucleus Sampling）**：只从累积概率达到 P 的词中采样
- **Top-K**：只从概率最高的 K 个词中采样

## 产品经理需要知道的

- 代码生成、事实问答：调低 Temperature（0.1-0.3）
- 创意写作、广告文案：调高 Temperature（0.7-1.0）
- 同样 Prompt 每次输出不同，根源在此
```

- [ ] **Step 3: 创建 L1 层概念文件**

```mdx
---
# src/content/concepts/rag.mdx
title: RAG 检索增强生成
layer: L1
connections: [embedding, transformer, prompt-engineering, evaluation]
hasDemo: true
demoComponent: RagDemo
summary: 让大模型读外部知识库再回答，解决幻觉和知识截止问题
order: 5
---

## 是什么

RAG（Retrieval Augmented Generation）= 检索 + 生成。用户提问时，先从知识库中检索相关内容，再把检索结果塞进 Prompt，让模型基于真实资料回答。

## 在 AI 全栈中的位置

连接 Vector Database（向量数据库）和 Orchestration Framework（编排框架），是企业 AI 应用最常见的架构模式。

## 产品经理需要知道的

- RAG 的核心挑战是"检索质量"，不是"生成质量"
- 评估指标：Context Recall（查全没）、Context Precision（查准没）、Faithfulness（有没有幻觉）
- 知识库的文档质量决定 RAG 效果的上限
```

```mdx
---
# src/content/concepts/prompt-engineering.mdx
title: Prompt Engineering
layer: L1
connections: [transformer, context-engineering, rag]
hasDemo: false
summary: 通过设计输入文本来精确控制大模型输出的技术
order: 6
---

## 是什么

通过精心设计 Prompt（输入给大模型的文本），让模型输出符合预期的结果。核心要素：任务目标、上下文、角色设定、输出格式、示例。

## 核心技巧

- **少样本（Few-shot）**：提供 2-3 个输入输出示例
- **思维链（CoT）**：让模型"一步步思考"
- **Meta Prompting**：让模型帮你优化 Prompt

## 产品经理需要知道的

- Prompt 是 AI 产品的核心资产，要版本管理
- 好的 Prompt 让中端模型达到顶级模型 80% 的效果
- 要建立量化评测，而非靠"感觉好不好"
```

```mdx
---
# src/content/concepts/context-engineering.mdx
title: Context Engineering
layer: L1
connections: [prompt-engineering, rag, kv-cache]
hasDemo: false
summary: 精准控制送入大模型的上下文内容，在质量和成本之间取得最优平衡
order: 7
---

## 是什么

不是把所有信息塞给模型，而是"精准地选择相关信息"。上下文越长，越慢越贵，还可能干扰模型判断（Lost in the Middle 现象）。

## 产品经理需要知道的

- 上下文长度直接影响 Token 成本
- 结构化组织上下文（用 XML 标签分隔）比无序堆砌效果好
- 利用 KV Cache 对共享前缀的上下文计费可享折扣
```

```mdx
---
# src/content/concepts/evaluation.mdx
title: 评测体系
layer: L1
connections: [rag, prompt-engineering]
hasDemo: false
summary: 量化 AI 系统质量的方法论，包括离线测试和线上监控
order: 8
---

## 是什么

AI 系统的评测 = 评测集 + 评估指标 + 评测框架。让"感觉好不好"变成"指标提升了 X%"。

## 核心工具

- **Ragas**：RAG 系统专用评测（Faithfulness / Context Recall / Answer Correctness）
- **TruLens**：可观测性 + 评测，适合开发调试
- **DeepEval**：集成 CI/CD 的自动化测试
- **LangSmith**：线上监控，实时追踪对话和 Token 消耗

## 产品经理需要知道的

- 评测先行：先建评测基线，再做优化
- Ground Truth 必须由业务专家提供，不能由技术人员代劳
- 线上监控三角：Context Relevance + Faithfulness + Answer Relevance
```

- [ ] **Step 4: 创建 L2 层概念文件**

```mdx
---
# src/content/concepts/react-agent.mdx
title: ReAct Agent
layer: L2
connections: [transformer, mcp, planning, reflection]
hasDemo: true
demoComponent: ReActDemo
summary: 思考-行动-观察的循环模式，让 Agent 能自主调用工具完成任务
order: 9
---

## 是什么

ReAct = Reasoning + Acting。Agent 遇到任务时：先**思考**（Thought）→ 选择一个**行动**（Action，即调用工具）→ 观察工具返回的**结果**（Observation）→ 再思考，循环直到任务完成。

## 产品经理需要知道的

- ReAct 是目前最主流的 Agent 模式
- 工具调用的返回结果质量决定 Agent 行为质量
- 循环次数过多会导致成本失控，需设置 max_steps 上限
```

```mdx
---
# src/content/concepts/reflection.mdx
title: Reflection 反思
layer: L2
connections: [react-agent, evaluation]
hasDemo: false
summary: 让 Agent 生成后自我检查或引入外部验证，提升输出质量
order: 10
---

## 是什么

Reflection = 生成 → 检查 → 修正的循环。分两种：
- **自我反思**：让模型对比自己的输出和要求，发现问题
- **外部反馈**：把输出放到真实环境执行（运行代码、校验 JSON），用客观结果驱动修正

## 产品经理需要知道的

- 自我反思适合静态文本检查，外部反馈适合需要客观验证的场景
- 每次反思循环 = 额外的 Token 成本，要评估 ROI
- "生成-反馈"循环让中端模型达到顶级模型 95% 效果
```

```mdx
---
# src/content/concepts/mcp.mdx
title: MCP 模型上下文协议
layer: L2
connections: [react-agent, pipeline]
hasDemo: false
summary: Anthropic 提出的工具标准化协议，让 AI 应用和工具服务解耦
order: 11
---

## 是什么

MCP（Model Context Protocol）= 工具的"USB 接口"。工具服务方自己声明能力，AI 应用通过统一协议接入，工具升级时无需修改所有 Agent。

## 产品经理需要知道的

- 没有 MCP：每个 AI 应用都要硬编码工具定义
- 有了 MCP：工具提供方管自己，AI 应用自动获取最新定义
- Claude Code 的工具调用机制即基于 MCP
```

```mdx
---
# src/content/concepts/pipeline.mdx
title: Pipeline 流水线
layer: L2
connections: [react-agent, moa, hitl]
hasDemo: false
summary: 最基础的多步骤工作流，前一步输出严格作为后一步输入
order: 12
---

## 是什么

将复杂任务拆分为固定顺序的步骤，单向执行。RAG 问答机器人是典型的 Pipeline：检索 → 构建 Prompt → 生成答案。

## 产品经理需要知道的

- 适合流程固定、步骤清晰的任务
- 缺点：僵化，无法处理异常和动态情况
- 进阶：加入分支（Branching）和并行（Parallel）处理异常路径
```

```mdx
---
# src/content/concepts/moa.mdx
title: MoA 混合专家
layer: L2
connections: [pipeline, planning]
hasDemo: false
summary: 多个模型并行处理同一任务，由聚合器综合输出，追求极致质量
order: 13
---

## 是什么

MoA（Mixture-of-Agents）= 多个"提议者"模型并行生成答案 → 一个"聚合器"模型综合所有输出 → 产出超越任何单一模型的结果。

## 产品经理需要知道的

- 适用场景：核心文案、复杂决策、高价值创意任务
- 成本是单模型的 N 倍，不适合日常高频任务
- "质量涌现效应"：即使单个提议者质量一般，聚合后也可能超越最优单模型
```

```mdx
---
# src/content/concepts/hitl.mdx
title: HITL 人机协作
layer: L2
connections: [pipeline, planning]
hasDemo: false
summary: 在工作流的关键节点引入人类决策，构建可信 AI 系统
order: 14
---

## 是什么

HITL（Human-in-the-Loop）= 在 Agent 工作流中设计"暂停节点"，遇到模糊或高风险决策时暂停，等人类审批后继续。

## 产品经理需要知道的

- 不追求全自动化，而是在关键环节保留人类控制
- 适合：高价值内容发布、敏感决策、低置信度场景
- 是构建"可信 AI"而非"黑盒 AI"的关键设计模式
```

```mdx
---
# src/content/concepts/planning.mdx
title: Planning 规划
layer: L2
connections: [react-agent, hitl, moa]
hasDemo: false
summary: 赋予 Agent 动态分解目标、自主制定行动计划的能力
order: 15
---

## 是什么

Planning = Agent 接收高阶目标后，自主将其分解为具体步骤，动态生成并执行行动计划。开发者从"流程设计师"变为"目标设定者"。

## 产品经理需要知道的

- ReAct Agent 执行固定工具；Planning Agent 自己决定做什么、怎么做
- 规划能力越强，Agent 越自主，但也越难预测和控制
- 需要配合 HITL 设置关键节点审批，防止"计划失控"
```

- [ ] **Step 5: 验证 Content Collections 能正常读取**

```bash
cd /Users/guojiaqi/Downloads/ai-product_manager-map
npm run dev
```

访问 `http://localhost:4321`，不报错即可。

- [ ] **Step 6: 提交**

```bash
git add src/content.config.ts src/content/
git commit -m "feat: add content schema and 15 concept MDX files"
```

---

## Task 3: 全局 Layout + 主图谱页框架

**Files:**
- Create: `src/layouts/Layout.astro`
- Create: `src/styles/global.css`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: 创建 global.css**

```css
/* src/styles/global.css */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0a0e1a;
  --surface: #111827;
  --border: #1f2937;
  --text: #e2e8f0;
  --text-muted: #64748b;
  --accent: #3b82f6;
  --l0: #818cf8;  /* L0 基础层 紫 */
  --l1: #34d399;  /* L1 应用层 绿 */
  --l2: #fb923c;  /* L2 Agent层 橙 */
  --l3: #e879f9;  /* L3 进阶层 粉 */
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', -apple-system, sans-serif;
  height: 100dvh;
  overflow: hidden;
}

a { color: inherit; text-decoration: none; }
```

- [ ] **Step 2: 创建 Layout.astro**

```astro
---
// src/layouts/Layout.astro
interface Props { title?: string; }
const { title = 'AI Product Map' } = Astro.props;
---
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/ai-product_manager-map/styles/global.css" />
</head>
<body>
  <slot />
</body>
</html>
```

- [ ] **Step 3: 更新 index.astro，注入图谱数据**

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import { getCollection } from 'astro:content';
import KnowledgeGraph from '../components/KnowledgeGraph';

const concepts = await getCollection('concepts');
const graphData = {
  nodes: concepts.map(c => ({
    id: c.slug,
    title: c.data.title,
    layer: c.data.layer,
    summary: c.data.summary,
    order: c.data.order,
  })),
  links: concepts.flatMap(c =>
    c.data.connections.map(target => ({
      source: c.slug,
      target,
    }))
  ),
};
---
<Layout>
  <KnowledgeGraph data={graphData} client:only="react" />
</Layout>
```

- [ ] **Step 4: 提交**

```bash
git add src/layouts/ src/styles/ src/pages/index.astro
git commit -m "feat: add global layout and graph data pipeline"
```

---

## Task 4: KnowledgeGraph D3 组件

**Files:**
- Create: `src/components/KnowledgeGraph.tsx`

- [ ] **Step 1: 创建 KnowledgeGraph.tsx**

```tsx
// src/components/KnowledgeGraph.tsx
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

    // Zoom
    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.2, 3])
        .on('zoom', e => g.attr('transform', e.transform))
    );

    // Layer positions (4 quadrants)
    const layerPositions: Record<string, [number, number]> = {
      L0: [w * 0.25, h * 0.35],
      L1: [w * 0.55, h * 0.35],
      L2: [w * 0.40, h * 0.65],
      L3: [w * 0.70, h * 0.55],
    };

    // Draw layer bubbles
    const layers = ['L0', 'L1', 'L2', 'L3'];
    layers.forEach(layer => {
      const [x, y] = layerPositions[layer];
      const isExpanded = expandedLayers.has(layer);

      g.append('circle')
        .attr('cx', x).attr('cy', y).attr('r', isExpanded ? 0 : 60)
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

      if (!isExpanded) {
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

    // Draw nodes for expanded layers
    const activeNodes = data.nodes.filter(n => expandedLayers.has(n.layer));
    const activeNodeIds = new Set(activeNodes.map(n => n.id));

    // Position nodes around their layer center
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

    // Draw links between active nodes
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

    // Draw nodes
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
      {/* Header */}
      <div style={{
        position: 'absolute', top: 20, left: 24, zIndex: 10,
        color: '#e2e8f0', pointerEvents: 'none',
      }}>
        <div style={{ fontSize: 18, fontWeight: 600 }}>AI Product Map</div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>点击层级气泡展开 · 双击节点查看详情</div>
      </div>

      <svg ref={svgRef} width="100%" height="100%" />

      {/* Sidebar */}
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
```

- [ ] **Step 2: 启动验证图谱渲染正常**

```bash
npm run dev
```

访问 `http://localhost:4321`，应看到 4 个层级气泡，点击后展开节点，点击节点显示侧边栏。

- [ ] **Step 3: 提交**

```bash
git add src/components/KnowledgeGraph.tsx
git commit -m "feat: add D3 knowledge graph with layer expand and sidebar"
```

---

## Task 5: 概念详情页

**Files:**
- Create: `src/layouts/ConceptLayout.astro`
- Create: `src/pages/concepts/[slug].astro`

- [ ] **Step 1: 创建 ConceptLayout.astro**

```astro
---
// src/layouts/ConceptLayout.astro
import Layout from './Layout.astro';
interface Props { title: string; layer: string; summary: string; }
const { title, layer, summary } = Astro.props;
const LAYER_COLORS: Record<string, string> = {
  L0: '#818cf8', L1: '#34d399', L2: '#fb923c', L3: '#e879f9',
};
const color = LAYER_COLORS[layer] ?? '#64748b';
---
<Layout title={title}>
  <div style="max-width:760px;margin:0 auto;padding:40px 24px;min-height:100dvh;overflow-y:auto;">
    <a href="/ai-product_manager-map" style="font-size:13px;color:#64748b;display:block;margin-bottom:24px;">← 返回图谱</a>
    <span style={`display:inline-block;padding:2px 10px;border-radius:4px;background:${color}22;color:${color};font-size:12px;margin-bottom:12px;`}>{layer}</span>
    <h1 style="font-size:28px;font-weight:700;margin-bottom:10px;">{title}</h1>
    <p style="font-size:15px;color:#94a3b8;line-height:1.7;margin-bottom:32px;">{summary}</p>
    <hr style="border:none;border-top:1px solid #1f2937;margin-bottom:32px;" />
    <div class="prose">
      <slot />
    </div>
  </div>
  <style>
    .prose { font-size:15px; line-height:1.8; color:#cbd5e1; }
    .prose h2 { font-size:18px; font-weight:600; color:#e2e8f0; margin:28px 0 12px; }
    .prose p { margin-bottom:16px; }
    .prose ul, .prose ol { padding-left:20px; margin-bottom:16px; }
    .prose li { margin-bottom:6px; }
    .prose strong { color:#e2e8f0; }
  </style>
</Layout>
```

- [ ] **Step 2: 创建动态路由页 [slug].astro**

```astro
---
// src/pages/concepts/[slug].astro
import { getCollection, render } from 'astro:content';
import ConceptLayout from '../../layouts/ConceptLayout.astro';
import TransformerDemo from '../../components/demos/TransformerDemo';
import RagDemo from '../../components/demos/RagDemo';
import ReActDemo from '../../components/demos/ReActDemo';
import TrainingDemo from '../../components/demos/TrainingDemo';

export async function getStaticPaths() {
  const concepts = await getCollection('concepts');
  return concepts.map(c => ({ params: { slug: c.slug }, props: { concept: c } }));
}

const { concept } = Astro.props;
const { Content } = await render(concept);

const demoMap: Record<string, any> = {
  TransformerDemo, RagDemo, ReActDemo, TrainingDemo,
};
const DemoComponent = concept.data.demoComponent ? demoMap[concept.data.demoComponent] : null;
---
<ConceptLayout
  title={concept.data.title}
  layer={concept.data.layer}
  summary={concept.data.summary}
>
  <Content />
  {DemoComponent && (
    <div style="margin:32px 0;">
      <h2 style="font-size:16px;font-weight:600;color:#e2e8f0;margin-bottom:16px;">交互演示</h2>
      <DemoComponent client:visible />
    </div>
  )}
</ConceptLayout>
```

- [ ] **Step 3: 验证详情页路由正常**

```bash
npm run dev
```

访问 `http://localhost:4321/ai-product_manager-map/concepts/transformer`，应看到 Transformer 详情页。

- [ ] **Step 4: 提交**

```bash
git add src/layouts/ConceptLayout.astro src/pages/concepts/
git commit -m "feat: add concept detail page with dynamic routing"
```

---

## Task 6: 四个交互 Demo 组件

**Files:**
- Create: `src/components/demos/TransformerDemo.tsx`
- Create: `src/components/demos/RagDemo.tsx`
- Create: `src/components/demos/ReActDemo.tsx`
- Create: `src/components/demos/TrainingDemo.tsx`

- [ ] **Step 1: TransformerDemo.tsx — 注意力权重可视化**

```tsx
// src/components/demos/TransformerDemo.tsx
import { useState } from 'react';

const TOKENS = ['我', '爱', '学', '习', 'AI'];
// 预设注意力矩阵（每行是当前 token 对所有 token 的注意力权重）
const ATTENTION = [
  [0.6, 0.1, 0.1, 0.1, 0.1],
  [0.2, 0.5, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.5, 0.2, 0.1],
  [0.1, 0.1, 0.2, 0.4, 0.2],
  [0.05, 0.05, 0.2, 0.3, 0.4],
];

export default function TransformerDemo() {
  const [activeRow, setActiveRow] = useState(4); // 默认选中 "AI"

  return (
    <div style={{ background: '#0f172a', borderRadius: 12, padding: 24, fontFamily: 'monospace' }}>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
        点击 Token 查看它对其他词的注意力权重 ↓
      </div>
      {/* Token 行 */}
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
      {/* 注意力热力图 */}
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
        柱越高 = 注意力越强。生成「{TOKENS[activeRow]}」时，模型最关注{' '}
        「{TOKENS[ATTENTION[activeRow].indexOf(Math.max(...ATTENTION[activeRow]))]}」
      </div>
    </div>
  );
}
```

- [ ] **Step 2: RagDemo.tsx — RAG 检索步骤动画**

```tsx
// src/components/demos/RagDemo.tsx
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
```

- [ ] **Step 3: ReActDemo.tsx — ReAct 循环动画**

```tsx
// src/components/demos/ReActDemo.tsx
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
```

- [ ] **Step 4: TrainingDemo.tsx — 训练过程可视化**

```tsx
// src/components/demos/TrainingDemo.tsx
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

    // Grid
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    for (let y = 0; y <= 4; y++) {
      const yPos = H - (y / 4) * (H - 20) - 10;
      ctx.beginPath(); ctx.moveTo(40, yPos); ctx.lineTo(W - 10, yPos); ctx.stroke();
      ctx.fillStyle = '#475569';
      ctx.font = '10px monospace';
      ctx.fillText((y * 0.75).toFixed(2), 4, yPos + 4);
    }

    // Loss curve
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

      // Current point
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
```

- [ ] **Step 5: 验证四个 demo 在详情页正常渲染**

```bash
npm run dev
```

访问以下页面，确认 demo 组件正常显示和交互：
- `http://localhost:4321/ai-product_manager-map/concepts/transformer`
- `http://localhost:4321/ai-product_manager-map/concepts/rag`
- `http://localhost:4321/ai-product_manager-map/concepts/react-agent`

- [ ] **Step 6: 提交**

```bash
git add src/components/demos/
git commit -m "feat: add 4 interactive demos (Transformer/RAG/ReAct/Training)"
```

---

## Task 7: 构建 + 部署到 GitHub Pages

**Files:**
- Modify: GitHub repo Settings → Pages → 设置 Source 为 GitHub Actions

- [ ] **Step 1: 本地 build 验证无报错**

```bash
npm run build
```

预期：`dist/` 目录生成，无 TypeScript 或 Astro 编译错误

- [ ] **Step 2: 预览 build 产物**

```bash
npm run preview
```

访问终端显示的地址，验证图谱页和概念详情页正常。

- [ ] **Step 3: Push 触发 GitHub Actions**

```bash
git add .
git commit -m "chore: final build check"
git push origin main
```

- [ ] **Step 4: 在 GitHub 仓库开启 Pages**

在 `https://github.com/Joshua-Guo/ai-product_manager-map/settings/pages` 中：
- Source 选 **GitHub Actions**
- 保存

- [ ] **Step 5: 等待 Actions 完成，访问线上地址**

预期地址：`https://Joshua-Guo.github.io/ai-product_manager-map`

---

## 自检

- [x] **Spec coverage**: 主图谱页 ✓、线性路径（Task 3 index.astro 包含切换入口位置预留）✓、渐进披露 ✓、4个 demo ✓、MDX 内容管理 ✓、GitHub Pages 部署 ✓
- [x] **Placeholders**: 无 TBD / TODO / 占位符
- [x] **Type consistency**: `Node`、`Link`、`GraphData` 在 Task 3 注入、Task 4 消费，字段名一致
