
import React, { createContext, useContext, useState } from 'react';

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

export interface BudgetCategory {
  name: string;
  limit: number;
  spent: number;
  color: string;
}

interface BudgetContextType {
  expenses: Expense[];
  categories: BudgetCategory[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateCategoryLimit: (categoryName: string, limit: number) => void;
}

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
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { name: 'Groceries', limit: 500, spent: 0, color: 'bg-green-500' },
    { name: 'Transport', limit: 200, spent: 0, color: 'bg-blue-500' },
    { name: 'Bills', limit: 300, spent: 0, color: 'bg-red-500' },
    { name: 'Stationary', limit: 100, spent: 0, color: 'bg-yellow-500' },
    { name: 'Entertainment', limit: 150, spent: 0, color: 'bg-purple-500' },
    { name: 'Health', limit: 200, spent: 0, color: 'bg-pink-500' },
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
  };

  const updateCategoryLimit = (categoryName: string, limit: number) => {
    setCategories(prev => prev.map(cat => 
      cat.name === categoryName 
        ? { ...cat, limit }
        : cat
    ));
  };

  return (
    <BudgetContext.Provider value={{ expenses, categories, addExpense, updateCategoryLimit }}>
      {children}
    </BudgetContext.Provider>
  );
};
