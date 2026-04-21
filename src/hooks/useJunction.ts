import { useState, useCallback, useEffect, useRef } from 'react';
import { useVitalLink } from '@tryvital/vital-link';
import { supabase } from '../lib/supabase';

export interface JunctionState {
  junctionUserId: string | null;
  connected: boolean;
  provider: string | null;
  loading: boolean;
  error: string | null;
}

const JUNCTION_ENV = (import.meta.env.VITE_JUNCTION_ENV as string) || 'sandbox';

const STORAGE_KEY = 'stepiq_junction';

function loadPersistedState(): Partial<JunctionState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function persistState(state: JunctionState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      junctionUserId: state.junctionUserId,
      connected: state.connected,
      provider: state.provider,
    }));
  } catch { /* ignore */ }
}

export function useJunction(userId: string | null) {
  const persisted = useRef(loadPersistedState());
  const [state, setState] = useState<JunctionState>({
    junctionUserId: persisted.current.junctionUserId ?? null,
    connected: persisted.current.connected ?? false,
    provider: persisted.current.provider ?? null,
    loading: false,
    error: null,
  });

  const linkTokenRef = useRef<string | null>(null);

  const handleSuccess = useCallback(() => {
    setState(s => {
      const next = { ...s, connected: true, provider: 'wearable' };
      persistState(next);
      return next;
    });
  }, []);

  const handleExit = useCallback(() => {
    setState(s => ({ ...s, loading: false }));
  }, []);

  const handleError = useCallback(() => {
    setState(s => ({ ...s, loading: false, error: 'Connection failed' }));
  }, []);

  const { open, ready } = useVitalLink({
    env: JUNCTION_ENV,
    onSuccess: handleSuccess,
    onExit: handleExit,
    onError: handleError,
  });

  useEffect(() => {
    persistState(state);
  }, [state.connected, state.junctionUserId, state.provider]);

  const connect = useCallback(async () => {
    if (!userId) {
      setState(s => ({ ...s, error: 'Sign in to connect a wearable' }));
      return;
    }

    setState(s => ({ ...s, loading: true, error: null }));

    try {
      const { data, error } = await supabase.functions.invoke('junction-link', {
        body: { user_id: userId },
      });

      if (error || !data?.link_token) {
        setState(s => ({ ...s, loading: false, error: 'Failed to get connection token' }));
        return;
      }

      linkTokenRef.current = data.link_token;

      if (data.junction_user_id) {
        setState(s => ({ ...s, junctionUserId: data.junction_user_id }));
      }

      if (ready) {
        open(data.link_token);
      }
    } catch {
      setState(s => ({ ...s, loading: false, error: 'Connection error' }));
    }
  }, [userId, open, ready]);

  const fetchHR = useCallback(async (): Promise<{ hr: number; source: 'wearable' } | null> => {
    if (!state.junctionUserId || !state.connected) return null;

    try {
      const { data, error } = await supabase.functions.invoke('junction-hr', {
        body: { junction_user_id: state.junctionUserId },
      });

      if (error || !data?.hr) return null;
      return { hr: data.hr, source: 'wearable' };
    } catch {
      return null;
    }
  }, [state.junctionUserId, state.connected]);

  const disconnect = useCallback(() => {
    setState({
      junctionUserId: null,
      connected: false,
      provider: null,
      loading: false,
      error: null,
    });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    ...state,
    connect,
    fetchHR,
    disconnect,
    ready,
  };
}
