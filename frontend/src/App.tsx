
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import EngineerDashboard from "./pages/engineer/EngineerDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import MyDocumentsPage from "./pages/engineer/MyDocumentsPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRedirect from "./routes/RoleRedirect";
import DashboardLayout from "./layouts/DashboardLayout";
import UploadDocumentPage from "./pages/engineer/UploadDocumentPage";
import DocumentDetailsPage from "./pages/engineer/DocumentDetailsPage";
import ManagerDocumentsPage from "./pages/manager/ManagerDocumentsPage";
import ManagerDocumentDetailsPage from "./pages/manager/ManagerDocumentDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleRedirect />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Engineer Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Engineer"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/engineer" element={<EngineerDashboard />} />
           <Route path="/engineer/documents" element={<MyDocumentsPage />} />
            <Route
  path="/engineer/upload"
  element={<UploadDocumentPage />}
/>
<Route
  path="/engineer/documents/:id"
  element={<DocumentDetailsPage />}
/>
          </Route>
        </Route>

        {/* Manager Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route
  path="/manager/documents"
  element={<ManagerDocumentsPage />}
/>
<Route
  path="/manager/documents/:id"
  element={<ManagerDocumentDetailsPage />}
/>
            <Route
              path="/manager/pending"
              element={<ManagerDashboard />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
