import React from "react";
import { FEATURES } from "../config";
import ToothIcon, { TOOTH_TYPE_MAP } from "./ToothIcon";
import { classNames } from "../util/class-names";

const middleIncisors = [11, 21, 31, 41];
const canines = [13, 23, 33, 43];

type TeethMofidication = {
  [key: number]: {
    className?: string;
    rotation?: string;
    counterRotation?: string;
  };
}

const teethModifications: TeethMofidication = {
  18: { className: 'translate-y-0', rotation: '-rotate-90', counterRotation: 'rotate-90' },
  17: { className: 'translate-y-0', rotation: '-rotate-90', counterRotation: 'rotate-90' },
  16: { className: 'translate-y-0 ml-2', rotation: '-rotate-[75deg]', counterRotation: 'rotate-[75deg]' },
  15: { className: 'translate-y-0 ml-4', rotation: '-rotate-[60deg]', counterRotation: 'rotate-[60deg]' },
  14: { className: 'translate-y-0 ml-6', rotation: '-rotate-[60deg]', counterRotation: 'rotate-[60deg]' },
  13: { className: 'translate-y-0 ml-10', rotation: '-rotate-45', counterRotation: 'rotate-45' },
  12: { className: 'translate-y-4 ml-22', rotation: '-rotate-[30deg]', counterRotation: 'rotate-[30deg]' },
  11: { className: 'translate-y-16 ml-37', rotation: '-rotate-[10deg]', counterRotation: 'rotate-[10deg]' },
  21: { className: 'translate-y-16 mr-37', rotation: 'rotate-[10deg]', counterRotation: '-rotate-[10deg]' },
  22: { className: 'translate-y-4 mr-22', rotation: 'rotate-[30deg]', counterRotation: '-rotate-[30deg]' },
  23: { className: 'translate-y-0 mr-10', rotation: 'rotate-45', counterRotation: '-rotate-45' },
  24: { className: 'translate-y-0 mr-6', rotation: 'rotate-[60deg]', counterRotation: '-rotate-[60deg]' },
  25: { className: 'translate-y-0 mr-4', rotation: 'rotate-[60deg]', counterRotation: '-rotate-[60deg]' },
  26: { className: 'translate-y-0 mr-2', rotation: 'rotate-[75deg]', counterRotation: '-rotate-[75deg]' },
  27: { className: 'translate-y-0', rotation: 'rotate-90', counterRotation: '-rotate-90' },
  28: { className: 'translate-y-0', rotation: 'rotate-90', counterRotation: '-rotate-90' },

  48: { className: '-translate-y-0', rotation: '-rotate-90', counterRotation: 'rotate-90' },
  47: { className: 'translate-y-0', rotation: '-rotate-90', counterRotation: 'rotate-90' },
  46: { className: 'translate-y-0 ml-2', rotation: '-rotate-[105deg]', counterRotation: 'rotate-[105deg]' },
  45: { className: 'translate-y-0 ml-4', rotation: '-rotate-[120deg]', counterRotation: 'rotate-[120deg]' },
  44: { className: 'translate-y-0 ml-6', rotation: '-rotate-[120deg]', counterRotation: 'rotate-[120deg]' },
  43: { className: 'translate-y-0 ml-10', rotation: '-rotate-[135deg]', counterRotation: 'rotate-[135deg]' },
  42: { className: '-translate-y-4 ml-20', rotation: '-rotate-[150deg]', counterRotation: 'rotate-[150deg]' },
  41: { className: '-translate-y-16 ml-35', rotation: '-rotate-[170deg]', counterRotation: 'rotate-[170deg]' },
  31: { className: '-translate-y-16 mr-35', rotation: 'rotate-[170deg]', counterRotation: '-rotate-[170deg]' },
  32: { className: '-translate-y-4 mr-20', rotation: 'rotate-[150deg]', counterRotation: '-rotate-[150deg]' },
  33: { className: 'translate-y-0 mr-10', rotation: 'rotate-[135deg]', counterRotation: '-rotate-[135deg]' },
  34: { className: 'translate-y-0 mr-6', rotation: 'rotate-[120deg]', counterRotation: '-rotate-[120deg]' },
  35: { className: 'translate-y-0 mr-4', rotation: 'rotate-[120deg]', counterRotation: '-rotate-[120deg]' },
  36: { className: 'translate-y-0 mr-2', rotation: 'rotate-[105deg]', counterRotation: '-rotate-[105deg]' },
  37: { className: 'translate-y-0', rotation: 'rotate-90', counterRotation: '-rotate-90' },
  38: { className: 'translate-y-0', rotation: 'rotate-90', counterRotation: '-rotate-90' },
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

const getToothSideColor = (number: number, selected: boolean, disabled: boolean) => {
  if (disabled && FEATURES.DISABLE_TEETH) return 'bg-gray-300';
  if (selected) return 'bg-blue-500';
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
  const teethModification = teethModifications[number];

  return (
    <div
      className={`w-14 h-14 rounded-full m-0.5 flex flex-col items-center justify-center text-xs drop-shadow 
          ${getToothColor(number, selected, disabled)}
          ${teethModification?.className || ''}
          ${teethModification?.rotation || ''}
    `}>
      {FEATURES.TOOTH_ICONS && (
        <div className="h-8 w-8" style={{ transform: isMirrorView ? 'scale(-1, 1)' : undefined }}>
          <ToothIcon
            type={toothType}
            className={`text-current ${selected ? 'text-white' : 'text-gray-600'} ${row === 0 ? 'rotate-180' : ''}`}
          />
        </div>
      )}
      <span className={classNames(isMirrorView ? 'transform scale-x-[-1]' : '', teethModification?.counterRotation || '')}>
        {number}
      </span>

      {/* outer half */}
      <button
        disabled={disabled}
        className={classNames(
          "absolute w-14 h-7 hover:bg-slate-800 opacity-20 rounded-t-full",
          getToothSideColor(number, selected, disabled)
        )}
        style={{ top: 0, left: 0 }}
        ref={(el: HTMLButtonElement) => setRef(number, el)}
        onClick={handleClick}

      />

      {/* inner half */}
      <button
        disabled={disabled}
        className={classNames(
          "absolute w-14 h-7 hover:bg-slate-800 opacity-20 rounded-b-full",
          getToothSideColor(number, selected, disabled)
        )}
        style={{ bottom: 0, left: 0 }}
        ref={(el: HTMLButtonElement) => setRef(number, el)}
        onClick={handleClick}
      />

    </div>
  );
});

export default Tooth;
