# 万年历 Web

基于 `lunar-javascript` 的移动端优先万年历网页，当前包含今日黄历首页、月历查日、整日详情和术语说明页。

## 脚本

- `pnpm dev`
- `pnpm build`
- `pnpm test`
- `pnpm test:watch`

## Docker 部署

前提：服务器已安装 Docker 和 Docker Compose。

一键启动：

```bash
docker compose up -d --build
```

默认会把服务暴露到 `8080` 端口，访问 `http://<服务器IP>:8080`。

如果要改端口：

```bash
WANLIANLI_PORT=80 docker compose up -d --build
```

停止服务：

```bash
docker compose down
```

说明：

- `Dockerfile` 使用多阶段构建，先执行 `pnpm build`，再用 Nginx 提供静态文件服务
- Nginx 已配置 SPA 路由回退，`/calendar`、`/day/:date` 等前端路由可直接访问

## 当前能力

- 今日优先：首页先看宜忌、吉时、冲煞等核心信息
- 月历入口：按月选择日期并进入详情页
- 整日详情：按分组查看时辰、神煞、方位与传统历法信息
- 术语解释：点击 `?` 打开底部抽屉，并可进入长文说明页
- 轻内容：内置黄历术语、节气说明、传统民俗说明

## 技术栈

- React
- Vite
- TypeScript
- React Router
- Vitest
- `lunar-javascript`
