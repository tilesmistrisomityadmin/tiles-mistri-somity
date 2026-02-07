import { ref, get, set, update, push, remove } from "firebase/database";
import { db } from "./firebase";

export async function rtdbGet<T>(path: string): Promise<T | null> {
  const snap = await get(ref(db, path));
  return snap.exists() ? (snap.val() as T) : null;
}
export async function rtdbSet(path: string, value: unknown) { await set(ref(db, path), value); }
export async function rtdbUpdate(path: string, value: Record<string, unknown>) { await update(ref(db, path), value); }
export function rtdbPushKey(path: string) { return push(ref(db, path)).key!; }
export async function rtdbRemove(path: string) { await remove(ref(db, path)); }
