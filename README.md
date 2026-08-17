# dsh-sidechat

Codex-style side chat for [DeepSeek Harness](https://www.deepseek.com) (DSH): an independent, agentic chat in a right-side panel, isolated per main conversation. Forked from [heartmove/dsh-side-chat](https://github.com/heartmove/dsh-side-chat) (MIT).

> 中文文档：[README.zh.md](./README.zh.md)

## Features

- **Side chat in a right-side panel** — a real DSH agent session, hidden and archived, scoped to the conversation it was started from and aware of its workspace.
- **Inherits main-conversation context** — toolset, model, thinking effort, permission preset and working directory, each adjustable per chat.
- **Select → ask, without auto-send** — selecting text and choosing "Ask in side chat" opens the panel and writes the selection into the input; nothing is sent until you press Enter (auto-send is opt-in via settings).
- **One-click new chat** — a "+" button in the panel header creates a fresh empty side chat and focuses the input.
- **Bring replies back to the main conversation** — insert a whole reply or a selection, directly or summarized, into the main composer draft or as a collapsed context row.
- **Question-dialog side chat** — when the main agent asks you a question, bring the question and options into the side chat for analysis without interrupting the main flow, then bring the answer back.
- **Convenience** — resizable (280–720 px) and collapsible panel, per-chat delete, "look up workspace / parent when needed" switch, zh/en UI following the DSH language setting.

## Differences from upstream (dsh-side-chat)

1. **Selections land in the input, not auto-sent.** `sendImmediately` now defaults to off; "Continue active side chat" appends to the existing draft instead of replacing it.
2. **One-click new chat.** A "+" button in the panel header starts a new side chat immediately.
3. **Rebranded** as `dsh-sidechat` (settings namespace, record file, bundle ids).

Everything else matches upstream.

## Install

### From GitHub

```bash
dsh plugin --profile web add github:realpkuasule/dsh-sidechat
```

Git installs build from source on install. pnpm ≥ 10 blocks the package's build script until allowed, so the first `add` fails with an "Ignored build scripts" hint — copy the exact package key it prints into the profile's `pnpm-workspace.yaml`:

```yaml
onlyBuiltDependencies:
  - dsh-sidechat
```

Then re-run the `add`. Restart `dsh web` and hard-refresh the page (Cmd/Ctrl+Shift+R).

### From a local checkout

```bash
dsh plugin --profile web add ./dsh-sidechat
```

The checkout is linked, so local edits apply without reinstalling.

### Companion plugin

[dsh-side-notify](https://github.com/realpkuasule/dsh-side-notify) adds active push-to-main: a floating "Notify main agent" pill and `/notify`, `/to-main` commands that deliver a message straight to the main agent as its next turn.

```bash
dsh plugin --profile web add github:realpkuasule/dsh-side-notify
```

## Usage

1. **Start a side chat** — select any text in the main conversation and click "Ask in side chat" (the text lands in the input, not sent), or open the panel and click "+".
2. **Chat independently** — adjust model / effort / permission per chat; enable "look up workspace / parent when needed" when the task needs more context.
3. **Bring it back** — click "Insert directly" or "Summarize & insert" under a reply (or select part of it) to place it in the main composer draft or as a collapsed context row.
4. **Answer question dialogs thoughtfully** — while the main agent waits on a question dialog, side-chat about the question and options first, then bring the answer back.

## Settings

DSH Settings → 侧边聊天 (Side chat):

| Setting | Default | Description |
|---|---|---|
| `lookupDefault` | off | Default state of the "look up workspace / parent when needed" switch for new chats. |
| `sendImmediately` | **off** | When on, selections are sent immediately with `defaultPrompt` appended; when off, they are staged in the input. |
| `defaultPrompt` | (empty) | Prompt appended to immediately-sent selections. |
| `bringMode` | `draft` | Where brought-back content lands: into the composer draft, or as a collapsed context row. |

## How it works

Every side chat is an ordinary DSH session whose `meta.parentSession` links it to the conversation that started it; it is archived immediately so it never appears in the session list or subagent catalog. The host half (`/sidechat/api` JSON routes) creates and drives those sessions through the live agent (`agent.followup`), inheriting the launching conversation's composition, and brings replies back through `agent.inject` or the composer input. The client half is a portal-mounted React panel that talks to the host routes over same-origin POSTs guarded by the same loopback / trusted-authority fence as the DSH API gateway.

## Development

```bash
pnpm install
pnpm build     # tsc -p tsconfig.build.json && tsdown → lib/
pnpm typecheck
```

`lib/` holds the artifacts: `lib/index.js` (host), `lib/client.js` (profile channel), `lib/client-registry.js` (plugin-registry channel). The `prepare` script runs the same tsdown build, so GitHub installs build from source.

```
src/
  index.ts             host: /sidechat/api routes, session/agent lifecycle, transcript folding
  wire.ts              request/response helpers
  trust-fence.ts       loopback / trusted-authority request fence
  settings-shared.ts   preference vocabulary shared by host and client
  context-types.ts     Cordis Context type augmentations
  client/
    index.tsx          client: panel, composer, settings section, floating menus
    api.ts             client↔host API types
    locales.ts         zh/en dictionaries
    client.module.css  panel/composer/settings styles
    layout.css         #root margin-right driven by panel width
cordis.patch.yml       bundle patch layer (dsh.bundle.patch)
dsh.plugin.json        external plugin manifest
tsdown.config.ts       bundle config (client externals + CSS inlining)
```

## License

MIT. Forked from [heartmove/dsh-side-chat](https://github.com/heartmove/dsh-side-chat) (MIT); the trust fence is a plain-JS port of the upstream copy.
