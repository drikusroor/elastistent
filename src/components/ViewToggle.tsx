import { useTranslation } from "react-i18next";

const ViewToggle = ({ isMirrorView, onToggle }: { isMirrorView: boolean; onToggle: () => void }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-4 rounded-lg mb-4 flex flex-col items-center gap-2">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          className={`px-4 py-2 rounded-lg transition-colors ${!isMirrorView ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
        >
          {t('views.normal')}
        </button>
        <button
          onClick={onToggle}
          className={`px-4 py-2 rounded-lg transition-colors ${isMirrorView ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
        >
          {t('views.mirror')}
        </button>
      </div>
      <p className="text-sm text-gray-600">
        {isMirrorView ? t('views.mirrorDescription') : t('views.normalDescription')}
      </p>
    </div>
  );
};

export default ViewToggle;