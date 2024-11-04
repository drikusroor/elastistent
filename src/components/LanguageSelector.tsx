import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">{t('language.select')}:</span>
      <div className="flex gap-2">
        <button
          onClick={() => changeLanguage('en')}
          className={`px-2 py-1 rounded text-sm ${
            i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {t('language.en')}
        </button>
        <button
          onClick={() => changeLanguage('nl')}
          className={`px-2 py-1 rounded text-sm ${
            i18n.language === 'nl' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {t('language.nl')}
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;