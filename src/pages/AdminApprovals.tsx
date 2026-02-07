import { useEffect, useState } from "react";
import { rtdbGet, rtdbRemove, rtdbSet, rtdbPushKey } from "../lib/rtdb";
import { useAuth } from "../auth/AuthProvider";

export default function AdminApprovals(){
  const { user } = useAuth();
  const [pending,setPending]=useState<any>({});
  const [msg,setMsg]=useState<string|null>(null);

  async function load(){ setPending(await rtdbGet<any>("approvals/pending") ?? {}); }
  useEffect(()=>{ load(); },[]);

  async function approve(id:string){
    const p = pending[id]; if(!p||!user) return;
    const txId = rtdbPushKey(`transactions/${p.loaneeId}`);
    await rtdbSet(`transactions/${p.loaneeId}/${txId}`,{ amount:p.amount, date:p.date, note:p.note, status:p.status });
    await rtdbRemove(`approvals/pending/${id}`);
    setMsg("Approved"); await load();
  }

  return (
    <div style={{maxWidth:800,margin:"20px auto",padding:16}}>
      <h2>ADMIN Approvals</h2>
      {msg && <p>{msg}</p>}
      <ul>
        {Object.keys(pending||{}).map(id=>(
          <li key={id}>{id} <button onClick={()=>approve(id)}>Approve</button></li>
        ))}
      </ul>
    </div>
  );
}
