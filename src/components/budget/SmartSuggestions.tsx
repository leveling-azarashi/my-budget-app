
import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBudget } from './BudgetContext';
import { AlertTriangle, TrendingDown, Target, Lightbulb, ShoppingCart, Search } from 'lucide-react';

const SmartSuggestions = () => {
  const { categories, expenses, currency } = useBudget();
  const [alternatives, setAlternatives] = useState<Array<{category: string, suggestions: string[]}>>([]);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);

  const suggestions = useMemo(() => {
    const suggestions: Array<{
      type: 'warning' | 'tip' | 'goal' | 'insight' | 'alternative';
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
          description: `You've spent ${currency.symbol}${category.spent} out of your ${currency.symbol}${category.limit} budget (${percentage.toFixed(1)}% over). Consider reducing expenses in this category.`,
          icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
          priority: 1
        });
      } else if (percentage > 80) {
        suggestions.push({
          type: 'warning',
          title: `${category.name} Budget Warning`,
          description: `You've used ${percentage.toFixed(1)}% of your ${category.name} budget. You have ${currency.symbol}${(category.limit - category.spent).toFixed(2)} remaining.`,
          icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
          priority: 2
        });
      }
    });

    // Enhanced money-saving tips
    const enhancedSavingTips = [
      {
        category: 'Groceries',
        tips: [
          'Plan meals weekly and stick to a shopping list to avoid impulse purchases',
          'Buy generic/store brands - they can save 20-30% compared to name brands',
          'Shop seasonal produce and buy in bulk for non-perishables',
          'Use cashback apps like Ibotta, Checkout51, or store loyalty programs',
          'Consider frozen vegetables - they\'re often cheaper and last longer',
          'Shop at discount stores like Aldi or warehouse clubs for bulk savings'
        ]
      },
      {
        category: 'Transport',
        tips: [
          'Use public transportation or carpool to reduce fuel and parking costs',
          'Walk or bike for short distances - saves money and improves health',
          'Combine multiple errands into one trip to save on fuel',
          'Compare gas prices using apps like GasBuddy before filling up',
          'Maintain your vehicle regularly to improve fuel efficiency',
          'Consider rideshare for occasional trips instead of car ownership'
        ]
      },
      {
        category: 'Bills',
        tips: [
          'Review and cancel unused subscriptions and services monthly',
          'Switch to energy-efficient LED bulbs and appliances',
          'Bundle services (internet, cable, phone) for potential discounts',
          'Set up automatic payments to avoid late fees',
          'Negotiate with providers for better rates annually',
          'Use programmable thermostats to reduce heating/cooling costs'
        ]
      },
      {
        category: 'Entertainment',
        tips: [
          'Look for free community events, festivals, and outdoor activities',
          'Share streaming service subscriptions with family members',
          'Take advantage of happy hour specials and early bird discounts',
          'Host potluck dinners instead of dining out frequently',
          'Use library resources for books, movies, and community programs',
          'Find free or low-cost hobbies like hiking, reading, or board games'
        ]
      },
      {
        category: 'Stationary',
        tips: [
          'Buy office supplies in bulk during back-to-school sales',
          'Go digital when possible to reduce paper and printing costs',
          'Reuse and repurpose items before buying new ones',
          'Shop at dollar stores for basic supplies',
          'Use both sides of paper and buy refillable pens',
          'Compare prices online before making purchases'
        ]
      },
      {
        category: 'Health',
        tips: [
          'Use generic medications when available - they can save 80-90%',
          'Take advantage of preventive care covered by insurance',
          'Use HSA/FSA accounts for tax-free medical expenses',
          'Compare prices for procedures and medications',
          'Consider telehealth appointments for routine consultations',
          'Stay active and eat well to prevent costly health issues'
        ]
      }
    ];

    // Add specific category tips
    categories.forEach(category => {
      const categoryTips = enhancedSavingTips.find(t => t.category === category.name);
      if (categoryTips && category.spent > category.limit * 0.6) {
        // Add multiple tips for categories with significant spending
        categoryTips.tips.slice(0, 2).forEach((tip, index) => {
          suggestions.push({
            type: 'tip',
            title: `${category.name} Saving Tip ${index + 1}`,
            description: tip,
            icon: <Lightbulb className="w-5 h-5 text-green-500" />,
            priority: 4 + index
          });
        });
      }
    });

    // Advanced budgeting suggestions
    const totalBudget = categories.reduce((sum, cat) => sum + cat.limit, 0);
    const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
    const remainingBudget = totalBudget - totalSpent;

    if (remainingBudget > 0) {
      suggestions.push({
        type: 'goal',
        title: 'Budget Surplus Optimization',
        description: `You have ${currency.symbol}${remainingBudget.toFixed(2)} remaining this period. Consider allocating this to emergency savings or high-priority categories you frequently exceed.`,
        icon: <Target className="w-5 h-5 text-purple-500" />,
        priority: 5
      });
    }

    // Spending pattern insights
    const highestCategory = categories.reduce((max, cat) => cat.spent > max.spent ? cat : max, categories[0]);
    const lowestCategory = categories.reduce((min, cat) => cat.spent < min.spent ? cat : min, categories[0]);

    if (highestCategory && highestCategory.spent > 0) {
      suggestions.push({
        type: 'insight',
        title: 'Spending Pattern Analysis',
        description: `${highestCategory.name} accounts for ${((highestCategory.spent / totalSpent) * 100).toFixed(1)}% of your spending. Consider if this aligns with your priorities and look for optimization opportunities.`,
        icon: <TrendingDown className="w-5 h-5 text-blue-500" />,
        priority: 6
      });
    }

    // Financial wellness tips
    const financialTips = [
      {
        title: '50/30/20 Budgeting Rule',
        description: 'Allocate 50% of income to needs, 30% to wants, and 20% to savings and debt repayment for balanced financial health.'
      },
      {
        title: 'Emergency Fund Priority',
        description: 'Build an emergency fund covering 3-6 months of expenses. Start with $500-1000 as an initial goal.'
      },
      {
        title: 'Debt Avalanche Method',
        description: 'Pay minimum on all debts, then put extra money toward the highest interest rate debt first.'
      },
      {
        title: 'Automate Your Savings',
        description: 'Set up automatic transfers to savings accounts to pay yourself first before other expenses.'
      },
      {
        title: 'Track Your Net Worth',
        description: 'Calculate assets minus liabilities monthly to monitor your overall financial progress.'
      }
    ];

    financialTips.forEach((tip, index) => {
      suggestions.push({
        type: 'tip',
        title: tip.title,
        description: tip.description,
        icon: <Target className="w-5 h-5 text-purple-500" />,
        priority: 10 + index
      });
    });

    return suggestions.sort((a, b) => a.priority - b.priority);
  }, [categories, expenses, currency]);

  const fetchCheapAlternatives = async () => {
    setLoadingAlternatives(true);
    
    // Simulate fetching alternatives for demonstration
    // In a real app, you'd integrate with shopping APIs or web scraping services
    const mockAlternatives = [
      {
        category: 'Groceries',
        suggestions: [
          'Aldi: 30% cheaper than traditional supermarkets',
          'Costco bulk buying: Save 15-20% on non-perishables',
          'Local farmers markets: Fresh produce at 25% less',
          'Generic brands: Save 20-40% on packaged goods'
        ]
      },
      {
        category: 'Transport',
        suggestions: [
          'Public transit monthly pass: Save 60% vs daily tickets',
          'Bike sharing programs: $5/day vs $15 uber rides',
          'Carpooling apps: Split costs and save 50%',
          'Off-peak ride pricing: Save 20-30% on ride-shares'
        ]
      },
      {
        category: 'Entertainment',
        suggestions: [
          'Matinee movie tickets: 40% cheaper than evening shows',
          'Happy hour dining: 25-50% off food and drinks',
          'Free community events: Save $20-50 per activity',
          'Library movie rentals: Free vs $4-6 streaming rentals'
        ]
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      setAlternatives(mockAlternatives);
      setLoadingAlternatives(false);
    }, 2000);
  };

  const getCardColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-red-200 bg-red-50';
      case 'tip': return 'border-green-200 bg-green-50';
      case 'goal': return 'border-purple-200 bg-purple-50';
      case 'insight': return 'border-blue-200 bg-blue-50';
      case 'alternative': return 'border-orange-200 bg-orange-50';
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

      <div className="mb-6">
        <Button 
          onClick={fetchCheapAlternatives} 
          disabled={loadingAlternatives}
          className="w-full md:w-auto"
        >
          <Search className="w-4 h-4 mr-2" />
          {loadingAlternatives ? 'Finding Alternatives...' : 'Find Cheap Alternatives'}
        </Button>
      </div>

      {alternatives.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">💰 Money-Saving Alternatives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alternatives.map((alt, index) => (
              <Card key={index} className="border-orange-200 bg-orange-50 p-4">
                <div className="flex items-start space-x-3">
                  <ShoppingCart className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{alt.category}</h4>
                    <ul className="text-sm space-y-1">
                      {alt.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="text-gray-700">• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

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
