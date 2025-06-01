
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBudget, currencies } from './BudgetContext';

const CurrencySettings = () => {
  const { currency, setCurrency } = useBudget();

  const handleCurrencyChange = (currencyCode: string) => {
    const selectedCurrency = currencies.find(c => c.code === currencyCode);
    if (selectedCurrency) {
      setCurrency(selectedCurrency);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Default Currency</label>
            <Select value={currency.code} onValueChange={handleCurrencyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.name} ({curr.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-gray-600">
            Current currency: {currency.symbol} {currency.name}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencySettings;
