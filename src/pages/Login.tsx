import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuth } from "../auth/AuthProvider";
import { Navigate } from "react-router-dom";

export default function Login(){
  const { user } = useAuth();
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [msg,setMsg]=useState<string|null>(null);
  const [busy,setBusy]=useState(false);
  if(user) return <Navigate to="/" replace/>;
  return (
    <div style={{maxWidth:420,margin:"40px auto",padding:16,border:"1px solid #eee",borderRadius:10}}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
      <button disabled={busy} onClick={async()=>{
        setBusy(true); setMsg(null);
        try{ await signInWithEmailAndPassword(auth,email.trim(),pass); }
        catch(e:any){ setMsg(e?.message ?? "Login failed"); }
        finally{ setBusy(false); }
      }}>{busy?"Logging in...":"Login"}</button>
      {msg && <p style={{color:"crimson"}}>{msg}</p>}
    </div>
  );
}
