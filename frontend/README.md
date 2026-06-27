# 智能问答系统 — 前端

基于 RAG + LLM 的电力行业智能问答系统前端，使用 **Notion 设计风格**。

## 技术栈

| 技术 | 用途 |
|------|------|
| React 19 | UI 框架 |
| TypeScript | 类型安全 |
| Vite | 构建工具 |
| React Router | 客户端路由 |
| react-markdown | Markdown 渲染 |
| CSS Modules | 样式隔离 |
| Notion Design Tokens | 设计规范 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

启动后访问 http://localhost:5173

## 设计风格

项目使用 Notion 设计令牌（[DESIGN.md](../DESIGN.md)），所有设计变量集中在 `src/styles/design-tokens.css`：

- **主色**：`#5645d4`（Notion 紫）
- **字体**：Inter / Noto Sans SC
- **圆角**：4-24px 多级
- **间距**：4-96px 多级

## 项目结构

```
src/
├── styles/
│   └── design-tokens.css          # Notion 设计令牌（CSS 变量）
├── components/
│   ├── chat/
│   │   ├── ChatSidebar.tsx        # 左侧：对话历史 + 新建对话
│   │   ├── ChatMessages.tsx       # 中间：消息气泡 + 思考过程 + 引用
│   │   └── ChatInput.tsx          # 底部：输入框 + 发送按钮
│   └── admin/
│       └── AdminSidebar.tsx       # 管理面板可折叠菜单
├── pages/
│   ├── ChatPage.tsx               # 对话页（含模拟 SSE 流式对话）
│   ├── AdminPage.tsx              # 管理页（路由容器）
│   └── admin/
│       ├── UserManagement.tsx     # 用户管理
│       ├── RoleManagement.tsx     # 角色管理
│       ├── KnowledgeManagement.tsx # 知识管理
│       ├── KnowledgeExperience.tsx # 知识体验（检索测试页）
│       ├── SystemSettings.tsx     # 系统设置（LLM 配置）
│       └── ...                    # 其他子页面
├── router/
│   └── index.tsx                  # 路由配置
├── types.ts                       # TypeScript 类型定义
└── App.tsx / main.tsx             # 应用入口
```

## 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 重定向 | → `/chat` |
| `/chat` | 对话面板 | 核心对话界面 |
| `/admin/users` | 用户管理 | 系统管理子页 |
| `/admin/roles` | 角色管理 | 系统管理子页 |
| `/admin/styles` | 样式管理 | 系统管理子页 |
| `/admin/report-categories` | 报告类别 | 系统管理子页 |
| `/admin/files` | 文件管理 | 系统管理子页 |
| `/admin/templates` | 模板管理 | 独立页 |
| `/admin/materials` | 材料管理 | 独立页 |
| `/admin/prompts` | 提示词管理 | 独立页 |
| `/admin/knowledge` | 知识管理 | RAG 子页 |
| `/admin/knowledge-experience` | 知识体验 | RAG 子页（含检索测试） |
| `/admin/settings` | 系统设置 | 独立页（含 LLM 配置表单） |

## 已实现功能

- [x] 对话面板：侧边栏 + 消息区 + 输入框布局
- [x] 多会话管理：新建 / 切换 / 删除对话
- [x] LocalStorage 会话持久化，刷新自动恢复
- [x] 模拟 SSE 流式输出（打字机效果）
- [x] 思考过程展示：折叠 / 展开 / 完成自动折叠
- [x] 引用溯源标注：悬浮展示原文片段 + 来源 + 相关性分数
- [x] Markdown 消息渲染（标题、列表、粗体、代码块）
- [x] 管理面板：可折叠多级菜单 + 路由子页面
- [x] 知识体验页：检索测试 UI
- [x] 系统设置页：LLM 配置表单
- [x] 对话 ↔ 管理后台双向导航

## 待实现

- [ ] 对接真实 SSE 后端接口
- [ ] 对接知识库检索 API
- [ ] 用户管理 / 角色管理 CRUD
- [ ] 模板管理 / 材料管理 / 文件管理功能
- [ ] 数据统计图表（ECharts）
- [ ] 暗色模式切换
