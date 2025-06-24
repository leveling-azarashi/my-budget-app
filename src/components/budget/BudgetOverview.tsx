
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useBudget } from './BudgetContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const BudgetOverview = () => {
  const { categories, expenses, incomeSources, currency } = useBudget();

  const totalBudget = categories.reduce((sum, cat) => sum + cat.limit, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalBalance = incomeSources.reduce((sum, source) => sum + source.balance, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Budget</h3>
          <p className="text-3xl font-bold text-blue-600">{currency.symbol}{totalBudget}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Spent</h3>
          <p className="text-3xl font-bold text-red-600">{currency.symbol}{totalSpent}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Remaining</h3>
          <p className="text-3xl font-bold text-green-600">{currency.symbol}{totalBudget - totalSpent}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Available Balance</h3>
          <p className="text-3xl font-bold text-purple-600">{currency.symbol}{totalBalance}</p>
        </Card>
      </div>

      {/* Income Sources */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Income Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {incomeSources.map((source) => (
            <div key={source.id} className="p-4 border rounded-lg">
              <h4 className="font-medium text-lg">{source.name}</h4>
              <p className="text-sm text-gray-600 capitalize mb-2">{source.type}</p>
              <p className="text-2xl font-bold text-green-600">{currency.symbol}{source.balance}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Category Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Category Progress</h3>
          <div className="space-y-4">
            {categories.map((category) => {
              const percentage = (category.spent / category.limit) * 100;
              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-gray-600">
                      {currency.symbol}{category.spent} / {currency.symbol}{category.limit}
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2"
                  />
                  <div className="text-xs text-gray-500">
                    {percentage.toFixed(1)}% used
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Spending Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="spent"
                label={({ name, value }) => `${name}: ${currency.symbol}${value}`}
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color.replace('bg-', '#')} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Expenses */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Expenses</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Category</th>
                <th className="text-left py-2">Source</th>
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.slice(-5).reverse().map((expense) => (
                <tr key={expense.id} className="border-b">
                  <td className="py-2">{expense.date}</td>
                  <td className="py-2">{expense.category}</td>
                  <td className="py-2">{expense.source}</td>
                  <td className="py-2">{expense.description}</td>
                  <td className="py-2 text-right">{currency.symbol}{expense.amount}</td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    No expenses recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default BudgetOverview;
