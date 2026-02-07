import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthProvider";

import Login from "./pages/Login";
import StaffEntry from "./pages/StaffEntry";
import AdminApprovals from "./pages/AdminApprovals";
import NotFound from "./pages/NotFound";

/* ---------- Guards ---------- */

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireRole({
  role,
  children,
}: {
  role: "ADMIN" | "STAFF";
  children: JSX.Element;
}) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return user.role === "ADMIN" ? (
    <Navigate to="/admin/approvals" replace />
  ) : user.role === "STAFF" ? (
    <Navigate to="/staff/entry" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

/* ---------- App ---------- */

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Root redirect */}
          <Route path="/" element={<HomeRedirect />} />

          {/* STAFF */}
          <Route
            path="/staff/entry"
            element={
              <RequireAuth>
                <RequireRole role="STAFF">
                  <StaffEntry />
                </RequireRole>
              </RequireAuth>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin/approvals"
            element={
              <RequireAuth>
                <RequireRole role="ADMIN">
                  <AdminApprovals />
                </RequireRole>
              </RequireAuth>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
