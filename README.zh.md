# dsh-sidechat

[DeepSeek Harness](https://www.deepseek.com)（DSH）的 **Codex 式侧边聊天**网页插件：右侧面板提供按主会话隔离的独立 agent 聊天。基于 [heartmove/dsh-side-chat](https://github.com/heartmove/dsh-side-chat)（MIT）分叉修改。

> English docs: [README.md](./README.md).

## 功能

- **右侧面板侧边聊天**——每个侧聊都是一个真实的 DSH agent 会话（隐藏、已归档），只属于发起它的那个主会话，并感知其工作目录。
- **继承主会话上下文**——工具集、模型、思考难度、权限预设与工作目录全部继承，且每个侧聊可单独调整。
- **选中即问，默认不发送**——选中主对话文本点「在侧边聊天中提问」，面板打开、内容写进输入框，按回车才发送（"立即发送"可在设置里打开）。
- **一键新建侧聊**——面板右上角「+」按钮立即创建一个空侧聊并聚焦输入框。
- **带回主会话**——侧聊 AI 回复可整条或选中片段、直接或摘要后，写入主会话草稿框或注入为折叠上下文行。
- **问题弹框侧聊**——主 agent 弹出问题弹框时，可把问题与各选项带入侧聊先分析、不打断主流程，想清楚后把答案带回再作答。
- **易用细节**——面板可拖宽（280–720 px）与折叠、侧聊可单个/全部删除、「需要时查工作区/主会话」开关、界面跟随 DSH 中英文设置。

## 与上游（dsh-side-chat）的差异

1. **选中内容注入输入框，默认不发送**。`sendImmediately` 默认改为关闭；「继续在激活的侧边聊天中提问」会把选中内容**追加**到已有草稿而不是覆盖。
2. **一键新建侧聊**。面板头部新增「+」按钮，直接创建新侧聊。
3. **更名**为 `dsh-sidechat`（设置命名空间、记录文件、bundle id 等）。

其余能力与上游一致。

## 安装

### 从 GitHub 安装

```bash
dsh plugin --profile web add github:realpkuasule/dsh-sidechat
```

git 安装在安装时从源码构建。pnpm ≥ 10 会拦截构建脚本，第一次 `add` 会失败并提示"Ignored build scripts"——把提示里打印的包键复制进 profile 的 `pnpm-workspace.yaml`：

```yaml
onlyBuiltDependencies:
  - dsh-sidechat
```

然后重新执行 `add`。重启 `dsh web` 并硬刷新页面（Cmd/Ctrl+Shift+R）后生效。

### 从本地源码安装

```bash
dsh plugin --profile web add ./dsh-sidechat
```

本地源码以软链接安装，改代码即生效，无需重装。

### 配套插件

[dsh-side-notify](https://github.com/realpkuasule/dsh-side-notify) 提供主动推送：侧聊面板旁「通知主 agent」悬浮胶囊与 `/notify`、`/to-main` 命令，把消息直接推给主 agent 作为其下一轮处理。

```bash
dsh plugin --profile web add github:realpkuasule/dsh-side-notify
```

## 使用

1. **发起侧聊**——选中主对话任意文本点「在侧边聊天中提问」（内容进入输入框、不发送），或打开面板点「+」。
2. **独立聊天**——按需调整每个侧聊的模型/思考难度/权限；需要更多上下文时打开「需要时查工作区/主会话」。
3. **带回主会话**——回复下方「直接带回 / 摘要后带回」（或选中片段），落点为草稿框或折叠上下文行。
4. **从容回答问题弹框**——主 agent 提问等待时，先在侧聊里把问题与选项分析清楚，再把答案带回作答。

## 设置

DSH 设置 → 侧边聊天（Side chat）：

| 设置 | 默认值 | 说明 |
|---|---|---|
| `lookupDefault` | 关 | 新侧聊默认是否勾选「需要时查工作区/主会话」。 |
| `sendImmediately` | **关** | 打开时选中内容立即发送并附加 `defaultPrompt`；关闭时只写入输入框。 |
| `defaultPrompt` | （空） | 「立即发送」时附加的提示词。 |
| `bringMode` | `draft` | 带回内容的落点：写入草稿框，或注入为折叠上下文行。 |

## 实现原理

每个侧聊都是一个普通 DSH 会话：`meta.parentSession` 指向发起它的主会话，创建后立即归档，因此不会出现在会话列表或子代理目录。宿主侧（`/sidechat/api` JSON 路由）通过实时 agent（`agent.followup`）创建并驱动这些会话、继承发起会话的组合配置；带回主会话走 `agent.inject` 或主输入框。客户端是一个 portal 挂载的 React 面板，通过同源 POST 调用宿主路由，请求经过与 DSH API 网关一致的 loopback/可信主机围栏。

## 开发

```bash
pnpm install
pnpm build     # tsc -p tsconfig.build.json && tsdown → lib/
pnpm typecheck
```

`lib/` 即产物：`lib/index.js`（host）、`lib/client.js`（profile 渠道）、`lib/client-registry.js`（插件注册渠道）。`prepare` 脚本执行同样的 tsdown 构建，因此 GitHub 安装可以直接从源码构建。

```
src/
  index.ts             host：/sidechat/api 路由、会话/agent 生命周期、转录折叠
  wire.ts              请求/响应工具
  trust-fence.ts       loopback / 可信主机请求围栏
  settings-shared.ts   宿主与客户端共享的偏好词汇
  context-types.ts     Cordis Context 类型增强
  client/
    index.tsx          client：面板、输入框、设置区、浮动菜单
    api.ts             client↔host API 类型
    locales.ts         中/英词典
    client.module.css  面板/输入框/设置样式
    layout.css         #root margin-right 随面板宽度
cordis.patch.yml       bundle 补丁层（dsh.bundle.patch）
dsh.plugin.json        外部插件清单
tsdown.config.ts       bundle 配置（client externals + CSS 内联）
```

## 许可证

MIT。基于 [heartmove/dsh-side-chat](https://github.com/heartmove/dsh-side-chat)（MIT）分叉修改；信任围栏为上游代码的纯 JS 移植。
