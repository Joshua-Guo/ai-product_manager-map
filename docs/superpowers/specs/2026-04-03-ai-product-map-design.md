# AI Product Manager Knowledge Map — Design Spec

**Date:** 2026-04-03  
**Repo:** https://github.com/Joshua-Guo/ai-product_manager-map.git  
**Author:** 郭佳琦 (Joshua Guo)

---

## 1. 产品目标

构建一个面向 AI 产品经理的**知识全景地图**，帮助普通产品人从 0 到 1 建立 AI 技术认知体系。

- **近期**：个人知识库，边学边补，随时查阅
- **远期**：开源学习路线图，其他 AI PM 可 follow

---

## 2. 整体结构

```
入口页（主图谱）
  ├── 线性主干视图   ← 新人从这里进，按顺序学
  └── 图谱全景视图   ← 熟悉后切换，看概念关联

概念详情页（每个节点点进去）
  ├── 一句话定义
  ├── 在 AI 全栈中的位置
  ├── 交互 demo（核心概念）
  └── 关联概念 → 跳其他节点
```

### 内容层级

| 层级 | 名称 | 包含概念 |
|------|------|---------|
| L0 | 基础层 | Transformer、Embedding、KV Cache、Sampling |
| L1 | 应用层 | RAG、Prompt Engineering、Context Engineering、Evaluation |
| L2 | Agent 层 | ReAct、Reflection、MCP、Pipeline、MoA、HITL、Planning |
| L3 | 进阶层 | 训练过程、反向传播、损失函数、学习率（后期补充） |

---

## 3. 交互设计（渐进披露）

### 主图谱进入逻辑

```
首次进入 → 只显示 4 个层级气泡（L0/L1/L2/L3）
点击某层 → 展开该层所有概念节点
点击某节点 → 高亮关联边 + 侧边栏预览
双击节点 → 进入概念详情页（full screen）
```

### 详情页渐进披露

```
第一屏：一句话定义 + 在全栈中的位置示意图
滚动↓：交互 demo（核心概念才有）
滚动↓：延伸阅读 + 关联节点卡片
```

---

## 4. MVP 交互 Demo（优先级排序）

| 优先级 | Demo | 描述 |
|--------|------|------|
| P0 | Transformer 注意力流动 | Token 间注意力权重动态可视化 |
| P0 | RAG 检索流程 | Query → 向量检索 → 召回 → 生成，步骤动画 |
| P0 | ReAct 循环 | 思考 → 行动 → 观察的循环动画 |
| P0 | 训练过程 | Epoch 迭代 + Loss 下降曲线 + 权重分布动态变化 |

其余概念 MVP 阶段用静态图解占位，后期迭代补 demo。

---

## 5. 内容管理

每个概念 = 一个 MDX 文件：

```
src/content/concepts/
  ├── transformer.mdx
  ├── kv-cache.mdx
  ├── rag.mdx
  ├── react-agent.mdx
  └── ...
```

### MDX Frontmatter 格式

```yaml
---
title: RAG 检索增强生成
layer: L1
connections: [transformer, vector-db, prompt-engineering]
hasDemo: true
demoComponent: RagDemo
summary: 让大模型能读外部知识库再回答，解决幻觉和知识截止问题
---
```

**扩展方式**：新建 `.mdx` 文件 → 图谱自动出现新节点，连线根据 `connections` 字段自动渲染。

---

## 6. 技术栈

| 模块 | 技术 |
|------|------|
| 框架 | Astro |
| 交互 Demo | React islands |
| 图谱可视化 | D3.js |
| 内容 | MDX + Astro Content Collections |
| 部署 | GitHub Pages（GitHub Actions 自动构建）|

---

## 7. 部署流程

```
本地开发：npm run dev（默认 4321 端口）
内容更新：编辑 / 新建 MDX 文件
部署：git push → GitHub Actions 自动 build → GitHub Pages
```

---

## 8. 如何让 cc 帮你加新节点

> 这是给你用的操作手册，后续每次新增概念照此操作。

### 场景 A：加一个新概念节点

直接告诉 cc：

```
cc，帮我加一个节点：
- 概念名：xxx
- 属于哪层：L0 / L1 / L2 / L3
- 和哪些概念有关联：xxx、xxx
- 要不要 demo：要 / 不要
- 简单描述一下这个概念是干什么的
```

cc 会：
1. 创建 `src/content/concepts/xxx.mdx`
2. 填入内容 + frontmatter
3. 如果要 demo，创建对应 React 组件
4. push 到 GitHub，自动部署

### 场景 B：更新现有概念内容

```
cc，更新一下 xxx 这个节点，补充：[你想加的内容]
```

### 场景 C：调整关联关系

```
cc，把 xxx 和 yyy 连起来（或断开）
```

---

## 9. 后续迭代方向

- [ ] L3 训练层概念补充
- [ ] 搜索功能（按概念名快速定位节点）
- [ ] 学习进度追踪（标记已读节点）
- [ ] 多语言支持（中/英）
- [ ] 移动端适配
