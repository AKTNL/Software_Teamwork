import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Message, Citation, ThinkingStep } from '../../types';
import styles from './ChatMessages.module.css';

interface Props {
  messages: Message[];
  streaming: boolean;
}

function CitationTooltip({ c }: { c: Citation }) {
  const [open, setOpen] = useState(false);
  return (
    <span className={styles.citationWrap}>
      <button
        className={styles.citationBadge}
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      >
        [{c.id}]
      </button>
      {open && (
        <div className={styles.citationPopover}>
          <div className={styles.citationPopTitle}>{c.docName}</div>
          <div className={styles.citationPopText}>「{c.text}」</div>
          <div className={styles.citationPopScore}>相关度: {(c.score * 100).toFixed(0)}%</div>
        </div>
      )}
    </span>
  );
}

function ThinkPanel({ steps, done }: { steps: ThinkingStep[]; done: boolean }) {
  const [collapsed, setCollapsed] = useState(done);

  useEffect(() => {
    if (done) {
      const timer = setTimeout(() => setCollapsed(true), 3000);
      return () => clearTimeout(timer);
    }
    setCollapsed(false);
  }, [done]);

  return (
    <div className={styles.thinkPanel}>
      <button className={styles.thinkToggle} onClick={() => setCollapsed(!collapsed)}>
        <span className={styles.thinkIcon}>{collapsed ? '▶' : '▼'}</span>
        <span>思考过程 ({steps.length} 步)</span>
        {done && <span className={styles.thinkDone}>✓</span>}
      </button>
      {!collapsed && (
        <div className={styles.thinkSteps}>
          {steps.map((s, i) => (
            <div key={i} className={styles.thinkStep}>
              <span className={`${styles.thinkDot} ${s.status === 'done' ? styles.dotDone : styles.dotPending}`} />
              <span>{s.label}</span>
              {s.status === 'done' && <span className={styles.thinkCheck}>✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MessageBubble({ msg, streaming }: { msg: Message; streaming: boolean }) {
  const isUser = msg.role === 'user';
  const hasThinking = msg.thinking && msg.thinking.length > 0;
  const hasCitations = msg.citations && msg.citations.length > 0;
  const isLastAssistant = !isUser && streaming;

  return (
    <div className={`${styles.bubbleWrap} ${isUser ? styles.userWrap : styles.assistantWrap}`}>
      {!isUser && <div className={styles.avatar}>AI</div>}

      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.assistantBubble}`}>
        {/* Thinking steps */}
        {hasThinking && (
          <ThinkPanel steps={msg.thinking!} done={!isLastAssistant && !streaming} />
        )}

        {/* Content */}
        <div className={styles.content}>
          {isUser ? (
            <p>{msg.content}</p>
          ) : msg.content ? (
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          ) : streaming ? (
            <span className={styles.cursor}>▊</span>
          ) : (
            <span className={styles.emptyContent}>（无内容）</span>
          )}
        </div>

        {/* Citations */}
        {hasCitations && (
          <div className={styles.citations}>
            <div className={styles.citationsTitle}>📎 引用来源</div>
            <div className={styles.citationsList}>
              {msg.citations!.map((c) => (
                <CitationTooltip key={c.id} c={c} />
              ))}
            </div>
          </div>
        )}
      </div>

      {isUser && <div className={`${styles.avatar} ${styles.userAvatar}`}>我</div>}
    </div>
  );
}

export default function ChatMessages({ messages, streaming }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  return (
    <div className={styles.area}>
      {messages.length === 0 && (
        <div className={styles.welcome}>
          <h2 className={styles.welcomeTitle}>智能问答系统</h2>
          <p className={styles.welcomeSub}>基于 RAG 的电力行业知识问答助手</p>
          <div className={styles.welcomeHints}>
            <span>💡 试试问：变压器巡检有哪些要点？</span>
            <span>📄 支持多知识库联合检索</span>
            <span>🔗 回答附带引用溯源</span>
          </div>
        </div>
      )}
      {messages.map((msg, i) => {
        const isLast = i === messages.length - 1;
        const isStreamingAssistant = isLast && msg.role === 'assistant' && streaming;
        return (
          <MessageBubble key={msg.id} msg={msg} streaming={isStreamingAssistant} />
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
