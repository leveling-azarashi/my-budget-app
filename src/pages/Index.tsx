
import SnakeGame from "@/components/SnakeGame";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Calculator, Gamepad2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to My Apps</h1>
          <p className="text-gray-600 mb-8">Choose an application to get started</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/budget')}>
              <Calculator className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Budget Manager</h3>
              <p className="text-gray-600 mb-4">Track expenses, manage budgets, and get smart suggestions for saving money</p>
              <Button className="w-full">
                Open Budget Manager
              </Button>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Gamepad2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Snake Game</h3>
              <p className="text-gray-600 mb-4">Play the classic snake game with dynamic shape transformations</p>
              <Button variant="outline" className="w-full" disabled>
                Playing Below
              </Button>
            </Card>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">Snake Game</h2>
          <SnakeGame />
        </div>
      </div>
    </div>
  );
};

export default Index;
