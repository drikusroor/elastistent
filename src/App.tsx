import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, PlusCircle, Share2, Redo2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const teethLayout = [
  [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
];

type TeethMofidication = {
  [key: number]: {
    className?: string;
  };
}

// Molars should be slightly wider than premolars
// Canines should be slightly pointier
// Incisors should be slightly smaller
const teethModifications: TeethMofidication = {
  18: { className: 'scale-x-110 -translate-y-6', },
  17: { className: 'scale-x-110 -translate-y-4', },
  16: { className: 'scale-x-110 -translate-y-3', },
  15: { className: 'scale-x-110 -translate-y-2', },
  14: { className: 'scale-x-110 -translate-y-1', },
  13: { className: '', },
  12: { className: 'zscale-y-105', },
  11: { className: 'zscale-y-110', },
  21: { className: 'zscale-y-110', },
  22: { className: 'zscale-y-105', },
  23: { className: '', },
  24: { className: 'scale-x-110 -translate-y-1', },
  25: { className: 'scale-x-110 -translate-y-2', },
  26: { className: 'scale-x-110 -translate-y-3', },
  27: { className: 'scale-x-110 -translate-y-4', },
  28: { className: 'scale-x-110 -translate-y-6', },

  48: { className: 'scale-x-110 -translate-y-6', },
  47: { className: 'scale-x-110 -translate-y-4', },
  46: { className: 'scale-x-110 -translate-y-3', },
  45: { className: 'scale-x-110 -translate-y-2', },
  44: { className: 'scale-x-110 -translate-y-1', },
  43: { className: '', },
  42: { className: 'zscale-y-105', },
  41: { className: 'zscale-y-110', },
  31: { className: 'zscale-y-110', },
  32: { className: 'zscale-y-105', },
  33: { className: '', },
  34: { className: 'scale-x-110 -translate-y-1', },
  35: { className: 'scale-x-110 -translate-y-2', },
  36: { className: 'scale-x-110 -translate-y-3', },
  37: { className: 'scale-x-110 -translate-y-4', },
  38: { className: 'scale-x-110 -translate-y-6', },
}

type ToothMemo = {
  number: number;
  onClick: (number: number) => void;
  selected: boolean;
  setRef: (number: number, ref: HTMLButtonElement) => void;
}

const Tooth = React.memo(({ number, onClick, selected, setRef }: ToothMemo) => (
  <button
    ref={(el: HTMLButtonElement) => setRef(number, el)}
    onClick={() => onClick(number)}
    className={`min-w-6 w-10 h-14 rounded m-1 flex items-center justify-center text-xs drop-shadow ${selected ? 'bg-blue-500 text-white' : 'bg-yellow-50'
      } ${teethModifications[number]?.className || ''}`}
  >
    {number}
  </button>
));

type Elastic = number[];

type ToothRef = {
  [key: number]: HTMLButtonElement;
}

const ElasticPlacer = () => {
  const [elastics, setElastics] = useState<Elastic[]>([]);
  const [currentElastic, setCurrentElastic] = useState<Elastic>([]);
  const [shareUrl, setShareUrl] = useState('');
  const toothRefs = useRef<ToothRef>({});
  const svgRef = useRef<SVGSVGElement>(null);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const savedElastics = params.get('elastics');

    if (savedElastics) {
      try {
        const parsedElastics = JSON.parse(savedElastics);
        setElastics(parsedElastics);
      } catch (error) {
        console.error("Error parsing elastics from URL:", error);
      }
    }
    initialLoadDone.current = true;
  }, []);

  useEffect(() => {
    if (initialLoadDone.current) {
      const elasticsParam = elastics.length > 0 ? `?elastics=${JSON.stringify(elastics)}` : '';
      const newUrl = `${window.location.origin}${window.location.pathname}${elasticsParam}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
      setShareUrl(newUrl);
    }
  }, [elastics]);

  useEffect(() => {
    if (initialLoadDone.current) {
      drawElastics();
    }
  }, [elastics, initialLoadDone.current]);

  const handleToothClick = useCallback((number: number) => {
    setCurrentElastic(prev =>
      prev.includes(number)
        ? prev.filter(n => n !== number)
        : [...prev, number]
    );
  }, []);

  const addElastic = useCallback(() => {
    if (currentElastic.length > 1) {
      setElastics(prev => [...prev, currentElastic]);
      setCurrentElastic([]);
    }
  }, [currentElastic]);

  const removeElastic = useCallback((index: number) => {
    setElastics(prev => prev.filter((_, i) => i !== index));
  }, []);

  const resetAll = useCallback(() => {
    setElastics([]);
    setCurrentElastic([]);
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

      const points = elastic.map(toothNumber => {
        const rect = toothRefs.current[toothNumber]?.getBoundingClientRect();
        const svgRect = svgRef.current!.getBoundingClientRect();
        return rect ? {
          x: rect.left - svgRect.left + rect.width / 2,
          y: rect.top - svgRect.top + rect.height / 2
        } : null;
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
  }, [elastics]);

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
        <h1 className="text-2xl font-bold mb-4 text-center text-white uppercase">Elastistent</h1>
        <div className="max-w-screen mx-auto bg-blue-200 sm:rounded-2xl py-8 sm:px-4 max-w-4xl overflow-x-auto">
          <div className="relative min-w-[580px] px-2 translate-y-3">
            <svg ref={svgRef} className="absolute inset-0 pointer-events-none z-10 drop-shadow max-w-4xl" style={{ width: '100%', height: '100%' }}></svg>
            {teethLayout.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center flex-1 w-full">
                {row.map((tooth) => (
                  <Tooth
                    key={tooth}
                    number={tooth}
                    onClick={handleToothClick}
                    selected={currentElastic.includes(tooth)}
                    setRef={setToothRef}
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
            title={currentElastic.length < 2 ? 'Selecteer minimaal 2 tanden' : 'Voeg elastiekje toe'}
          >
            <PlusCircle size={16} />
            Elastiekje toevoegen
          </button>
          <button
            onClick={resetAll}
            className="w-full bg-red-500 text-white px-4 py-2 rounded flex flex-row items-center gap-2"
          >
            <Redo2 size={16} />
            Begin opnieuw
          </button>
          <button
            onClick={handleShare}
            className="w-full bg-green-500 text-white px-4 py-2 rounded flex flex-row items-center gap-2"
          >
            <Share2 size={16} />
            Delen
          </button>
        </div>
        <div className='mx-auto'>
          <QRCodeSVG value={shareUrl} size={196} />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Elastiekjes:</h2>

          {elastics.length === 0 && (
            <p className="text-gray-500 text-sm">Geen elastiekjes geconfigureerd</p>
          )}

          {elastics.map((elastic, index) => (
            <div key={index} className="flex items-center justify-between my-2 w-full">
              <span className="mr-2">
                Elastiekje {index + 1}: {elastic.join(' → ')}
              </span>
              <button
                title="Verwijder elastiekje"
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
        &copy; {new Date().getFullYear().toString()} Drikus Roor, <a href="https://kokokoding.nl" target="_blank" rel="noopener noreferrer" className="text-jort hover:underline">Koko Koding</a>
      </small>

    </div>
  );
};

export default ElasticPlacer;