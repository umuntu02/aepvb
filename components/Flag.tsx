"use client";

export function BurundiFlag({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 600"
      className={className}
      width={size}
      height={size * 0.6}
      aria-label="Burundi Flag"
      role="img"
    >
      {/* Red and green triangles with white saltire */}
      <rect width="1000" height="600" fill="#CE1126" />
      <path d="M0,0 L1000,600 M1000,0 L0,600" stroke="#FFFFFF" strokeWidth="120" fill="none" />
      <path d="M0,0 L500,300 L0,600 Z" fill="#1EB53A" />
      <path d="M1000,0 L500,300 L1000,600 Z" fill="#1EB53A" />
      {/* White circle in center */}
      <circle cx="500" cy="300" r="170" fill="#FFFFFF" />
      {/* Three red stars - simplified representation */}
      <circle cx="500" cy="230" r="25" fill="#CE1126" stroke="#1EB53A" strokeWidth="6" />
      <circle cx="450" cy="380" r="25" fill="#CE1126" stroke="#1EB53A" strokeWidth="6" />
      <circle cx="550" cy="380" r="25" fill="#CE1126" stroke="#1EB53A" strokeWidth="6" />
    </svg>
  );
}
