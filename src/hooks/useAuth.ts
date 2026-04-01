import { useState, useEffect, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string | null;
  sms_opt_in: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile from profiles table
  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setProfile(data as Profile);
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUp = useCallback(
    async (params: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      mobile?: string;
      smsOptIn?: boolean;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            first_name: params.firstName,
            last_name: params.lastName,
          },
        },
      });

      if (error) return { error: error.message, user: null };

      // Insert profile row
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          first_name: params.firstName,
          last_name: params.lastName,
          email: params.email,
          mobile: params.mobile || null,
          sms_opt_in: params.smsOptIn || false,
        });
        await fetchProfile(data.user.id);
      }

      return { error: null, user: data.user };
    },
    [fetchProfile],
  );

  /**
   * Auto-create account from lead capture form.
   * Uses a random temp password; sends password reset email so user can set their own.
   */
  const signUpFromLead = useCallback(
    async (params: {
      email: string;
      firstName: string;
      lastName: string;
      mobile?: string;
      smsOptIn?: boolean;
    }) => {
      const tempPassword = crypto.randomUUID();

      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: tempPassword,
        options: {
          data: {
            first_name: params.firstName,
            last_name: params.lastName,
          },
        },
      });

      if (error) {
        // Check for duplicate email
        const isDuplicate =
          error.message.toLowerCase().includes('already registered') ||
          error.message.toLowerCase().includes('already been registered') ||
          error.message.toLowerCase().includes('user already registered');
        return { error: error.message, user: null, isDuplicate };
      }

      if (data.user) {
        // Create profile row
        await supabase.from('profiles').upsert({
          id: data.user.id,
          first_name: params.firstName,
          last_name: params.lastName,
          email: params.email,
          mobile: params.mobile || null,
          sms_opt_in: params.smsOptIn || false,
        });

        await fetchProfile(data.user.id);

        // Send password setup email
        const appUrl = window.location.origin;
        await supabase.auth.resetPasswordForEmail(params.email, {
          redirectTo: `${appUrl}/set-password`,
        });
      }

      return { error: null, user: data.user, isDuplicate: false };
    },
    [fetchProfile],
  );

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  return {
    user,
    profile,
    loading,
    signUp,
    signUpFromLead,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };
}
