"use client";

interface FuelTimeIconProps {
  size?: number;
  className?: string;
}

export function FuelTimeIcon({ size = 64, className = "" }: FuelTimeIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ftBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#4caf50" }} />
          <stop offset="100%" style={{ stopColor: "#2e7d32" }} />
        </linearGradient>
      </defs>
      {/* Background circle */}
      <circle cx="256" cy="256" r="240" fill="url(#ftBgGradient)" />
      {/* Clock face */}
      <circle cx="256" cy="256" r="180" fill="white" fillOpacity="0.95" />
      {/* Clock marks */}
      <g fill="#2e7d32">
        <rect x="252" y="90" width="8" height="30" rx="4" />
        <rect x="252" y="392" width="8" height="30" rx="4" />
        <rect x="90" y="252" width="30" height="8" rx="4" />
        <rect x="392" y="252" width="30" height="8" rx="4" />
      </g>
      {/* Eating window arc */}
      <path
        d="M 256 100 A 156 156 0 0 1 412 256"
        stroke="#4caf50"
        strokeWidth="24"
        fill="none"
        strokeLinecap="round"
      />
      {/* Fork */}
      <g transform="translate(200, 180)">
        <path
          d="M30 0 L30 60 M20 0 L20 30 Q20 40 30 40 Q40 40 40 30 L40 0 M30 60 L30 100"
          stroke="#ff9800"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
      </g>
      {/* Knife */}
      <g transform="translate(260, 180)">
        <path
          d="M30 0 Q50 30 30 50 L30 100"
          stroke="#ff9800"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
