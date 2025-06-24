
import React, { createContext, useContext, useState } from 'react';

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  source: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
}

export interface IncomeSource {
  id: string;
  name: string;
  balance: number;
  type: 'checking' | 'savings' | 'credit' | 'cash' | 'other';
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

interface BudgetContextType {
  expenses: Expense[];
  categories: BudgetCategory[];
  incomeSources: IncomeSource[];
  currency: Currency;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateCategoryLimit: (categoryId: string, limit: number) => void;
  setCurrency: (currency: Currency) => void;
  addCategory: (category: Omit<BudgetCategory, 'id' | 'spent'>) => void;
  updateCategory: (categoryId: string, updates: Partial<BudgetCategory>) => void;
  deleteCategory: (categoryId: string) => void;
  addIncomeSource: (source: Omit<IncomeSource, 'id'>) => void;
  updateIncomeSource: (sourceId: string, updates: Partial<IncomeSource>) => void;
  deleteIncomeSource: (sourceId: string) => void;
}

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' }
];

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

export const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currency, setCurrency] = useState<Currency>(currencies[0]);
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: '1', name: 'Groceries', limit: 500, spent: 0, color: 'bg-green-500' },
    { id: '2', name: 'Transport', limit: 200, spent: 0, color: 'bg-blue-500' },
    { id: '3', name: 'Bills', limit: 300, spent: 0, color: 'bg-red-500' },
    { id: '4', name: 'Stationary', limit: 100, spent: 0, color: 'bg-yellow-500' },
    { id: '5', name: 'Entertainment', limit: 150, spent: 0, color: 'bg-purple-500' },
    { id: '6', name: 'Health', limit: 200, spent: 0, color: 'bg-pink-500' },
  ]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([
    { id: '1', name: 'Main Checking', balance: 2500, type: 'checking' },
    { id: '2', name: 'Savings Account', balance: 5000, type: 'savings' },
    { id: '3', name: 'Cash Wallet', balance: 150, type: 'cash' },
  ]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    setExpenses(prev => [...prev, newExpense]);
    
    // Update category spent amount
    setCategories(prev => prev.map(cat => 
      cat.name === expense.category 
        ? { ...cat, spent: cat.spent + expense.amount }
        : cat
    ));

    // Update income source balance
    setIncomeSources(prev => prev.map(source =>
      source.name === expense.source
        ? { ...source, balance: source.balance - expense.amount }
        : source
    ));
  };

  const updateCategoryLimit = (categoryId: string, limit: number) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, limit }
        : cat
    ));
  };

  const addCategory = (category: Omit<BudgetCategory, 'id' | 'spent'>) => {
    const newCategory = { ...category, id: Date.now().toString(), spent: 0 };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (categoryId: string, updates: Partial<BudgetCategory>) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId ? { ...cat, ...updates } : cat
    ));
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const addIncomeSource = (source: Omit<IncomeSource, 'id'>) => {
    const newSource = { ...source, id: Date.now().toString() };
    setIncomeSources(prev => [...prev, newSource]);
  };

  const updateIncomeSource = (sourceId: string, updates: Partial<IncomeSource>) => {
    setIncomeSources(prev => prev.map(source =>
      source.id === sourceId ? { ...source, ...updates } : source
    ));
  };

  const deleteIncomeSource = (sourceId: string) => {
    setIncomeSources(prev => prev.filter(source => source.id !== sourceId));
  };

  return (
    <BudgetContext.Provider value={{ 
      expenses, 
      categories, 
      incomeSources,
      currency, 
      addExpense, 
      updateCategoryLimit, 
      setCurrency,
      addCategory,
      updateCategory,
      deleteCategory,
      addIncomeSource,
      updateIncomeSource,
      deleteIncomeSource
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export { currencies };
