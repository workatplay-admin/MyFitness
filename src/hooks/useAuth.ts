'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, onAuthStateChange } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      try {
        const { user } = await getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      
      // Handle auth events
      switch (event) {
        case 'SIGNED_IN':
          router.push('/dashboard');
          break;
        case 'SIGNED_OUT':
          router.push('/');
          break;
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed');
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}