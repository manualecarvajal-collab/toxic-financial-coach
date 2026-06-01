export interface Expense {
  id?: number;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

export interface RoastResponse {
  roast: string;
  toxicGrade: string;
  uselessFact: string;
}

export type RoastStatus = 'idle' | 'thinking' | 'roasting' | 'done' | 'error';

export interface RoastState {
  status: RoastStatus;
  response: RoastResponse | null;
  error: string | null;
}

export type ExpenseCategory =
  | 'Comida'
  | 'Transporte'
  | 'Entretenimiento'
  | 'Compras'
  | 'Suscripciones'
  | 'Salud'
  | 'Casa'
  | 'Otros';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Comida',
  'Transporte',
  'Entretenimiento',
  'Compras',
  'Suscripciones',
  'Salud',
  'Casa',
  'Otros'
];

export const CATEGORY_EMOJIS: Record<ExpenseCategory, string> = {
  'Comida': '🍔',
  'Transporte': '🚗',
  'Entretenimiento': '🎮',
  'Compras': '🛍️',
  'Suscripciones': '📱',
  'Salud': '💊',
  'Casa': '🏠',
  'Otros': '❓'
};