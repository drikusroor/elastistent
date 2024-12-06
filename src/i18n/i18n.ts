import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Get language from URL if present
const getInitialLanguage = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('lng') || navigator.language.split('-')[0];
};

const resources = {
  en: {
    translation: {
      title: 'Elastistent',
      legend: {
        middleIncisors: 'Middle Incisors',
        canines: 'Canines',
        disabledTeeth: 'Disabled Teeth (Cmd/Ctrl + Click)',
        elasticType: '{{type}}',
      },
      views: {
        normal: '🧑‍⚕️ Normal',
        mirror: '🪞 Mirror',
        normalDescription: 'As seen by the orthodontist',
        mirrorDescription: 'As seen in the mirror',
      },
      buttons: {
        addElastic: 'Add Elastic',
        restart: 'Start Over',
        share: 'Share',
        removeElastic: 'Remove elastic',
      },
      tooltips: {
        selectTeeth: 'Select at least 2 teeth',
        addElastic: 'Add elastic',
      },
      elastics: {
        title: 'Elastics:',
        none: 'No elastics configured',
        elastic: '{{teeth}}',
        elasticTypeDisplay: '{{type}}',
        typeOption: '{{type}}',
        elasticTooltip: 'Elastic Tooltip',
      },
      sharing: {
        title: 'My Elastistent configuration',
        copied: 'Link copied to clipboard!',
        error: 'Could not copy the link: ',
      },
      footer: {
        copyright: '© {{year}} Drikus Roor,',
      },
      language: {
        select: 'Select language',
        en: 'English',
        nl: 'Nederlands',
      },
    },
  },
  nl: {
    translation: {
      title: 'Elastistent',
      legend: {
        middleIncisors: 'Middelste Snijtanden',
        canines: 'Hoektanden',
        disabledTeeth: 'Uitgeschakelde Tanden (Cmd/Ctrl + Klik)',
        elasticType: '{{type}}',
      },
      views: {
        normal: '🧑‍⚕️ Normaal',
        mirror: '🪞 Spiegel',
        normalDescription: 'Zoals gezien door de orthodontist',
        mirrorDescription: 'Zoals gezien in de spiegel',
      },
      buttons: {
        addElastic: 'Elastiekje Toevoegen',
        restart: 'Begin Opnieuw',
        share: 'Delen',
        removeElastic: 'Elastiekje verwijderen',
      },
      tooltips: {
        selectTeeth: 'Selecteer minimaal 2 tanden',
        addElastic: 'Voeg elastiekje toe',
      },
      elastics: {
        title: 'Elastiekjes:',
        none: 'Geen elastiekjes geconfigureerd',
        elastic: '{{teeth}}',
        elasticTypeDisplay: '{{type}}',
        typeOption: '{{type}}',
        elasticTooltip: 'Elastiekje Tooltip',
      },
      sharing: {
        title: 'Mijn Elastistent configuratie',
        copied: 'Link gekopieerd naar klembord!',
        error: 'Kon de link niet kopiëren: ',
      },
      footer: {
        copyright: '© {{year}} Drikus Roor,',
      },
      language: {
        select: 'Selecteer taal',
        en: 'English',
        nl: 'Nederlands',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(), // Set initial language
    fallbackLng: 'en',
    detection: {
      order: ['querystring', 'navigator'],
      lookupQuerystring: 'lng',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;