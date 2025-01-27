import React from "react";
import { FEATURES } from "../config";
import ToothIcon, { TOOTH_TYPE_MAP } from "./ToothIcon";
import { classNames } from "../util/class-names";
import { ElasticPoint } from "../types";
import { useTranslation } from "react-i18next";

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
  18: { className: 'translate-y-0 mr-32', rotation: '-rotate-90', counterRotation: 'rotate-90' },
  17: { className: 'translate-y-0 mr-32', rotation: '-rotate-90', counterRotation: 'rotate-90' },
  16: { className: 'translate-y-0 mr-32 sm:ml-2', rotation: '-rotate-[85deg]', counterRotation: 'rotate-[75deg]' },
  15: { className: 'translate-y-0 mr-32 sm:ml-4', rotation: '-rotate-[80deg]', counterRotation: 'rotate-[60deg]' },
  14: { className: 'translate-y-0 mr-32 sm:ml-6', rotation: '-rotate-[75deg]', counterRotation: 'rotate-[60deg]' },
  13: { className: 'translate-y-0 mr-28 sm:ml-10', rotation: '-rotate-[60deg]', counterRotation: 'rotate-45' },
  12: { className: 'translate-y-4 mr-16 sm:ml-22', rotation: '-rotate-[30deg]', counterRotation: 'rotate-[30deg]' },
  11: { className: 'translate-y-16 sm:ml-37', rotation: '-rotate-[5deg]', counterRotation: 'rotate-[10deg]' },
  21: { className: 'translate-y-16 sm:mr-37', rotation: 'rotate-[5deg]', counterRotation: '-rotate-[10deg]' },
  22: { className: 'translate-y-4 ml-16 sm:mr-22', rotation: 'rotate-[30deg]', counterRotation: '-rotate-[30deg]' },
  23: { className: 'translate-y-0 ml-28 sm:mr-10', rotation: 'rotate-[60deg]', counterRotation: '-rotate-45' },
  24: { className: 'translate-y-0 ml-32 sm:mr-6', rotation: 'rotate-[75deg]', counterRotation: '-rotate-[60deg]' },
  25: { className: 'translate-y-0 ml-32 sm:mr-4', rotation: 'rotate-[80deg]', counterRotation: '-rotate-[60deg]' },
  26: { className: 'translate-y-0 ml-32 sm:mr-2', rotation: 'rotate-[85deg]', counterRotation: '-rotate-[75deg]' },
  27: { className: 'translate-y-0 ml-32', rotation: 'rotate-90', counterRotation: '-rotate-90' },
  28: { className: 'translate-y-0 ml-32', rotation: 'rotate-90', counterRotation: '-rotate-90' },

  48: { className: '-translate-y-0 mr-32', rotation: '-rotate-90', counterRotation: 'rotate-90' },
  47: { className: 'translate-y-0 mr-32', rotation: '-rotate-90', counterRotation: 'rotate-90' },
  46: { className: 'translate-y-0 mr-32 sm:ml-2', rotation: '-rotate-[95deg]', counterRotation: 'rotate-[105deg]' },
  45: { className: 'translate-y-0 mr-32 sm:ml-4', rotation: '-rotate-[100deg]', counterRotation: 'rotate-[120deg]' },
  44: { className: 'translate-y-0 mr-32 sm:ml-6', rotation: '-rotate-[105deg]', counterRotation: 'rotate-[120deg]' },
  43: { className: 'translate-y-0 mr-28 sm:ml-10', rotation: '-rotate-[120deg]', counterRotation: 'rotate-[135deg]' },
  42: { className: '-translate-y-4 mr-16 sm:ml-22', rotation: '-rotate-[150deg]', counterRotation: 'rotate-[150deg]' },
  41: { className: '-translate-y-16 sm:ml-37', rotation: '-rotate-[175deg]', counterRotation: 'rotate-[170deg]' },
  31: { className: '-translate-y-16 sm:mr-37', rotation: 'rotate-[175deg]', counterRotation: '-rotate-[170deg]' },
  32: { className: '-translate-y-4 ml-16 mr-22', rotation: 'rotate-[150deg]', counterRotation: '-rotate-[150deg]' },
  33: { className: 'translate-y-0 ml-28 sm:mr-10', rotation: 'rotate-[120deg]', counterRotation: '-rotate-[135deg]' },
  34: { className: 'translate-y-0 ml-32 mr-6', rotation: 'rotate-[105deg]', counterRotation: '-rotate-[120deg]' },
  35: { className: 'translate-y-0 ml-32 mr-4', rotation: 'rotate-[100deg]', counterRotation: '-rotate-[120deg]' },
  36: { className: 'translate-y-0 ml-32 mr-2', rotation: 'rotate-[95deg]', counterRotation: '-rotate-[105deg]' },
  37: { className: 'translate-y-0 ml-32', rotation: 'rotate-90', counterRotation: '-rotate-90' },
  38: { className: 'translate-y-0 ml-32', rotation: 'rotate-90', counterRotation: '-rotate-90' },
}

