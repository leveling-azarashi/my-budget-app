
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { useBudget, currencies } from '@/components/budget/BudgetContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, Moon, Sun, Languages, DollarSign, Info, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { currentLanguage, languages, pendingLanguage, setPendingLanguage, applyLanguageChange } = useLanguage();
  const { currency, setCurrency } = useBudget();
  const { toast } = useToast();

  const [pendingTheme, setPendingTheme] = useState<string | null>(null);
  const [pendingCurrency, setPendingCurrency] = useState<string | null>(null);

  const handleLanguageChange = (languageCode: string) => {
    const selectedLanguage = languages.find(l => l.code === languageCode);
    if (selectedLanguage) {
      setPendingLanguage(selectedLanguage);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setPendingTheme(newTheme);
  };

  const handleCurrencyChange = (currencyCode: string) => {
    setPendingCurrency(currencyCode);
  };

  const saveChanges = () => {
    let changesMade = false;

    // Apply theme changes
    if (pendingTheme && pendingTheme !== theme) {
      setTheme(pendingTheme as any);
      setPendingTheme(null);
      changesMade = true;
    }

    // Apply language changes
    if (pendingLanguage) {
      applyLanguageChange();
      changesMade = true;
    }

    // Apply currency changes
    if (pendingCurrency) {
      const selectedCurrency = currencies.find(c => c.code === pendingCurrency);
      if (selectedCurrency) {
        setCurrency(selectedCurrency);
        setPendingCurrency(null);
        changesMade = true;
      }
    }

    if (changesMade) {
      toast({
        title: "Settings saved",
        description: "Your changes have been applied successfully.",
      });
    } else {
      toast({
        title: "No changes",
        description: "No settings were modified.",
        variant: "default",
      });
    }
  };

  const hasChanges = pendingTheme !== null || pendingLanguage !== null || pendingCurrency !== null;

  const projectInfo = {
    name: 'Budget Manager',
    version: '1.0.0',
    buildDate: new Date().toISOString().split('T')[0],
    technologies: [
      'React 18.3.1',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Shadcn/UI',
      'React Router DOM 6.26.2',
      'Lucide React 0.462.0',
      'Recharts 2.12.7',
      'TanStack React Query 5.56.2',
      'React Hook Form 7.53.0',
      'Zod 3.23.8'
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/budget')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Budget
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
              <p className="text-gray-600 dark:text-gray-400">Customize your Budget Manager experience</p>
            </div>
          </div>
          
          {hasChanges && (
            <Button onClick={saveChanges} className="ml-4">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>

        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="appearance">
              <Monitor className="w-4 h-4 mr-2" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="language">
              <Languages className="w-4 h-4 mr-2" />
              Language
            </TabsTrigger>
            <TabsTrigger value="currency">
              <DollarSign className="w-4 h-4 mr-2" />
              Currency
            </TabsTrigger>
            <TabsTrigger value="about">
              <Info className="w-4 h-4 mr-2" />
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Theme Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Choose your theme</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant={(pendingTheme || theme) === 'light' ? 'default' : 'outline'}
                      onClick={() => handleThemeChange('light')}
                      className="flex flex-col items-center gap-2 h-auto p-4"
                    >
                      <Sun className="w-6 h-6" />
                      <span>Light</span>
                    </Button>
                    <Button
                      variant={(pendingTheme || theme) === 'dark' ? 'default' : 'outline'}
                      onClick={() => handleThemeChange('dark')}
                      className="flex flex-col items-center gap-2 h-auto p-4"
                    >
                      <Moon className="w-6 h-6" />
                      <span>Dark</span>
                    </Button>
                    <Button
                      variant={(pendingTheme || theme) === 'system' ? 'default' : 'outline'}
                      onClick={() => handleThemeChange('system')}
                      className="flex flex-col items-center gap-2 h-auto p-4"
                    >
                      <Monitor className="w-6 h-6" />
                      <span>System</span>
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Current theme:</strong> <span className="capitalize">{theme}</span>
                    {pendingTheme && pendingTheme !== theme && (
                      <span className="ml-2 text-orange-600 dark:text-orange-400">
                        → {pendingTheme} (pending)
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  Language Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Display Language</label>
                  <Select 
                    value={pendingLanguage?.code || currentLanguage.code} 
                    onValueChange={handleLanguageChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Current language:</strong> {currentLanguage.flag} {currentLanguage.name}
                    {pendingLanguage && pendingLanguage.code !== currentLanguage.code && (
                      <span className="ml-2 text-orange-600 dark:text-orange-400">
                        → {pendingLanguage.flag} {pendingLanguage.name} (pending)
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="currency">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Currency Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Default Currency</label>
                  <Select 
                    value={pendingCurrency || currency.code} 
                    onValueChange={handleCurrencyChange}
                  >
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
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    <strong>Current currency:</strong> {currency.symbol} {currency.name} ({currency.code})
                    {pendingCurrency && pendingCurrency !== currency.code && (
                      <span className="ml-2 text-orange-600 dark:text-orange-400">
                        → {currencies.find(c => c.code === pendingCurrency)?.symbol} {currencies.find(c => c.code === pendingCurrency)?.name} (pending)
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Project Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Project Name</h4>
                      <p className="text-gray-600 dark:text-gray-400">{projectInfo.name}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Version</h4>
                      <p className="text-gray-600 dark:text-gray-400">{projectInfo.version}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Build Date</h4>
                      <p className="text-gray-600 dark:text-gray-400">{projectInfo.buildDate}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Platform</h4>
                      <p className="text-gray-600 dark:text-gray-400">React Web App</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technologies Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {projectInfo.technologies.map((tech, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-blue-800 dark:text-blue-200 font-medium">{tech}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
