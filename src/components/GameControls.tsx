
import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap } from 'lucide-react';

const GameControls = () => {
  return (
    <Card className="mt-6 p-4 bg-gray-50">
      <h3 className="text-lg font-semibold mb-3 text-center">Controls</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-medium mb-2">Movement:</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ArrowUp className="w-4 h-4" />
              <span>↑ / W - Move Up</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowDown className="w-4 h-4" />
              <span>↓ / S - Move Down</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>← / A - Move Left</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              <span>→ / D - Move Right</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Special:</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Space - Change Shape</span>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              <p>• Straight: Normal movement</p>
              <p>• Wavy: Smooth wave motion</p>
              <p>• Zigzag: Sharp alternating movement</p>
              <p>• Spiral: Rotating segments</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GameControls;
