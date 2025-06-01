
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { useBudget } from './BudgetContext';
import { AlertTriangle, TrendingDown, Target, Lightbulb } from 'lucide-react';

const SmartSuggestions = () => {
  const { categories, expenses } = useBudget();

  const suggestions = useMemo(() => {
    const suggestions: Array<{
      type: 'warning' | 'tip' | 'goal' | 'insight';
      title: string;
      description: string;
      icon: React.ReactNode;
      priority: number;
    }> = [];

    // Check for overspending
    categories.forEach(category => {
      const percentage = (category.spent / category.limit) * 100;
      
      if (percentage > 100) {
        suggestions.push({
          type: 'warning',
          title: `${category.name} Budget Exceeded`,
          description: `You've spent $${category.spent} out of your $${category.limit} budget (${percentage.toFixed(1)}% over). Consider reducing expenses in this category.`,
          icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
          priority: 1
        });
      } else if (percentage > 80) {
        suggestions.push({
          type: 'warning',
          title: `${category.name} Budget Warning`,
          description: `You've used ${percentage.toFixed(1)}% of your ${category.name} budget. You have $${(category.limit - category.spent).toFixed(2)} remaining.`,
          icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
          priority: 2
        });
      }
    });

    // Find highest spending category
    const highestSpendingCategory = categories.reduce((max, cat) => 
      cat.spent > max.spent ? cat : max, categories[0]);
    
    if (highestSpendingCategory && highestSpendingCategory.spent > 0) {
      suggestions.push({
        type: 'insight',
        title: 'Highest Spending Category',
        description: `${highestSpendingCategory.name} is your highest expense at $${highestSpendingCategory.spent}. Look for ways to reduce costs in this area.`,
        icon: <TrendingDown className="w-5 h-5 text-blue-500" />,
        priority: 3
      });
    }

    // Money-saving tips based on categories
    const savingTips = [
      {
        category: 'Groceries',
        tip: 'Try meal planning and buying generic brands to save 20-30% on grocery costs.'
      },
      {
        category: 'Transport',
        tip: 'Consider carpooling, public transport, or biking to reduce transportation expenses.'
      },
      {
        category: 'Bills',
        tip: 'Review your subscriptions and cancel unused services. Switch to energy-efficient appliances.'
      },
      {
        category: 'Entertainment',
        tip: 'Look for free community events, use streaming services instead of going out, or have potluck dinners.'
      },
      {
        category: 'Stationary',
        tip: 'Buy in bulk during sales and consider digital alternatives to reduce paper costs.'
      },
      {
        category: 'Health',
        tip: 'Use preventive care, generic medications, and check if your insurance covers wellness programs.'
      }
    ];

    // Add relevant saving tips
    categories.forEach(category => {
      const tip = savingTips.find(t => t.category === category.name);
      if (tip && category.spent > category.limit * 0.7) {
        suggestions.push({
          type: 'tip',
          title: `Save on ${category.name}`,
          description: tip.tip,
          icon: <Lightbulb className="w-5 h-5 text-green-500" />,
          priority: 4
        });
      }
    });

    // Budget optimization suggestions
    const totalBudget = categories.reduce((sum, cat) => sum + cat.limit, 0);
    const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
    const remainingBudget = totalBudget - totalSpent;

    if (remainingBudget > 0) {
      suggestions.push({
        type: 'goal',
        title: 'Budget Optimization',
        description: `You have $${remainingBudget.toFixed(2)} remaining this period. Consider saving this amount or redistributing it to categories you frequently exceed.`,
        icon: <Target className="w-5 h-5 text-purple-500" />,
        priority: 5
      });
    }

    // General financial tips
    suggestions.push({
      type: 'tip',
      title: '50/30/20 Rule',
      description: 'Consider following the 50/30/20 budgeting rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment.',
      icon: <Lightbulb className="w-5 h-5 text-green-500" />,
      priority: 6
    });

    suggestions.push({
      type: 'tip',
      title: 'Emergency Fund',
      description: 'Build an emergency fund covering 3-6 months of expenses. Start with small amounts if needed.',
      icon: <Target className="w-5 h-5 text-purple-500" />,
      priority: 7
    });

    return suggestions.sort((a, b) => a.priority - b.priority);
  }, [categories, expenses]);

  const getCardColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-red-200 bg-red-50';
      case 'tip': return 'border-green-200 bg-green-50';
      case 'goal': return 'border-purple-200 bg-purple-50';
      case 'insight': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Smart Budget Suggestions</h2>
        <p className="text-gray-600">
          AI-powered recommendations to help you optimize your spending and save money
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className={`p-6 ${getCardColor(suggestion.type)}`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {suggestion.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">
                  {suggestion.title}
                </h3>
                <p className="text-gray-700">
                  {suggestion.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {suggestions.length === 0 && (
        <Card className="p-8 text-center">
          <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No suggestions yet</h3>
          <p className="text-gray-600">
            Add some expenses to get personalized budget suggestions and money-saving tips!
          </p>
        </Card>
      )}
    </div>
  );
};

export default SmartSuggestions;
