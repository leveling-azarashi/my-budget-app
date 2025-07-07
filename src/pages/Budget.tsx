
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';
import BudgetOverview from '@/components/budget/BudgetOverview';
import ExpenseTracker from '@/components/budget/ExpenseTracker';
import MonthlyAnalytics from '@/components/budget/MonthlyAnalytics';
import SmartSuggestions from '@/components/budget/SmartSuggestions';
import CurrencyConverter from '@/components/budget/CurrencyConverter';
import { BudgetProvider } from '@/components/budget/BudgetContext';

const Budget = () => {
  const navigate = useNavigate();

  return (
    <BudgetProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Budget Manager</h1>
              <p className="text-gray-600 dark:text-gray-400">Track your expenses and manage your budget across different categories</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/settings')}>
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="expenses">Add Expenses</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="converter">Converter</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <BudgetOverview />
            </TabsContent>

            <TabsContent value="expenses">
              <ExpenseTracker />
            </TabsContent>

            <TabsContent value="analytics">
              <MonthlyAnalytics />
            </TabsContent>

            <TabsContent value="suggestions">
              <SmartSuggestions />
            </TabsContent>

            <TabsContent value="converter">
              <CurrencyConverter />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </BudgetProvider>
  );
};

export default Budget;
