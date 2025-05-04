import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const supabase = createClient(
  'https://rjkiufsadapgmrbngokc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqa2l1ZnNhZGFwZ21yYm5nb2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzODIzNDksImV4cCI6MjA2MTk1ODM0OX0.IFt9GgwxU-_regrLrW8YZWsPQKisiTiHKo1IlkW7eLo'
);

export async function checkAuth() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function login(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
}

export async function logout() {
  await supabase.auth.signOut();
  location.reload();
}

export async function register(email, password) {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
}