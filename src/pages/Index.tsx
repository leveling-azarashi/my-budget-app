
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Calculator, TrendingUp, PieChart, DollarSign } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Budget Manager</h1>
          <p className="text-gray-600 mb-8">Take control of your finances with smart expense tracking and budget management</p>
          
          <Button 
            onClick={() => navigate('/budget')} 
            size="lg" 
            className="mb-12"
          >
            Get Started
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <Calculator className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Expense Tracking</h3>
            <p className="text-gray-600 text-sm">Record and categorize all your expenses with ease</p>
          </Card>
          
          <Card className="p-6 text-center">
            <PieChart className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Budget Categories</h3>
            <p className="text-gray-600 text-sm">Organize spending into customizable categories</p>
          </Card>
          
          <Card className="p-6 text-center">
            <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600 text-sm">View detailed spending trends and insights</p>
          </Card>
          
          <Card className="p-6 text-center">
            <DollarSign className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Multi-Currency</h3>
            <p className="text-gray-600 text-sm">Support for multiple currencies with conversion</p>
          </Card>
        </div>

        <Card className="p-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h2 className="text-2xl font-bold mb-4">Start Managing Your Budget Today</h2>
          <p className="mb-6 text-blue-100">Track expenses, set budgets, and get insights into your spending habits</p>
          <Button 
            onClick={() => navigate('/budget')} 
            variant="secondary" 
            size="lg"
          >
            Open Budget Manager
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Index;
