import React from 'react';

// Constants for tooth types
export const TOOTH_TYPES = {
  MOLAR: 'molar',
  PREMOLAR: 'premolar',
  CANINE: 'canine',
  INCISOR: 'incisor',
} as const;

export type ToothType = typeof TOOTH_TYPES[keyof typeof TOOTH_TYPES];

interface ToothIconProps {
  type: ToothType;
  className?: string;
}

// Map tooth numbers to their types
export const TOOTH_TYPE_MAP: { [key: number]: ToothType } = {
  // Upper right
  18: TOOTH_TYPES.MOLAR,
  17: TOOTH_TYPES.MOLAR,
  16: TOOTH_TYPES.MOLAR,
  15: TOOTH_TYPES.PREMOLAR,
  14: TOOTH_TYPES.PREMOLAR,
  13: TOOTH_TYPES.CANINE,
  12: TOOTH_TYPES.INCISOR,
  11: TOOTH_TYPES.INCISOR,
  
  // Upper left
  21: TOOTH_TYPES.INCISOR,
  22: TOOTH_TYPES.INCISOR,
  23: TOOTH_TYPES.CANINE,
  24: TOOTH_TYPES.PREMOLAR,
  25: TOOTH_TYPES.PREMOLAR,
  26: TOOTH_TYPES.MOLAR,
  27: TOOTH_TYPES.MOLAR,
  28: TOOTH_TYPES.MOLAR,
  
  // Lower left
  38: TOOTH_TYPES.MOLAR,
  37: TOOTH_TYPES.MOLAR,
  36: TOOTH_TYPES.MOLAR,
  35: TOOTH_TYPES.PREMOLAR,
  34: TOOTH_TYPES.PREMOLAR,
  33: TOOTH_TYPES.CANINE,
  32: TOOTH_TYPES.INCISOR,
  31: TOOTH_TYPES.INCISOR,
  
  // Lower right
  41: TOOTH_TYPES.INCISOR,
  42: TOOTH_TYPES.INCISOR,
  43: TOOTH_TYPES.CANINE,
  44: TOOTH_TYPES.PREMOLAR,
  45: TOOTH_TYPES.PREMOLAR,
  46: TOOTH_TYPES.MOLAR,
  47: TOOTH_TYPES.MOLAR,
  48: TOOTH_TYPES.MOLAR,
};

const ToothIcon: React.FC<ToothIconProps> = ({ type, className = '' }) => {
  // Common SVG wrapper with standard viewBox
  const SvgWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg 
      viewBox="0 0 40 50" 
      className={`w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );

  switch (type) {
    case TOOTH_TYPES.MOLAR:
      return (
        <SvgWrapper>
          {/* Molar with multiple cusps and wider shape */}
          <path 
            d="M5 15 Q5 5 20 5 Q35 5 35 15
               L35 35 Q35 45 20 45 Q5 45 5 35 Z
               M12 15 L12 35 M20 15 L20 35 M28 15 L28 35"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          />
          <path
            d="M8 15 Q20 20 32 15 M8 35 Q20 30 32 35"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          />
        </SvgWrapper>
      );

    case TOOTH_TYPES.PREMOLAR:
      return (
        <SvgWrapper>
          {/* Premolar with two cusps */}
          <path 
            d="M10 15 Q10 5 20 5 Q30 5 30 15
               L30 35 Q30 45 20 45 Q10 45 10 35 Z"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          />
          <path
            d="M15 15 Q20 20 25 15 M15 35 Q20 30 25 35"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          />
        </SvgWrapper>
      );

    case TOOTH_TYPES.CANINE:
      return (
        <SvgWrapper>
          {/* Canine with pointed cusp */}
          <path 
            d="M15 15 Q15 5 20 5 Q25 5 25 15
               L25 35 Q25 45 20 45 Q15 45 15 35 Z"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          />
          <path
            d="M17 15 L20 8 L23 15"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          />
        </SvgWrapper>
      );

    case TOOTH_TYPES.INCISOR:
      return (
        <SvgWrapper>
          {/* Incisor with flat edge */}
          <path 
            d="M15 15 Q15 5 20 5 Q25 5 25 15
               L25 35 Q25 45 20 45 Q15 45 15 35 Z"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          />
          <path
            d="M17 15 L23 15"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          />
        </SvgWrapper>
      );

    default:
      return null;
  }
};

export default ToothIcon;