
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBudget } from './BudgetContext';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ExpenseTracker = () => {
  const { categories, addExpense, updateCategoryLimit } = useBudget();
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newLimit, setNewLimit] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    addExpense({
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date
    });

    setFormData({
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });

    toast({
      title: "Success",
      description: "Expense added successfully!"
    });
  };

  const handleUpdateLimit = (categoryName: string) => {
    updateCategoryLimit(categoryName, newLimit);
    setEditingCategory(null);
    toast({
      title: "Success",
      description: "Budget limit updated!"
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Expense Form */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Add New Expense</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="What did you spend on?"
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </form>
        </Card>

        {/* Manage Category Budgets */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Manage Category Budgets</h3>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-sm text-gray-600">
                    ${category.spent} / ${category.limit} spent
                  </p>
                </div>
                
                {editingCategory === category.name ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={newLimit}
                      onChange={(e) => setNewLimit(parseFloat(e.target.value))}
                      className="w-20"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateLimit(category.name)}
                    >
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setEditingCategory(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setEditingCategory(category.name);
                      setNewLimit(category.limit);
                    }}
                  >
                    Edit Budget
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseTracker;
