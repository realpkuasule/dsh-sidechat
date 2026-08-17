# dsh-sidechat — 侧边聊天 (Side chat)

> Fork of [heartmove/dsh-side-chat](https://github.com/heartmove/dsh-side-chat) (MIT)，在此基础上重做为我们的 **dsh-sidechat**。

一个 [DSH](https://www.deepseek.com) 网页插件，**Codex 式侧边聊天**：右侧面板提供按主会话隔离的
独立 agent 聊天——继承主会话的工具集、模型、思考难度与权限预设，能感知所在工作目录；
AI 回复可**带回主会话**（直接带回或摘要后带回，写入草稿或注入为折叠提示行）。
当主 agent 弹出**问题弹框**时，还可把问题与选项带入侧聊分析，不打断主流程。

## 与上游（dsh-side-chat）的差异

1. **选中内容注入输入框，默认不发送**。选中文本 →「在侧边聊天中提问」只是打开侧聊并把内容
   写进输入框草稿，由你确认后再发送（设置里可改回"立即发送"；「继续在激活的侧边聊天中提问」
   会**追加**到已有草稿而不是覆盖）。
2. **一键新建侧聊**。面板右上角新增「+ 新建侧边聊天」按钮：立即创建一个空的侧聊会话并聚焦输入框。
3. 品牌与命名空间改为 `dsh-sidechat`（设置命名空间、记录文件、bundle id 等）。

其余能力与上游一致：按会话隔离的隐藏普通会话、模型/思考难度/权限逐聊可调、
「需要时查工作区/主会话」开关、问题弹框侧聊、拖拽调宽、中英文跟随。

## 使用

1. **新建侧聊**：打开面板（选中文本提问、或面板收起条展开）→ 点右上角「+」。
2. **选中提问**：选中主对话任意文本 → 「在侧边聊天中提问」→ 内容进入输入框（不发送）→ 编辑后回车发送。
3. **带回主会话**：侧聊 AI 回复下方「直接带回 / 摘要后带回」（写入主会话草稿或折叠上下文行）。
4. **推送给主 agent**（配合 [dsh-side-notify](https://github.com/realpkuasule/dsh-side-notify)）：右下角「通知主 agent」胶囊或
   `/notify <内容>`、`/to-main <内容>` 命令，直接让主 agent 处理。

## 安装

```bash
# 从 GitHub 安装（git 依赖会在安装时执行构建脚本，首次需在 profile 的
# pnpm-workspace.yaml 中放行 dsh-sidechat 的 onlyBuiltDependencies 后重试）
dsh plugin --profile web add github:realpkuasule/dsh-sidechat
# 配套推送插件（可选，推荐）
dsh plugin --profile web add github:realpkuasule/dsh-side-notify

# 或本地源码安装（软链接，改代码即生效）
dsh plugin --profile web add ./dsh-sidechat
```

重启 `dsh web` 并硬刷新页面（Cmd/Ctrl+Shift+R）后生效。

## 构建

```bash
pnpm install
pnpm build     # tsc -p tsconfig.build.json && tsdown → lib/
```

`lib/` 即产物：`lib/index.js`（host）、`lib/client.js`（profile 渠道）、`lib/client-registry.js`（插件注册渠道）。

## 项目布局

```
src/
  index.ts             host：/sidechat/api JSON 路由、会话/agent 生命周期、转录折叠
  wire.ts              请求/响应工具
  trust-fence.ts       loopback / 可信 API 请求围栏
  settings-shared.ts   宿主与客户端共享的偏好词汇
  context-types.ts     Cordis Context 类型增强
  client/
    index.tsx          client：面板、输入框、设置区、浮动菜单、新建按钮
    api.ts             client↔host API 类型
    locales.ts         中/英词典
    client.module.css  面板/输入框/设置样式
    layout.css         #root margin-right 随面板宽度
cordis.patch.yml       bundle 补丁层（insert 挂载行；dsh.bundle.patch）
dsh.plugin.json        外部插件清单
tsdown.config.ts       bundle 配置（client externals + CSS 内联）
```

## 许可证

MIT。基于 [heartmove/dsh-side-chat](https://github.com/heartmove/dsh-side-chat)（MIT）分叉修改。
