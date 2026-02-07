import { Navigate, Route, Routes, Link } from "react-router-dom";
import { useAuth } from "./auth/AuthProvider";
import Login from "./pages/Login";
import StaffEntry from "./pages/StaffEntry";
import AdminApprovals from "./pages/AdminApprovals";
import NotFound from "./pages/NotFound";

function Guard({ roles, children }:{roles:string[]; children:JSX.Element}){
  const { loading, user } = useAuth();
  if(loading) return <div style={{padding:16}}>Loading...</div>;
  if(!user) return <Navigate to="/login" replace />;
  if(!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function HomeRedirect(){
  const { loading, user } = useAuth();
  if(loading) return <div style={{padding:16}}>Loading...</div>;
  if(!user) return <Navigate to="/login" replace />;
  return user.role==="STAFF" ? <Navigate to="/staff/entry" replace /> : <Navigate to="/admin/approvals" replace />;
}

function Topbar(){
  const { user, logout } = useAuth();
  if(!user) return null;
  return (
    <div style={{display:"flex",gap:12,padding:12,borderBottom:"1px solid #eee"}}>
      <b>Tiles Mistri Somity</b><span>Role: {user.role}</span><div style={{flex:1}}/>
      {user.role==="STAFF" && <Link to="/staff/entry">Entry</Link>}
      {user.role==="ADMIN" && <Link to="/admin/approvals">Approvals</Link>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default function App(){
  return (
    <div>
      <Topbar/>
      <Routes>
        <Route path="/" element={<HomeRedirect/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/staff/entry" element={<Guard roles={["STAFF","ADMIN"]}><StaffEntry/></Guard>}/>
        <Route path="/admin/approvals" element={<Guard roles={["ADMIN"]}><AdminApprovals/></Guard>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </div>
  );
}
