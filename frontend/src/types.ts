/* ── Chat ── */
export interface Citation {
  id: string;
  docId: string;
  docName: string;
  text: string;
  score: number;
}

export interface ThinkingStep {
  type: 'intent' | 'retrieval' | 'generation' | 'verify';
  label: string;
  status: 'pending' | 'running' | 'done';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  thinking?: ThinkingStep[];
  citations?: Citation[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

/* ── Admin Menu ── */
export interface AdminMenuItem {
  key: string;
  label: string;
  icon?: string;
  path?: string;
  children?: AdminMenuItem[];
}
