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
  18: { className: 'translate-y-0 scale-x-110', },
  17: { className: 'translate-y-0 scale-x-110', },
  16: { className: 'translate-y-0 scale-x-110', },
  15: { className: 'translate-y-0 scale-x-110', },
  14: { className: 'translate-y-0 scale-x-110', },
  13: { className: 'translate-y-0', },
  12: { className: 'translate-y-0', },
  11: { className: 'translate-y-0', },
  21: { className: 'translate-y-0', },
  22: { className: 'translate-y-0', },
  23: { className: 'translate-y-0', },
  24: { className: 'translate-y-0 scale-x-110', },
  25: { className: 'translate-y-0 scale-x-110', },
  26: { className: 'translate-y-0 scale-x-110', },
  27: { className: 'translate-y-0 scale-x-110', },
  28: { className: 'translate-y-0 scale-x-110', },

  48: { className: 'translate-y-0 scale-x-110', },
  47: { className: 'translate-y-0 scale-x-110', },
  46: { className: 'translate-y-0 scale-x-110', },
  45: { className: 'translate-y-0 scale-x-110', },
  44: { className: 'translate-y-0 scale-x-110', },
  43: { className: 'translate-y-0', },
  42: { className: 'translate-y-0', },
  41: { className: 'translate-y-0', },
  31: { className: 'translate-y-0', },
  32: { className: 'translate-y-0', },
  33: { className: 'translate-y-0', },
  34: { className: 'translate-y-0 scale-x-110', },
  35: { className: 'translate-y-0 scale-x-110', },
  36: { className: 'translate-y-0 scale-x-110', },
  37: { className: 'translate-y-0 scale-x-110', },
  38: { className: 'translate-y-0 scale-x-110', },
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
      className={`min-w-6 w-10 h-14 rounded-full m-1 flex flex-col items-center justify-center text-xs drop-shadow 
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
