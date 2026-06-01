import Dexie, { type Table } from 'dexie';

export interface Expense {
  id?: number;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

export interface UserProfile {
  id?: number;
  name: string;
  toxicLevel: number; // 1-10
}

export class ToxicDB extends Dexie {
  expenses!: Table<Expense>;
  userProfile!: Table<UserProfile>;

  constructor() {
    super('ToxicFinancialDB');
    this.version(1).stores({
      expenses: '++id, category, date',
      userProfile: '++id, name'
    });
  }
}

export const db = new ToxicDB();
