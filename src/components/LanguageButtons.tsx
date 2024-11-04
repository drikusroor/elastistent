import { useTranslation } from 'react-i18next';
import { Monitor, Check } from 'lucide-react';

const LanguageButtons = () => {
  const { i18n } = useTranslation();
  
  const handleLanguageChange = (lang: string | null) => {
    const params = new URLSearchParams(window.location.search);
    
    if (lang) {
      params.set('lng', lang);
      i18n.changeLanguage(lang);
    } else {
      params.delete('lng');
      const userLang = navigator.language.split('-')[0];
      i18n.changeLanguage(userLang);
    }

    // Update URL without reloading the page
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  // Get current language from URL, fallback to i18n.language
  const getCurrentLanguage = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('lng') || i18n.language;
  };

  // Check if system language is being used (no lng param in URL)
  const isUsingSystemLanguage = () => {
    const params = new URLSearchParams(window.location.search);
    return !params.has('lng');
  };

  return (
    <div className="fixed bottom-4 right-4 flex gap-2 bg-white rounded-full shadow-lg p-1 z-50">
      <button
        onClick={() => handleLanguageChange(null)}
        className={`p-2 rounded-full transition-colors hover:bg-gray-100 relative group ${
          isUsingSystemLanguage() ? 'text-blue-500' : 'text-gray-600'
        }`}
        title="Use system language"
      >
        <Monitor size={20} />
        {isUsingSystemLanguage() && (
          <Check className="absolute -top-1 -right-1 text-blue-500" size={12} />
        )}
        <span className="absolute right-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          System ({navigator.language.split('-')[0].toUpperCase()})
        </span>
      </button>
      <button
        onClick={() => handleLanguageChange('nl')}
        className={`p-2 rounded-full transition-colors hover:bg-gray-100 font-semibold relative group ${
          getCurrentLanguage() === 'nl' && !isUsingSystemLanguage() ? 'text-blue-500' : 'text-gray-600'
        }`}
        title="Nederlands"
      >
        NL
        {getCurrentLanguage() === 'nl' && !isUsingSystemLanguage() && (
          <Check className="absolute -top-1 -right-1 text-blue-500" size={12} />
        )}
        <span className="absolute right-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded">
          Nederlands
        </span>
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`p-2 rounded-full transition-colors hover:bg-gray-100 font-semibold relative group ${
          getCurrentLanguage() === 'en' && !isUsingSystemLanguage() ? 'text-blue-500' : 'text-gray-600'
        }`}
        title="English"
      >
        EN
        {getCurrentLanguage() === 'en' && !isUsingSystemLanguage() && (
          <Check className="absolute -top-1 -right-1 text-blue-500" size={12} />
        )}
        <span className="absolute right-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded">
          English
        </span>
      </button>
    </div>
  );
};

export default LanguageButtons;