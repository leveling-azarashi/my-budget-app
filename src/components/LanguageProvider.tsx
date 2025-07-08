
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  languages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  const setLanguage = (language: Language) => {
    console.log('LanguageProvider: Setting language to:', language.name);
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language.code);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    console.log('LanguageProvider: Loading saved language:', savedLanguage);
    if (savedLanguage) {
      const language = languages.find(l => l.code === savedLanguage);
      if (language) {
        console.log('LanguageProvider: Found saved language:', language.name);
        setCurrentLanguage(language);
      }
    }
  }, []);

  console.log('LanguageProvider: Current language is:', currentLanguage.name);

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      setLanguage, 
      languages
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
