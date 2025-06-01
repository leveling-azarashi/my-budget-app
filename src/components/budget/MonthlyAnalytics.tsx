
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { useBudget } from './BudgetContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const MonthlyAnalytics = () => {
  const { expenses, categories } = useBudget();

  const monthlyData = useMemo(() => {
    const data: { [key: string]: { [category: string]: number } } = {};
    
    expenses.forEach(expense => {
      const month = expense.date.substring(0, 7); // YYYY-MM format
      if (!data[month]) {
        data[month] = {};
      }
      if (!data[month][expense.category]) {
        data[month][expense.category] = 0;
      }
      data[month][expense.category] += expense.amount;
    });

    return Object.entries(data).map(([month, categories]) => ({
      month,
      ...categories,
      total: Object.values(categories).reduce((sum, amount) => sum + amount, 0)
    })).sort((a, b) => a.month.localeCompare(b.month));
  }, [expenses]);

  const categoryAverages = useMemo(() => {
    const totals: { [category: string]: number } = {};
    const counts: { [category: string]: number } = {};

    expenses.forEach(expense => {
      const month = expense.date.substring(0, 7);
      if (!totals[expense.category]) {
        totals[expense.category] = 0;
        counts[expense.category] = 0;
      }
      totals[expense.category] += expense.amount;
    });

    // Count unique months per category
    const monthsPerCategory: { [category: string]: Set<string> } = {};
    expenses.forEach(expense => {
      const month = expense.date.substring(0, 7);
      if (!monthsPerCategory[expense.category]) {
        monthsPerCategory[expense.category] = new Set();
      }
      monthsPerCategory[expense.category].add(month);
    });

    return categories.map(category => ({
      category: category.name,
      average: monthsPerCategory[category.name] ? 
        totals[category.name] / monthsPerCategory[category.name].size : 0,
      monthsActive: monthsPerCategory[category.name] ? monthsPerCategory[category.name].size : 0
    }));
  }, [expenses, categories]);

  return (
    <div className="space-y-6">
      {/* Monthly Averages */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Monthly Category Averages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryAverages.map((item) => (
            <div key={item.category} className="p-4 border rounded-lg">
              <h4 className="font-medium">{item.category}</h4>
              <p className="text-2xl font-bold text-blue-600">
                ${item.average.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                Average per month ({item.monthsActive} months)
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Monthly Spending Trend */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Monthly Spending Trend</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#8884d8" 
              strokeWidth={2}
              name="Total Spending"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Category Breakdown by Month */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Category Breakdown by Month</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            {categories.map((category, index) => (
              <Bar 
                key={category.name}
                dataKey={category.name} 
                stackId="categories"
                fill={`hsl(${index * 60}, 70%, 50%)`}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Spending Summary */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Spending Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium">Total Months Tracked</h4>
            <p className="text-2xl font-bold text-green-600">
              {monthlyData.length}
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium">Average Monthly Spending</h4>
            <p className="text-2xl font-bold text-orange-600">
              ${monthlyData.length > 0 ? 
                (monthlyData.reduce((sum, month) => sum + month.total, 0) / monthlyData.length).toFixed(2) 
                : '0.00'}
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium">Total Expenses Recorded</h4>
            <p className="text-2xl font-bold text-purple-600">
              {expenses.length}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MonthlyAnalytics;