type ToothMemo = {
  number: number;
  row: number;
  onClick: (number: number, outside: boolean) => void;
  onToggle: (number: number) => void;
  currentElastic: ElasticPoint[];
  disabled: boolean;
  setRef: (number: number, outside: boolean, ref: HTMLButtonElement) => void;
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

const getToothSideClassNames = (number: number, selected: boolean, disabled: boolean) => {
  if (disabled && FEATURES.DISABLE_TEETH) return 'bg-gray-300';
  if (selected) return 'border border-blue-900 bg-blue-500 bg-opacity-50';
  if (FEATURES.HIGHLIGHT_SPECIAL_TEETH) {
    if (middleIncisors.includes(number)) return 'bg-green-200';
    if (canines.includes(number)) return 'bg-purple-200';
  }
  return '';
};

const Tooth = React.memo(({ number, row, onClick, onToggle, currentElastic, disabled, setRef, isMirrorView }: ToothMemo & { isMirrorView: boolean }) => {

  const { t } = useTranslation();

  const handleClick = (e: React.MouseEvent, outside: boolean) => {

    // Set ref based on the element clicked
    setRef(number, outside, e.currentTarget as HTMLButtonElement);

    if (FEATURES.DISABLE_TEETH && e.ctrlKey || e.metaKey) {
      onToggle(number);
    } else {
      onClick(number, outside);
    }
  };

  const isSelected = (tooth: number, outside: boolean) => {
    return currentElastic.some(e => e.tooth === tooth && e.outside === outside);
  };

  const getToothPosition = (number: number) => {
    if (number < 20) return 'topRight';
    if (number < 30) return 'topLeft';
    if (number < 40) return 'bottomLeft';
    return 'bottomRight';
  };

  const getToothType = (number: number) => {
    const position = number % 10;
    switch (position) {
      case 1:
        return 'centralIncisor';
      case 2:
        return 'lateralIncisor';
      case 3:
        return 'canine';
      case 4:
        return 'firstPremolar';
      case 5:
        return 'secondPremolar';
      case 6:
        return 'firstMolar';
      case 7:
        return 'secondMolar';
      case 8:
        return 'thirdMolar';
      default:
        return 'centralIncisor'; // fallback
    }
  };

  const toothType = TOOTH_TYPE_MAP[number];
  const teethModification = teethModifications[number];

  return (
    <div
      className={`w-14 h-14 rounded-full m-0.5 flex flex-col items-center justify-center text-xs drop-shadow 
          ${getToothColor(number, false, disabled)}
          ${teethModification?.className || ''}
          ${teethModification?.rotation || ''}
    `}>

      {/* thin line that divides the tooth in half */}
      {FEATURES.SHOW_TOOTH_DIVIDER_LINE && (
        <div className="absolute h-14 bg-blue-500 rotate-90 opacity-25" style={{ width: 1 }} />
      )}

      {FEATURES.TOOTH_ICONS && (
        <div className="h-8 w-8" style={{ transform: isMirrorView ? 'scale(-1, 1)' : undefined }}>
          <ToothIcon
            type={toothType}
            className={`text-current text-gray-600 ${row === 0 ? 'rotate-180' : ''}`}
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
          getToothSideClassNames(number, isSelected(number, true), disabled),
          "absolute w-14 h-7 hover:bg-blue-500 hover:bg-opacity-50 rounded-t-full",
        )}
        style={{ top: 0, left: 0 }}
        ref={(el: HTMLButtonElement) => setRef(number, true, el)}
        onClick={(e) => handleClick(e, true)}
        title={t('teeth.tooltip', {
          position: t(`teeth.positions.${getToothPosition(number)}`),
          type: t(`teeth.types.${getToothType(number)}`),
          side: t('teeth.sides.outer')
        })}
      />

      {/* inner half */}
      <button
        disabled={disabled}
        className={classNames(
          getToothSideClassNames(number, isSelected(number, false), disabled),
          "absolute w-14 h-7 hover:bg-blue-500 hover:bg-opacity-50 rounded-b-full",
        )}
        style={{ bottom: 0, left: 0 }}
        ref={(el: HTMLButtonElement) => setRef(number, false, el)}
        onClick={(e) => handleClick(e, false)}
        title={t('teeth.tooltip', {
          position: t(`teeth.positions.${getToothPosition(number)}`),
          type: t(`teeth.types.${getToothType(number)}`),
          side: t('teeth.sides.inner')
        })}
      />

    </div>
  );
});

export default Tooth;
