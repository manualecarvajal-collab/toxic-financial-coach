import { useState, useCallback } from 'react';
import { getRoast, type RoastResponse } from '../services/ai';
import type { Expense } from '../services/db';

interface RoastState {
  status: 'idle' | 'thinking' | 'roasting' | 'done' | 'error';
  response: RoastResponse | null;
  error: string | null;
}

export function useRoast() {
  const [state, setState] = useState<RoastState>({
    status: 'idle',
    response: null,
    error: null
  });

  const generateRoast = useCallback(async (expenses: Expense[]) => {
    setState({ status: 'thinking', response: null, error: null });

    // Simular un pequeño delay para la transición dramática
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      setState(prev => ({ ...prev, status: 'roasting' }));
      const response = await getRoast(expenses);
      setState({ status: 'done', response, error: null });
      return response;
    } catch (err) {
      const errorMsg = 'La IA colapsó procesando tu irresponsabilidad financiera';
      setState({ status: 'error', response: null, error: errorMsg });
      return null;
    }
  }, []);

  const resetRoast = useCallback(() => {
    setState({ status: 'idle', response: null, error: null });
  }, []);

  return {
    ...state,
    generateRoast,
    resetRoast,
    isThinking: state.status === 'thinking' || state.status === 'roasting',
    isDone: state.status === 'done'
  };
}