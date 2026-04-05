# Android App 接入说明

当前仓库已接入 Capacitor 8，可直接把现有 Vite Web 应用打包为 Android App。

## 前提

- Node.js
- pnpm
- JDK 21
- Android Studio
- Android SDK

## 首次初始化

安装依赖：

```bash
pnpm install
```

如果仓库里还没有 `android/` 目录，执行：

```bash
pnpm exec cap add android
```

## 日常开发流程

Web 代码改完后同步到 Android 工程：

```bash
pnpm android:sync
```

打开 Android Studio：

```bash
pnpm android:open
```

也可以只拷贝前端产物，不刷新原生插件：

```bash
pnpm android:copy
```

## 构建

调试包：

```bash
cd android
./gradlew assembleDebug
```

签名发布 APK：

```bash
cd android
./gradlew assembleRelease
```

发布 AAB：

```bash
cd android
./gradlew bundleRelease
```

## 当前接入说明

- 继续复用现有 React + Vite 代码，无需重写成原生页面
- 原生容器内自动改用 `HashRouter`，避免 WebView 场景下的 history 路由刷新问题
- 页面已开启 `viewport-fit=cover`，并补充顶部和底部安全区处理
- 本地 SDK 路径和签名信息通过 `android/local.properties` 提供，该文件默认不入库

## 发布前建议

- 把 `capacitor.config.ts` 里的 `appId` 从 `com.example.wanlianli` 改成你自己的正式包名
- 补应用图标、启动图和隐私说明
- 如需推送、分享、文件、系统返回键等能力，再按需接入 Capacitor 插件
