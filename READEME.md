# Just AI
Building a full-stack LLM application development platform from scratch

## 概览

项目拆解（从大到小的里程碑）

里程碑 M1：可对话（无 RAG）

✅ Next.js 页面 + SSE 流式输出

✅ LLM Provider 抽象（可切换模型）

✅ Prompt 模板最简版（系统 Prompt + 用户输入）

里程碑 M2：RAG 闭环（文档→向量→检索→回答）

✅ 文档导入（txt/markdown/pdf 先不做 OCR，MVP 用 txt/md）

✅ chunk + embedding 入库（pgvector）

✅ 检索 topK + 引用拼上下文

✅ 回答带 citations（source ids）

里程碑 M3：Workflow + Tool（变成“可控应用”）

✅ Workflow 引擎（最小 DAG/状态机）

✅ Tool Runtime（schema 校验、超时、重试）

✅ Agent “工具调用”先用规则触发（MVP 不强求复杂 planner）

里程碑 M4：观测与治理（面试加分关键）

✅ trace_id 串联：gateway → workflow nodes → provider/tool

✅ prompt/workflow 版本号

✅ 基础 guard（敏感词/越权/空引用不允许胡答）

## get start
### step1 服务骨架搭建
1.1
- 创建仓库与目录
- 包管理工具 pnpm 以及 pnpm-workspace.yaml 配置
- docker -compose.yml 编写, 支持 Postgres(带 pgvector) + Redis

验收:
```
pnpm infra:up
docker ps | grep just-ai
# 应看到 just-ai-postgres / just-ai-redis
```
---

1.2
- 初始化 services/api node服务, 初始化各类空文件夹用于占位
- node 增加统一 api 前缀和 统一版本管理能力

验收:
```
pnpm start:dev
curl http://localhost:3000/api/health
# -> {"ok":true,"service":"just-ai-api"}

curl http://localhost:3000/api/v1/ping
# -> {"pong":true,"v":1}
```
---

### step2
- 配置模块加 zod 校验
- 创建 documents 表, 链接数据库, 实现增, 查操作

验收:
```
// 已创建过就不创建了
curl -X POST http://localhost:3000/api/v1/admin/db/init
# -> {"ok":true}

// 写数据
curl -X POST http://localhost:3000/api/v1/documents \
  -H 'content-type: application/json' \
  -d '{"tenant_id":"default","title":"Hello Doc","source":"manual","content":"This is a test document about WireGuard and RAG."}'

// 读数据
curl http://localhost:3000/api/v1/documents/1
```
---
