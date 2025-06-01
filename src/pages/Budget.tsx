
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BudgetOverview from '@/components/budget/BudgetOverview';
import ExpenseTracker from '@/components/budget/ExpenseTracker';
import MonthlyAnalytics from '@/components/budget/MonthlyAnalytics';
import SmartSuggestions from '@/components/budget/SmartSuggestions';
import CurrencySettings from '@/components/budget/CurrencySettings';
import CurrencyConverter from '@/components/budget/CurrencyConverter';
import { BudgetProvider } from '@/components/budget/BudgetContext';

const Budget = () => {
  return (
    <BudgetProvider>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Manager</h1>
            <p className="text-gray-600">Track your expenses and manage your budget across different categories</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="expenses">Add Expenses</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="currency">Currency</TabsTrigger>
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

            <TabsContent value="currency">
              <CurrencySettings />
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
