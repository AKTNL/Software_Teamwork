import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from '../pages/ChatPage';
import AdminPage from '../pages/AdminPage';
import UserManagement from '../pages/admin/UserManagement';
import RoleManagement from '../pages/admin/RoleManagement';
import StyleManagement from '../pages/admin/StyleManagement';
import ReportCategory from '../pages/admin/ReportCategory';
import FileManagement from '../pages/admin/FileManagement';
import TemplateManagement from '../pages/admin/TemplateManagement';
import MaterialManagement from '../pages/admin/MaterialManagement';
import PromptManagement from '../pages/admin/PromptManagement';
import KnowledgeManagement from '../pages/admin/KnowledgeManagement';
import KnowledgeExperience from '../pages/admin/KnowledgeExperience';
import SystemSettings from '../pages/admin/SystemSettings';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="roles" element={<RoleManagement />} />
          <Route path="styles" element={<StyleManagement />} />
          <Route path="report-categories" element={<ReportCategory />} />
          <Route path="files" element={<FileManagement />} />
          <Route path="templates" element={<TemplateManagement />} />
          <Route path="materials" element={<MaterialManagement />} />
          <Route path="prompts" element={<PromptManagement />} />
          <Route path="knowledge" element={<KnowledgeManagement />} />
          <Route path="knowledge-experience" element={<KnowledgeExperience />} />
          <Route path="settings" element={<SystemSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
