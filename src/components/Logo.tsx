import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={`${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Upper teeth silhouette */}
    <path
      d="M20,30 C20,20 40,15 50,15 C60,15 80,20 80,30 L80,40 C80,45 60,50 50,50 C40,50 20,45 20,40 Z"
      fill="#ffffff"
      stroke="currentColor"
      strokeWidth="2"
    />
    
    {/* Lower teeth silhouette */}
    <path
      d="M20,70 C20,80 40,85 50,85 C60,85 80,80 80,70 L80,60 C80,55 60,50 50,50 C40,50 20,55 20,60 Z"
      fill="#ffffff"
      stroke="currentColor"
      strokeWidth="2"
    />
    
    {/* Elastic bands - dynamic, bouncy feel */}
    <path
      d="M35,35 C45,45 55,45 65,35"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      className="text-blue-500"
    />
    
    <path
      d="M35,65 C45,55 55,55 65,65"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      className="text-blue-500"
    />
    
    {/* Center connection points */}
    <circle cx="35" cy="35" r="2" fill="currentColor" className="text-blue-500" />
    <circle cx="65" cy="35" r="2" fill="currentColor" className="text-blue-500" />
    <circle cx="35" cy="65" r="2" fill="currentColor" className="text-blue-500" />
    <circle cx="65" cy="65" r="2" fill="currentColor" className="text-blue-500" />
  </svg>
);

export default Logo;