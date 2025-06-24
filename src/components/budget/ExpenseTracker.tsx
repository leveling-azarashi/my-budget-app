import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBudget } from './BudgetContext';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ExpenseTracker = () => {
  const { categories, incomeSources, addExpense, updateCategoryLimit, addCategory, updateCategory, deleteCategory, addIncomeSource, updateIncomeSource, deleteIncomeSource, currency } = useBudget();
  const [formData, setFormData] = useState({
    category: '',
    source: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingSource, setEditingSource] = useState<string | null>(null);
  const [newCategoryData, setNewCategoryData] = useState({ name: '', limit: 0, color: 'bg-blue-500' });
  const [newSourceData, setNewSourceData] = useState({ name: '', balance: 0, type: 'checking' as const });
  const [newLimit, setNewLimit] = useState<number>(0);

  const colorOptions = [
    'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.source || !formData.amount || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    addExpense({
      category: formData.category,
      source: formData.source,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date
    });

    setFormData({
      category: '',
      source: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });

    toast({
      title: "Success",
      description: "Expense added successfully!"
    });
  };

  const handleUpdateLimit = (categoryId: string) => {
    updateCategoryLimit(categoryId, newLimit);
    setEditingCategory(null);
    toast({
      title: "Success",
      description: "Budget limit updated!"
    });
  };

  const handleAddCategory = () => {
    if (!newCategoryData.name || newCategoryData.limit <= 0) {
      toast({
        title: "Error",
        description: "Please provide a valid category name and limit",
        variant: "destructive"
      });
      return;
    }

    addCategory(newCategoryData);
    setNewCategoryData({ name: '', limit: 0, color: 'bg-blue-500' });
    toast({
      title: "Success",
      description: "Category added successfully!"
    });
  };

  const handleAddSource = () => {
    if (!newSourceData.name || newSourceData.balance < 0) {
      toast({
        title: "Error",
        description: "Please provide a valid source name and balance",
        variant: "destructive"
      });
      return;
    }

    addIncomeSource(newSourceData);
    setNewSourceData({ name: '', balance: 0, type: 'checking' });
    toast({
      title: "Success",
      description: "Income source added successfully!"
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
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="source">Payment Source</Label>
              <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment source" />
                </SelectTrigger>
                <SelectContent>
                  {incomeSources.map((source) => (
                    <SelectItem key={source.id} value={source.name}>
                      {source.name} ({currency.symbol}{source.balance})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Amount ({currency.symbol})</Label>
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

        {/* Manage Categories */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Manage Categories</h3>
          
          {/* Add New Category */}
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium mb-3">Add New Category</h4>
            <div className="space-y-3">
              <Input
                placeholder="Category name"
                value={newCategoryData.name}
                onChange={(e) => setNewCategoryData({...newCategoryData, name: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Budget limit"
                value={newCategoryData.limit || ''}
                onChange={(e) => setNewCategoryData({...newCategoryData, limit: parseFloat(e.target.value) || 0})}
              />
              <Select value={newCategoryData.color} onValueChange={(value) => setNewCategoryData({...newCategoryData, color: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color} value={color}>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded ${color} mr-2`}></div>
                        {color.replace('bg-', '').replace('-500', '')}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddCategory} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
          </div>

          {/* Existing Categories */}
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded ${category.color} mr-3`}></div>
                  <div>
                    <h4 className="font-medium">{category.name}</h4>
                    <p className="text-sm text-gray-600">
                      {currency.symbol}{category.spent} / {currency.symbol}{category.limit} spent
                    </p>
                  </div>
                </div>
                
                {editingCategory === category.id ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={newLimit}
                      onChange={(e) => setNewLimit(parseFloat(e.target.value))}
                      className="w-20"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateLimit(category.id)}
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
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setEditingCategory(category.id);
                        setNewLimit(category.limit);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteCategory(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Manage Income Sources */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Manage Income Sources</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add New Source */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium mb-3">Add New Income Source</h4>
            <div className="space-y-3">
              <Input
                placeholder="Source name"
                value={newSourceData.name}
                onChange={(e) => setNewSourceData({...newSourceData, name: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Initial balance"
                value={newSourceData.balance || ''}
                onChange={(e) => setNewSourceData({...newSourceData, balance: parseFloat(e.target.value) || 0})}
              />
              <Select value={newSourceData.type} onValueChange={(value: any) => setNewSourceData({...newSourceData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking Account</SelectItem>
                  <SelectItem value="savings">Savings Account</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddSource} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Source
              </Button>
            </div>
          </div>

          {/* Existing Sources */}
          <div className="space-y-3">
            {incomeSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{source.name}</h4>
                  <p className="text-sm text-gray-600 capitalize">{source.type}</p>
                  <p className="text-lg font-semibold text-green-600">{currency.symbol}{source.balance}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setEditingSource(source.id)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => deleteIncomeSource(source.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExpenseTracker;
