import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatMessages from '../components/chat/ChatMessages';
import ChatInput from '../components/chat/ChatInput';
import type { Conversation, Message } from '../types';
import styles from './ChatPage.module.css';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const STORAGE_KEY = 'qa-chat-conversations';

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function saveConversations(list: Conversation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch { /* ignore */ }
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeId, setActiveId] = useState<string>(() =>
    conversations.length > 0 ? conversations[0].id : '',
  );
  const [streaming, setStreaming] = useState(false);

  const activeConv = conversations.find((c) => c.id === activeId);
  const messages = activeConv?.messages ?? [];

  const persist = useCallback((updated: Conversation[]) => {
    setConversations(updated);
    saveConversations(updated);
  }, []);

  /* ── Conversation CRUD ── */
  const createConv = useCallback(() => {
    const conv: Conversation = {
      id: generateId(),
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
    };
    const updated = [conv, ...conversations];
    setActiveId(conv.id);
    persist(updated);
  }, [conversations, persist]);

  const deleteConv = useCallback(
    (id: string) => {
      const updated = conversations.filter((c) => c.id !== id);
      if (activeId === id) {
        setActiveId(updated.length > 0 ? updated[0].id : '');
      }
      persist(updated);
    },
    [activeId, conversations, persist],
  );

  /* ── Send message (mock SSE) ── */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || streaming) return;
      if (!activeId) return;

      const userMsg: Message = {
        id: generateId(),
        role: 'user',
        content: text,
        timestamp: Date.now(),
      };

      // Auto-title on first message
      let currentConv = conversations.find((c) => c.id === activeId)!;
      const isFirstMsg = currentConv.messages.length === 0;

      if (isFirstMsg) {
        currentConv = { ...currentConv, title: text.slice(0, 30) + (text.length > 30 ? '…' : '') };
      }

      const assistantMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        thinking: [],
        citations: [],
      };

      const withUser = {
        ...currentConv,
        messages: [...currentConv.messages, userMsg, assistantMsg],
      };

      const updated = conversations.map((c) => (c.id === activeId ? withUser : c));
      persist(updated);
      setStreaming(true);

      // Simulate SSE stream with thinking steps
      const steps = [
        { type: 'intent' as const, label: '识别意图' },
        { type: 'retrieval' as const, label: '检索知识库' },
        { type: 'generation' as const, label: '生成回答' },
      ];

      for (const step of steps) {
        await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== activeId) return c;
            const msgs = [...c.messages];
            const last = msgs[msgs.length - 1];
            if (last.role !== 'assistant') return c;
            msgs[msgs.length - 1] = {
              ...last,
              thinking: [...(last.thinking || []), { type: step.type, label: step.label, status: 'done' as const }],
            };
            return { ...c, messages: msgs };
          }),
        );
      }

      // Stream tokens
      const demoAnswer =
        '根据知识库检索结果，电力变压器的例行巡检主要包括以下要点：\n\n' +
        '1. **外观检查**：检查变压器外壳是否有渗油、锈蚀现象，套管是否清洁完整[1]。\n\n' +
        '2. **油温监测**：上层油温一般不应超过85°C，温升不超过55°C[2]。\n\n' +
        '3. **吸湿器检查**：检查吸湿器硅胶是否变色，如由蓝色变为粉红色则需要更换[1]。\n\n' +
        '4. **声音判断**：正常运行时应为均匀的"嗡嗡"声，如出现异常声响需停机检查[3]。\n\n' +
        '以上为日常巡检的基本要点，具体项目应参照《电力变压器运行规程》要求执行。';

      const chars = [...demoAnswer];
      for (let i = 0; i < chars.length; i += 2) {
        await new Promise((r) => setTimeout(r, 20 + Math.random() * 30));
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== activeId) return c;
            const msgs = [...c.messages];
            const last = msgs[msgs.length - 1];
            if (last.role !== 'assistant') return c;
            msgs[msgs.length - 1] = {
              ...last,
              content: demoAnswer.slice(0, i + 2),
            };
            return { ...c, messages: msgs };
          }),
        );
      }

      // Add mock citations
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeId) return c;
          const msgs = [...c.messages];
          const last = msgs[msgs.length - 1];
          if (last.role !== 'assistant') return c;
          msgs[msgs.length - 1] = {
            ...last,
            citations: [
              { id: '1', docId: 'DOC-001', docName: '电力变压器巡检手册.pdf', text: '变压器外壳应保持清洁，无渗漏油现象...', score: 0.96 },
              { id: '2', docId: 'DOC-002', docName: '变压器运行温度标准.pdf', text: '上层油温不应超过85°C，温升不超过55°C...', score: 0.92 },
              { id: '3', docId: 'DOC-003', docName: '电力设备声音诊断指南.pdf', text: '正常运行的变压器发出均匀的嗡嗡声...', score: 0.88 },
            ],
          };
          return { ...c, messages: msgs };
        }),
      );

      setStreaming(false);
    },
    [activeId, conversations, persist, streaming],
  );

  return (
    <div className={styles.panel}>
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onCreate={createConv}
        onDelete={deleteConv}
      />
      <div className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>
            {activeConv?.title || '智能问答'}
          </h1>
          <Link to="/admin" className={styles.adminLink} title="管理面板">
            ⚙️
          </Link>
        </header>
        <ChatMessages messages={messages} streaming={streaming} />
        <ChatInput onSend={sendMessage} disabled={streaming} />
      </div>
    </div>
  );
}
