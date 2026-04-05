# 万年历 Web / Android

基于 `lunar-javascript` 的移动端优先万年历，当前同时支持 Web 部署和 Android App 打包。当前包含今日黄历首页、月历查日、整日详情和术语说明页。

## 脚本

- `pnpm dev`
- `pnpm build`
- `pnpm build:android`
- `pnpm android:copy`
- `pnpm android:sync`
- `pnpm android:open`
- `pnpm test`
- `pnpm test:watch`

## Android App

项目已接入 `Capacitor 8`，可直接把现有 React + Vite 页面打包成 Android App，无需重写原生界面。

常用流程：

```bash
pnpm install
pnpm android:sync
pnpm android:open
```

调试包：

```bash
cd android
./gradlew assembleDebug
```

签名发布包：

```bash
cd android
./gradlew assembleRelease
```

发布到 Google Play 的包：

```bash
cd android
./gradlew bundleRelease
```

构建产物：

- Debug APK：`android/app/build/outputs/apk/debug/app-debug.apk`
- Release APK：`android/app/build/outputs/apk/release/app-release.apk`
- Release AAB：`android/app/build/outputs/bundle/release/`

说明：

- Android 工程位于 `android/`
- 原生容器内自动切换到 `HashRouter`，避免 WebView 场景下 history 路由刷新问题
- 本地 SDK 路径、签名 keystore 和密码放在 `android/local.properties`，该文件不会提交到仓库
- 详细说明见 `docs/android.md`

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
