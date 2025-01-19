import React from "react";
import { FEATURES } from "../config";
import ToothIcon, { TOOTH_TYPE_MAP } from "./ToothIcon";

const middleIncisors = [11, 21, 31, 41];
const canines = [13, 23, 33, 43];

type TeethMofidication = {
  [key: number]: {
    className?: string;
  };
}

const teethModifications: Record<number, { className: string }> = {
  // ------------------ TOP ROW ------------------
  // Quadrant 1 (18 -> 11) - Right side (patient's perspective)
  18: { className: 'scale-x-110 -rotate-90 translate-y-0' },
  17: { className: 'scale-x-110 -rotate-[80deg] -translate-y-4' },
  16: { className: 'scale-x-110 -rotate-[70deg] -translate-y-8' },
  15: { className: 'scale-x-105 -rotate-[60deg]  -translate-y-12' },
  14: { className: 'scale-x-105 -rotate-[50deg]  -translate-y-16' },
  13: { className: 'scale-x-95  -rotate-2  -translate-y-20' }, // pointier canine
  12: { className: 'scale-x-90  -rotate-1  -translate-y-24' }, // smaller incisor
  11: { className: 'scale-x-90  rotate-0   -translate-y-28' }, // top center, highest

  // Quadrant 2 (21 -> 28) - Left side (patient's perspective)
  21: { className: 'scale-x-90  rotate-0   -translate-y-28' },
  22: { className: 'scale-x-90  rotate-1   -translate-y-24' },
  23: { className: 'scale-x-95  rotate-2   -translate-y-20' },
  24: { className: 'scale-x-105 rotate-[50deg]   -translate-y-16' },
  25: { className: 'scale-x-105 rotate-[60deg]   -translate-y-12' },
  26: { className: 'scale-x-110 rotate-[70deg]  -translate-y-8' },
  27: { className: 'scale-x-110 rotate-[80deg]  -translate-y-4' },
  28: { className: 'scale-x-110 rotate-90  translate-y-0' },

  // ------------------ BOTTOM ROW ------------------
  // Quadrant 4 (48 -> 41) - Lower right
  48: { className: 'scale-x-110 rotate-90  translate-y-0' },
  47: { className: 'scale-x-110 rotate-[80deg]  translate-y-4' },
  46: { className: 'scale-x-110 rotate-[70deg]  translate-y-8' },
  45: { className: 'scale-x-105 rotate-[60deg]  translate-y-12' },
  44: { className: 'scale-x-105 rotate-[50deg]  translate-y-16' },
  43: { className: 'scale-x-95  rotate-2   translate-y-20' },
  42: { className: 'scale-x-90  rotate-1   translate-y-24' },
  41: { className: 'scale-x-90  rotate-0   translate-y-28' }, // bottom center, lowest

  // Quadrant 3 (31 -> 38) - Lower left
  31: { className: 'scale-x-90  -rotate-0  translate-y-28' },
  32: { className: 'scale-x-90  -rotate-1  translate-y-24' },
  33: { className: 'scale-x-95  -rotate-2  translate-y-20' },
  34: { className: 'scale-x-105 -rotate-[50deg]  translate-y-16' },
  35: { className: 'scale-x-105 -rotate-[60deg]  translate-y-12' },
  36: { className: 'scale-x-110 -rotate-[70deg] translate-y-8' },
  37: { className: 'scale-x-110 -rotate-[80deg] translate-y-4' },
  38: { className: 'scale-x-110 -rotate-90 translate-y-0' },
};

type ToothMemo = {
  number: number;
  row: number;
  onClick: (number: number) => void;
  onToggle: (number: number) => void;
  selected: boolean;
  disabled: boolean;
  setRef: (number: number, ref: HTMLButtonElement) => void;
}

const getToothColor = (number: number, selected: boolean, disabled: boolean) => {
  if (disabled && FEATURES.DISABLE_TEETH) return 'bg-gray-300';
  if (selected) return 'bg-blue-500 text-white';
  if (FEATURES.HIGHLIGHT_SPECIAL_TEETH) {
    if (middleIncisors.includes(number)) return 'bg-green-200';
    if (canines.includes(number)) return 'bg-purple-200';
  }
  return 'bg-yellow-50';
};



const Tooth = React.memo(({ number, row, onClick, onToggle, selected, disabled, setRef, isMirrorView }: ToothMemo & { isMirrorView: boolean }) => {
  const handleClick = (e: React.MouseEvent) => {

    // get click location on the tooth (y coordinate is most important)
    // we want to know if the click was on the top or bottom half of the tooth
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const half = rect.height / 2;
    const top = y < half;

    // TODO: implement top/bottom half click handling

    if (FEATURES.DISABLE_TEETH && e.ctrlKey || e.metaKey) {
      onToggle(number);
    } else {
      onClick(number);
    }
  };

  const toothType = TOOTH_TYPE_MAP[number];

  return (
    <button
      ref={(el: HTMLButtonElement) => setRef(number, el)}
      onClick={handleClick}
      className={`min-w-6 w-10 h-14 rounded m-1 flex flex-col items-center justify-center text-xs drop-shadow 
          ${getToothColor(number, selected, disabled)}
          ${teethModifications[number]?.className || ''}
          `}
    >
      {FEATURES.TOOTH_ICONS && (
        <div className="h-8 w-8" style={{ transform: isMirrorView ? 'scale(-1, 1)' : undefined }}>
          <ToothIcon
            type={toothType}
            className={`text-current ${selected ? 'text-white' : 'text-gray-600'} ${row === 0 ? 'rotate-180' : ''}`}
          />
        </div>
      )}
      < span className={isMirrorView ? 'transform scale-x-[-1]' : ''}>
        {number}
      </span>
    </button >
  );
});

export default Tooth;