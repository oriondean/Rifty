import React from 'react';

interface TrinityForceIconProps {
    size?: number;
    className?: string;
}

export const TrinityForceIcon: React.FC<TrinityForceIconProps> = ({ size = 32, className = '' }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${className}`}
            aria-hidden="true"
            style={{
                animation: 'trinity-spin 20s linear infinite, trinity-pulse 3s ease-in-out infinite'
            }}
        >
            <defs>
                {/* Glow filter */}
                <filter id="trinity-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feFlood floodColor="currentColor" floodOpacity="0.8" />
                    <feComposite in2="blur" operator="in" result="glow" />
                    <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Gradient for the icon */}
                <linearGradient id="trinity-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                    <stop offset="50%" stopColor="currentColor" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
                </linearGradient>

                {/* Radial gradient for center glow */}
                <radialGradient id="center-glow">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Outer circle - pulsing glow */}
            <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.3"
                filter="url(#trinity-glow)"
            />

            {/* Three triangular shapes forming Trinity Force symbol */}

            {/* Top triangle */}
            <path
                d="M50 15 L60 35 L40 35 Z"
                fill="url(#trinity-gradient)"
                filter="url(#trinity-glow)"
            />

            {/* Bottom left triangle */}
            <path
                d="M30 70 L50 50 L35 85 Z"
                fill="url(#trinity-gradient)"
                filter="url(#trinity-glow)"
            />

            {/* Bottom right triangle */}
            <path
                d="M70 70 L65 85 L50 50 Z"
                fill="url(#trinity-gradient)"
                filter="url(#trinity-glow)"
            />

            {/* Center connecting lines */}
            <line x1="50" y1="35" x2="50" y2="50" stroke="currentColor" strokeWidth="3" filter="url(#trinity-glow)" />
            <line x1="50" y1="50" x2="42.5" y2="60" stroke="currentColor" strokeWidth="3" filter="url(#trinity-glow)" />
            <line x1="50" y1="50" x2="57.5" y2="60" stroke="currentColor" strokeWidth="3" filter="url(#trinity-glow)" />

            {/* Center core - glowing */}
            <circle
                cx="50"
                cy="50"
                r="8"
                fill="url(#center-glow)"
                filter="url(#trinity-glow)"
            />
            <circle
                cx="50"
                cy="50"
                r="5"
                fill="currentColor"
                filter="url(#trinity-glow)"
            />

            {/* CSS animations defined inline */}
            <style>{`
                @keyframes trinity-spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                
                @keyframes trinity-pulse {
                    0%, 100% {
                        opacity: 0.8;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.05);
                    }
                }
            `}</style>
        </svg>
    );
};
