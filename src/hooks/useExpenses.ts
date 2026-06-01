import { useState, useEffect, useCallback } from 'react';
import { db, type Expense } from '../services/db';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await db.expenses.orderBy('date').reverse().toArray();
      setExpenses(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar gastos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
    try {
      const id = await db.expenses.add(expense as Expense);
      await fetchExpenses();
      return id;
    } catch (err) {
      setError('Error al agregar gasto');
      console.error(err);
      return null;
    }
  }, [fetchExpenses]);

  const deleteExpense = useCallback(async (id: number) => {
    try {
      await db.expenses.delete(id);
      await fetchExpenses();
    } catch (err) {
      setError('Error al eliminar gasto');
      console.error(err);
    }
  }, [fetchExpenses]);

  const clearAllExpenses = useCallback(async () => {
    try {
      await db.expenses.clear();
      await fetchExpenses();
    } catch (err) {
      setError('Error al limpiar gastos');
      console.error(err);
    }
  }, [fetchExpenses]);

  const getWeeklyTotal = useCallback((): number => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return expenses
      .filter(exp => new Date(exp.date) >= weekAgo)
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const getMonthlyTotal = useCallback((): number => {
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return expenses
      .filter(exp => new Date(exp.date) >= monthAgo)
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const getTotalSpent = useCallback((): number => {
    return expenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const getExpenseCount = useCallback((): number => {
    return expenses.length;
  }, [expenses]);

  const groupByCategory = useCallback((): Record<string, number> => {
    return expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [expenses]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return {
    expenses,
    loading,
    error,
    addExpense,
    deleteExpense,
    clearAllExpenses,
    getWeeklyTotal,
    getMonthlyTotal,
    getTotalSpent,
    getExpenseCount,
    groupByCategory,
    refresh: fetchExpenses
  };
}