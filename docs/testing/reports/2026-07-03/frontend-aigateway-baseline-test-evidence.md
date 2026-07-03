# Frontend and AI Gateway Baseline Test Evidence

## 测试范围

- Issue: [#541](https://github.com/Sakayori-Iroha-168/Software_Teamwork/issues/541) `[T-014] 前端质量门与 AI Gateway 服务测试链路验证`
- 测试分支: `Test/test/frontend-aigateway-baseline`
- Base branch: `upstream/develop`
- 被测 commit: `2cbb16aaed14153dfd52e4b3ca99d243458938ba`
- 测试负责人: `@AKTNL`
- 测试环境: 本地自动化 / Windows `Microsoft Windows NT 10.0.26200.0` / `AMD64`
- Bun: `1.3.14`
- Go: `go version go1.25.6 windows/amd64`

## 已运行命令与结果

| 命令 | 结果 | 证据 |
| --- | --- | --- |
| `git fetch upstream --prune` | pass | 已同步 `upstream/develop` 到 `2cbb16aaed14153dfd52e4b3ca99d243458938ba`。 |
| `git merge --ff-only upstream/develop` | pass | 测试分支已 fast-forward 到最新 `upstream/develop`。 |
| `bun --version` | pass | 输出 `1.3.14`。 |
| `go version` | pass | 输出 `go version go1.25.6 windows/amd64`。 |
| `bun install --frozen-lockfile` | pass | Checked 559 installs across 599 packages, no changes, `0.08s`。 |
| `bun run --cwd apps/web check` | pass | `typecheck`、`typecheck:test`、`lint`、`format:check` 全部通过，`13.95s`。 |
| `bun run --cwd apps/web build` | pass | Vite production build 通过，`10.04s`；保留既有 chunk size warning。 |
| `bun run --cwd apps/web test:unit` | pass | `31 passed (31)` test files，`109 passed (109)` tests，`8.43s`。 |
| `cd services/ai-gateway && go test ./...` | pass | AI Gateway 所有包测试通过，`0.56s`；本轮复验使用 Go test cache。 |
| `cd services/ai-gateway && go build ./cmd/server` | pass | server build 通过，`7.23s`。 |

## 未运行项

| 测试项 | 未运行原因 | 缺失环境 | 残余风险 | 后续归属 |
| --- | --- | --- | --- | --- |
| 完整本地联调栈 / Docker Compose / 数据库 migration / env-gated smoke / 真实 provider smoke | #541 明确边界不要求这些验证，本任务只覆盖前端质量门、前端单元测试和 AI Gateway 单服务本地自动化链路。 | 未启动完整 host-run 服务栈，未提供真实 provider 凭据。 | 本记录不证明跨服务 E2E、真实 provider 调用或完整本地联调链路通过。 | 后续跨服务 smoke 和真实 provider 验证按对应 owner issue 执行。 |

## 缺陷处理

| 问题 | 等级 | 处理结论 | 复现或验证 |
| --- | --- | --- | --- |
| 首次执行 `bun run --cwd apps/web check` 时，`format:check` 报告 31 个前端文件格式不一致。 | 小问题 | 已执行 `bun run --cwd apps/web format` 规范化本地前端格式；复验后 `check` 通过。 | 最新基线复验中 `bun run --cwd apps/web check` pass。 |
| `bun run --cwd apps/web build` 输出 Vite chunk size warning。 | 非阻塞提示 | 暂不处理；构建退出码为 0。 | 最新基线复验中 `build` pass。 |

## 最终结论

测试通过。前端质量门、前端生产构建、前端单元测试、AI Gateway `go test ./...` 和 server build 均已在最新 `upstream/develop` 基线上完成验证。
