# Just AI
Building a full-stack LLM application development platform from scratch

# step by step
## step1
服务骨架搭建

### 1.1
- 创建仓库与目录
- 包管理工具 pnpm 以及 pnpm-workspace.yaml 配置
- docker -compose.yml 编写, 支持 Postgres(带 pgvector) + Redis

验收:
```
pnpm infra:up
docker ps | grep just-ai
# 应看到 just-ai-postgres / just-ai-redis
```

### 1.2
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