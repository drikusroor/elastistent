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
    // @ts-ignore
    const _top = y < half;

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
