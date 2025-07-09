import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'myfitness-web',
    },
  },
});

// Auth helper functions (ready for future implementation)
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

// Auth state change listener
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

// Password reset
export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  
  return { data, error };
}

// Update password
export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
  
  return { data, error };
}

// Update user profile
export async function updateProfile(updates: { email?: string; data?: any }) {
  const { data, error } = await supabase.auth.updateUser(updates);
  return { data, error };
}

// Storage helpers (for future file uploads)
export async function uploadFile(bucket: string, path: string, file: File) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);
  
  return { data, error };
}

export async function deleteFile(bucket: string, path: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  
  return { data, error };
}

export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
}

// Real-time subscriptions (for future features)
export function subscribeToGoalChanges(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel('goal-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'goals',
        filter: `userId=eq.${userId}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToProgressChanges(goalId: string, callback: (payload: any) => void) {
  return supabase
    .channel('progress-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'progress',
        filter: `goalId=eq.${goalId}`,
      },
      callback
    )
    .subscribe();
}

// Health check
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    return { connected: !error, error };
  } catch (error) {
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Unknown Supabase error' 
    };
  }
}

export default supabase;