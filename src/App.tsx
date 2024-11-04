import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, PlusCircle, Share2, Redo2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import ViewToggle from './components/ViewToggle';
import { useTranslation } from 'react-i18next';
import Tooth from './components/Tooth';
import { FEATURES } from './config';


const teethLayout = [
  [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
];

type Elastic = number[];

type ToothRef = {
  [key: number]: HTMLButtonElement;
}

const ElasticPlacer = () => {
  const { t } = useTranslation();
  const [isMirrorView, setIsMirrorView] = useState(false);
  const [elastics, setElastics] = useState<Elastic[]>([]);
  const [currentElastic, setCurrentElastic] = useState<Elastic>([]);
  const [shareUrl, setShareUrl] = useState('');
  const [disabledTeeth, setDisabledTeeth] = useState<number[]>([]);
  const toothRefs = useRef<ToothRef>({});
  const svgRef = useRef<SVGSVGElement>(null);
  const initialLoadDone = useRef(false);

  // Load from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const savedElastics = params.get('elastics');
    const savedDisabledTeeth = params.get('disabled');
    const savedMirrorView = params.get('mirror');

    if (savedElastics) {
      try {
        const parsedElastics = JSON.parse(savedElastics);
        setElastics(parsedElastics);
      } catch (error) {
        console.error("Error parsing elastics from URL:", error);
      }
    }

    if (FEATURES.DISABLE_TEETH && savedDisabledTeeth) {
      try {
        const parsedDisabledTeeth = JSON.parse(savedDisabledTeeth);
        setDisabledTeeth(parsedDisabledTeeth);
      } catch (error) {
        console.error("Error parsing disabled teeth from URL:", error);
      }
    }

    if (FEATURES.MIRROR_VIEW && savedMirrorView) {
      setIsMirrorView(savedMirrorView === 'true');
    }

    initialLoadDone.current = true;
  }, []);

  // Update URL
  useEffect(() => {
    if (initialLoadDone.current) {
      const params = new URLSearchParams();
      if (elastics.length > 0) {
        params.set('elastics', JSON.stringify(elastics));
      }
      if (FEATURES.DISABLE_TEETH && disabledTeeth.length > 0) {
        params.set('disabled', JSON.stringify(disabledTeeth));
      }
      if (FEATURES.MIRROR_VIEW && isMirrorView) {
        params.set('mirror', 'true');
      }
      const newUrl = `${window.location.origin}${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
      setShareUrl(newUrl);
    }
  }, [elastics, disabledTeeth, isMirrorView]);

  useEffect(() => {
    if (initialLoadDone.current) {
      // Small delay to ensure DOM is updated
      requestAnimationFrame(() => {
        drawElastics();
      });
    }
  }, [elastics, initialLoadDone]);

  const handleToothClick = useCallback((number: number) => {
    if (!FEATURES.DISABLE_TEETH || !disabledTeeth.includes(number)) {
      setCurrentElastic(prev =>
        prev.includes(number)
          ? prev.filter(n => n !== number)
          : [...prev, number]
      );
    }
  }, [disabledTeeth]);

  const handleToothToggle = useCallback((number: number) => {
    if (FEATURES.DISABLE_TEETH) {
      setDisabledTeeth(prev =>
        prev.includes(number)
          ? prev.filter(n => n !== number)
          : [...prev, number]
      );
      setCurrentElastic(prev => prev.filter(n => n !== number));
    }
  }, []);

  const addElastic = useCallback(() => {
    if (currentElastic.length > 1) {
      setElastics(prev => [...prev, currentElastic]);
      setCurrentElastic([]);
      // Force immediate redraw
      requestAnimationFrame(() => {
        drawElastics();
      });
    }
  }, [currentElastic]);

  const removeElastic = useCallback((index: number) => {
    setElastics(prev => prev.filter((_, i) => i !== index));
  }, []);

  const resetAll = useCallback(() => {
    setElastics([]);
    setCurrentElastic([]);
    setDisabledTeeth([]);
    setIsMirrorView(false);
    window.history.pushState({ path: window.location.pathname }, '', window.location.pathname);
    setShareUrl(window.location.origin + window.location.pathname);
  }, []);

  const setToothRef = useCallback((number: number, ref: HTMLButtonElement) => {
    toothRefs.current[number] = ref;
  }, []);

  const drawElastics = useCallback(() => {
    if (!svgRef.current) return;

    // Clear previous lines
    while (svgRef.current.firstChild) {
      svgRef.current.removeChild(svgRef.current.firstChild);
    }

    // Draw new lines for each elastic
    elastics.forEach((elastic, index) => {
      if (!svgRef.current) return;

      const svgRect = svgRef.current.getBoundingClientRect();
      const points = elastic.map(toothNumber => {
        const rect = toothRefs.current[toothNumber]?.getBoundingClientRect();
        if (!rect) return null;

        // Calculate the base x position
        const baseX = rect.left - svgRect.left + rect.width / 2;

        // If in mirror view, flip the x coordinate relative to the SVG's center
        const x = isMirrorView
          ? svgRect.width - baseX
          : baseX;

        return {
          x,
          y: rect.top - svgRect.top + rect.height / 2
        };
      }).filter(point => point !== null);

      if (points.length > 1) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = points.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
        path.setAttribute('d', `${d} Z`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', `hsl(${index * 137.5 % 360}, 70%, 50%)`);
        path.setAttribute('stroke-width', '2');
        svgRef.current.appendChild(path);
      }
    });
  }, [elastics, isMirrorView]);

  useEffect(() => {
    const handleResize = () => {
      drawElastics();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [drawElastics]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'Mijn Elastistent configuratie',
        url: shareUrl
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link gekopieerd naar klembord!');
      }, (err) => {
        console.error('Kon de link niet kopiëren: ', err);
      });
    }
  }, [shareUrl]);

  return (
    <div className="container mx-auto sm:p-4 md:p-8">
      <div className="sm:rounded-xl pt-4 sm:p-4 md:p-8 bg-jort drop-shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-white uppercase">
          {t('title')}
        </h1>

        {/* View Toggle */}
        {FEATURES.MIRROR_VIEW && (
          <ViewToggle
            isMirrorView={isMirrorView}
            onToggle={() => setIsMirrorView(prev => !prev)}
          />
        )}

        {/* Legend - only show if features are enabled */}
        {(FEATURES.HIGHLIGHT_SPECIAL_TEETH || FEATURES.DISABLE_TEETH) && (
          <div className="bg-white p-4 rounded-lg mb-4 flex flex-wrap gap-4 justify-center">
            {FEATURES.HIGHLIGHT_SPECIAL_TEETH && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 rounded"></div>
                  <span>{t('legend.middleIncisors')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-200 rounded"></div>
                  <span>{t('legend.canines')}</span>
                </div>
              </>
            )}
            {FEATURES.DISABLE_TEETH && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span>{t('legend.disabledTeeth')}</span>
              </div>
            )}
          </div>
        )}

        <div className="max-w-screen mx-auto bg-blue-200 sm:rounded-2xl py-8 sm:px-4 max-w-4xl overflow-x-auto">
          <div
            className={`relative min-w-[580px] px-2 translate-y-3 ${isMirrorView ? 'transform scale-x-[-1]' : ''}`}
          >
            <svg ref={svgRef} className="absolute inset-0 pointer-events-none z-10 drop-shadow max-w-4xl" style={{ width: '100%', height: '100%' }}></svg>
            {teethLayout.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center flex-1 w-full">
                {row.map((tooth) => (
                  <Tooth
                    key={tooth}
                    number={tooth}
                    onClick={handleToothClick}
                    onToggle={handleToothToggle}
                    selected={currentElastic.includes(tooth)}
                    disabled={FEATURES.DISABLE_TEETH && disabledTeeth.includes(tooth)}
                    setRef={setToothRef}
                    isMirrorView={isMirrorView}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-4 flex flex-col sm:flex-row justify-center md:justify-between items-center sm:items-start gap-4 md:min-w-72 md:p-8">
        <div className="flex flex-col gap-4 min-w-56">
          <button
            onClick={addElastic}
            className={`w-full bg-jort text-white px-4 py-2 rounded flex flex-row items-center gap-2 ${currentElastic.length < 2 ? 'opacity-30 cursor-not-allowed' : ''}`}
            disabled={currentElastic.length < 2}
            title={currentElastic.length < 2 ? t('tooltips.selectTeeth') : t('tooltips.addElastic')}
          >
            <PlusCircle size={16} />
            {t('buttons.addElastic')}
          </button>
          <button
            onClick={resetAll}
            className="w-full bg-red-500 text-white px-4 py-2 rounded flex flex-row items-center gap-2"
          >
            <Redo2 size={16} />
            {t('buttons.restart')}
          </button>
          <button
            onClick={handleShare}
            className="w-full bg-green-500 text-white px-4 py-2 rounded flex flex-row items-center gap-2"
          >
            <Share2 size={16} />
            {t('buttons.share')}
          </button>
        </div>
        <div className='mx-auto'>
          <QRCodeSVG value={shareUrl} size={196} />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{t('elastics.title')}</h2>

          {elastics.length === 0 && (
            <p className="text-gray-500 text-sm">{t('elastics.none')}</p>
          )}

          {elastics.map((elastic, index) => (
            <div key={index} className="flex items-center justify-between my-2 w-full">
              <span className="mr-2">
                {t('elastics.elastic', { number: index + 1, teeth: elastic.join(' → ') })}
              </span>
              <button
                title={t('buttons.removeElastic')}
                onClick={() => removeElastic(index)}
                className="bg-red-500 text-white p-1 rounded"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <small className="block text-center mt-8 text-gray-500">
        {/* copyright by Drikus Roor, Koko Koding with current year */}
        {t('footer.copyright', { year: new Date().getFullYear() })}&nbsp;
        <a href="https://kokokoding.nl" target="_blank" rel="noopener noreferrer" className="text-jort hover:underline">Koko Koding</a>
      </small>

    </div>
  );
};

export default ElasticPlacer;