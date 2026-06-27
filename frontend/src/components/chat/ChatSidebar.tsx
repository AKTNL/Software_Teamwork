import type { Conversation } from '../../types';
import styles from './ChatSidebar.module.css';

interface Props {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

export default function ChatSidebar({ conversations, activeId, onSelect, onCreate, onDelete }: Props) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.head}>
        <h2 className={styles.title}>对话历史</h2>
        <button className={styles.newBtn} onClick={onCreate}>
          + 新建对话
        </button>
      </div>
      <div className={styles.list}>
        {conversations.length === 0 && (
          <p className={styles.empty}>暂无对话记录</p>
        )}
        {conversations.map((conv) => (
          <button
            key={conv.id}
            className={`${styles.item} ${conv.id === activeId ? styles.active : ''}`}
            onClick={() => onSelect(conv.id)}
          >
            <span className={styles.itemTitle}>{conv.title}</span>
            <span className={styles.itemMeta}>
              {conv.messages.length} 条消息
            </span>
            <span
              className={styles.deleteBtn}
              title="删除对话"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv.id);
              }}
            >
              ✕
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
