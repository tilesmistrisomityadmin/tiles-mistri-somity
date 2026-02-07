import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthProvider";

import Login from "./pages/Login";
import StaffEntry from "./pages/StaffEntry";
import AdminApprovals from "./pages/AdminApprovals";
import NotFound from "./pages/NotFound";

/** ✅ Redirect "/" based on role */
function HomeRedirect() {
  const { loading, user } = useAuth();
  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "ADMIN") return <Navigate to="/admin/approvals" replace />;
  if (user.role === "STAFF") return <Navigate to="/staff/entry" replace />;
  return <div style={{ padding: 16 }}>No access</div>;
}

/** ✅ Require login */
function RequireAuth({ children }: { children: JSX.Element }) {
  const { loading, user } = useAuth();
  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/** ✅ Require role */
function RequireRole({
  role,
  children,
}: {
  role: "ADMIN" | "STAFF";
  children: JSX.Element;
}) {
  const { loading, user } = useAuth();
  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) {
    // wrong role -> go home redirect
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* public */}
          <Route path="/login" element={<Login />} />

          {/* "/" decides where to go */}
          <Route path="/" element={<HomeRedirect />} />

          {/* staff routes */}
          <Route
            path="/staff/entry"
            element={
              <RequireRole role="STAFF">
                <StaffEntry />
              </RequireRole>
            }
          />

          {/* admin routes */}
          <Route
            path="/admin/approvals"
            element={
              <RequireRole role="ADMIN">
                <AdminApprovals />
              </RequireRole>
            }
          />

          {/* catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
