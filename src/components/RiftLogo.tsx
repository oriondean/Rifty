import React from 'react';

interface RiftLogoProps {
    size?: number;
    className?: string;
}

export const RiftLogo: React.FC<RiftLogoProps> = ({ size = 32, className = '' }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`text-hextech-cyan ${className}`}
            aria-hidden="true"
        >
            <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="riftGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                    <stop offset="100%" stopColor="#0397AB" stopOpacity="0.8" />
                </linearGradient>
            </defs>

            {/* Central Rift Shard */}
            <path
                d="M50 10 L65 40 L50 90 L35 40 Z"
                fill="url(#riftGradient)"
                filter="url(#glow)"
                className="origin-center"
            />

            {/* Floating Fragments */}
            <path
                d="M70 30 L80 45 L75 55 L65 40 Z"
                fill="currentColor"
                className="opacity-80"
            />
            <path
                d="M30 30 L20 45 L25 55 L35 40 Z"
                fill="currentColor"
                className="opacity-80"
            />

            {/* Energy Arcs */}
            <path
                d="M20 70 Q50 95 80 70"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                className="opacity-40"
                fill="none"
            />
        </svg>
    );
};
