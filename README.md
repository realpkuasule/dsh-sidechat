# dsh-sidechat — Side chat for DSH

> Fork of [heartmove/dsh-side-chat](https://github.com/heartmove/dsh-side-chat) (MIT), rebuilt as **dsh-sidechat**.

A [DSH](https://www.deepseek.com) web plugin providing a **Codex-style side chat**: an independent,
agentic chat in a right-side panel, isolated per main conversation. It inherits the main conversation's
toolset, model, thinking effort and permission preset, knows its workspace, and its replies can be
**brought back to the main conversation** (directly or summarized, into the composer draft or as a
collapsed context row). When the main agent pops a **question dialog**, the question and options can be
brought into the side chat for analysis without interrupting the main flow.

> 中文文档：[README.zh.md](./README.zh.md).

## Differences from upstream

1. **Selections land in the input, not auto-sent**. Selecting text and choosing "Ask in side chat" opens
   the panel and writes the selection into the composer draft — nothing is sent until you confirm
   (the old "send immediately" behavior is still available in settings; "Continue active side chat"
   now **appends** to the existing draft instead of replacing it).
2. **One-click new chat**. A "+" button in the panel header creates a fresh empty side chat and focuses
   the input.
3. Rebranded as `dsh-sidechat` (settings namespace, record file, bundle ids).

Everything else matches upstream: hidden ordinary sessions isolated per conversation, per-chat model /
effort / permission selectors, the "look up workspace / parent when needed" switch, question-dialog
side chat, drag-to-resize, zh/en follow.

## Install

```bash
# From GitHub (git installs build on install: on first run, allow `dsh-sidechat`
# in the profile's pnpm-workspace.yaml onlyBuiltDependencies, then retry)
dsh plugin --profile web add github:realpkuasule/dsh-sidechat
dsh plugin --profile web add github:realpkuasule/dsh-side-notify   # optional companion: push to main agent

# Or from a local checkout (linked, edits apply immediately)
dsh plugin --profile web add ./dsh-sidechat
```

Restart `dsh web` and hard-refresh (Cmd/Ctrl+Shift+R).

## Build

```bash
pnpm install
pnpm build   # tsc -p tsconfig.build.json && tsdown → lib/
```

## License

MIT. Forked from [heartmove/dsh-side-chat](https://github.com/heartmove/dsh-side-chat) (MIT).
