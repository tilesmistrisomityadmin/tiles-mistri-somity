import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { rtdbGet } from "../lib/rtdb";

type Role = "ADMIN" | "STAFF" | "VIEWER";
type AppUser = { uid: string; email: string | null; role: Role; name?: string; active?: boolean };

type AuthCtx = { loading:boolean; fbUser:User|null; user:AppUser|null; logout:()=>Promise<void> };
const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }:{children:React.ReactNode}){
  const [loading,setLoading]=useState(true);
  const [fbUser,setFbUser]=useState<User|null>(null);
  const [user,setUser]=useState<AppUser|null>(null);

  useEffect(()=>onAuthStateChanged(auth, async (u)=>{
    setFbUser(u);
    if(!u){ setUser(null); setLoading(false); return; }
    const rec = await rtdbGet<any>(`users/${u.uid}`);
    if(!rec || rec.active===false || !rec.role) setUser(null);
    else setUser({ uid:u.uid, email:u.email, role:rec.role, name:rec.name, active:rec.active });
    setLoading(false);
  }),[]);

  const value = useMemo(()=>({ loading, fbUser, user, logout: async()=>{ await signOut(auth);} }),[loading,fbUser,user]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useAuth(){ const v=useContext(Ctx); if(!v) throw new Error("useAuth outside provider"); return v; }
