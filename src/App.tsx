import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, PlusCircle, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const teethLayout = [
  [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
];

const Tooth = React.memo(({ number, onClick, selected, setRef }) => (
  <button
    ref={(el) => setRef(number, el)}
    onClick={() => onClick(number)}
    className={`min-w-6 w-10 h-14 rounded m-1 flex items-center justify-center text-xs drop-shadow ${selected ? 'bg-blue-500 text-white' : 'bg-yellow-50'
      }`}
  >
    {number}
  </button>
));

const ElasticPlacer = () => {
  const [elastics, setElastics] = useState([]);
  const [currentElastic, setCurrentElastic] = useState([]);
  const [shareUrl, setShareUrl] = useState('');
  const toothRefs = useRef({});
  const svgRef = useRef(null);
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

  const handleToothClick = useCallback((number) => {
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

  const removeElastic = useCallback((index) => {
    setElastics(prev => prev.filter((_, i) => i !== index));
  }, []);

  const resetAll = useCallback(() => {
    setElastics([]);
    setCurrentElastic([]);
    window.history.pushState({ path: window.location.pathname }, '', window.location.pathname);
    setShareUrl(window.location.origin + window.location.pathname);
  }, []);

  const setToothRef = useCallback((number, ref) => {
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
      const points = elastic.map(toothNumber => {
        const rect = toothRefs.current[toothNumber]?.getBoundingClientRect();
        const svgRect = svgRef.current.getBoundingClientRect();
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
        title: 'Mijn Stiek configuratie',
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
    <div className="container mx-auto sm:p-4">
      <div className="sm:rounded-3xl sm:px-4 bg-green-700 sm:py-8">
        <h1 className="text-2xl font-bold py-4 text-center text-white drop-shadow">Stiek</h1>
        <div className="max-w-screen mx-auto mb-4 bg-blue-200 sm:rounded-2xl py-8 sm:px-4 max-w-4xl overflow-x-auto">
          <div className="relative min-w-[580px] px-2">
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
      <div className="mt-4 mb-4 mx-auto flex flex-col sm:flex-row justify-center items-center gap-2">
        <button
          onClick={addElastic}
          className={`bg-blue-500 text-white px-4 py-2 rounded mr-2 flex flex-row items-center gap-2 ${currentElastic.length < 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentElastic.length < 2}
        >
          <PlusCircle size={16} />
          Elastiekje toevoegen
        </button>
        <button
          onClick={resetAll}
          className="bg-red-500 text-white px-4 py-2 rounded flex flex-row items-center gap-2"
        >
          <X size={16} />
          Begin opnieuw
        </button>
        <button
          onClick={handleShare}
          className="bg-green-500 text-white px-4 py-2 rounded flex flex-row items-center gap-2"
        >
          <Share2 size={16} />
          Delen
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">QR Code</h2>
        <QRCodeSVG value={shareUrl} size={128} />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Geplaatste elastiekjes:</h2>
        {elastics.map((elastic, index) => (
          <div key={index} className="flex items-center mb-2">
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
  );
};

export default ElasticPlacer;