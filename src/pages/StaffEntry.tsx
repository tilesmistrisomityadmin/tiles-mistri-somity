import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { rtdbGet, rtdbSet, rtdbPushKey } from "../lib/rtdb";

export default function StaffEntry(){
  const { user } = useAuth();
  const [loanees,setLoanees]=useState<any>({});
  const [loaneeId,setLoaneeId]=useState("");
  const [amount,setAmount]=useState(0);
  const [note,setNote]=useState("");
  const [date,setDate]=useState(new Date().toISOString().slice(0,10));
  const [msg,setMsg]=useState<string|null>(null);

  useEffect(()=>{ (async()=>{
    const d = await rtdbGet<any>("loanees"); if(d) setLoanees(d);
  })(); },[]);

  async function submit(){
    if(!user) return;
    const id = rtdbPushKey("approvals/pending");
    await rtdbSet(`approvals/pending/${id}`,{
      loaneeId, amount:Number(amount), note, date, createdByUid:user.uid, createdAt:Date.now(), status:"PAID", type:"kisti"
    });
    setMsg("Saved to pending");
  }

  return (
    <div style={{maxWidth:600,margin:"20px auto",padding:16}}>
      <h2>STAFF Entry</h2>
      <select value={loaneeId} onChange={e=>setLoaneeId(e.target.value)}>
        <option value="">-- select --</option>
        {Object.keys(loanees).map(k=><option key={k} value={k}>{k}</option>)}
      </select>
      <input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))}/>
      <input placeholder="Note" value={note} onChange={e=>setNote(e.target.value)}/>
      <input value={date} onChange={e=>setDate(e.target.value)}/>
      <button onClick={submit}>Submit</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
