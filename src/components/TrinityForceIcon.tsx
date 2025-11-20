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
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`trinity-force-logo ${className}`}
            aria-hidden="true"
        >
            <defs>
                {/* Pulsing glow filter */}
                <filter id="trinity-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feFlood floodColor="#8b5cf6" floodOpacity="0.8" />
                    <feComposite in2="blur" operator="in" result="glow" />
                    <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Gradient for the prongs */}
                <linearGradient id="prong-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>

                <linearGradient id="prong-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>

                <linearGradient id="prong-gradient-3" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>

                {/* Center glow */}
                <radialGradient id="center-glow">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Top prong (crystal blade pointing up) */}
            <g filter="url(#trinity-glow)">
                <path
                    d="M100 30 L115 80 L105 85 L100 70 L95 85 L85 80 Z"
                    fill="url(#prong-gradient-1)"
                >
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
                </path>
                {/* Inner highlight */}
                <path
                    d="M100 35 L110 75 L100 70 L90 75 Z"
                    fill="#ffffff"
                    opacity="0.3"
                />
            </g>

            {/* Bottom left prong */}
            <g filter="url(#trinity-glow)">
                <path
                    d="M45 150 L70 110 L80 115 L65 125 L75 135 L60 165 Z"
                    fill="url(#prong-gradient-2)"
                >
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" begin="0.66s" repeatCount="indefinite" />
                </path>
                <path
                    d="M50 150 L70 115 L65 125 L60 160 Z"
                    fill="#ffffff"
                    opacity="0.3"
                />
            </g>

            {/* Bottom right prong */}
            <g filter="url(#trinity-glow)">
                <path
                    d="M155 150 L140 165 L125 135 L135 125 L120 115 L130 110 Z"
                    fill="url(#prong-gradient-3)"
                >
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" begin="1.33s" repeatCount="indefinite" />
                </path>
                <path
                    d="M150 150 L140 160 L135 125 L130 115 Z"
                    fill="#ffffff"
                    opacity="0.3"
                />
            </g>

            {/* Connecting energy lines */}
            <line x1="100" y1="85" x2="100" y2="100" stroke="#8b5cf6" strokeWidth="3" opacity="0.8" filter="url(#trinity-glow)">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
            </line>
            <line x1="75" y1="115" x2="100" y2="100" stroke="#06b6d4" strokeWidth="3" opacity="0.8" filter="url(#trinity-glow)">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.66s" repeatCount="indefinite" />
            </line>
            <line x1="125" y1="115" x2="100" y2="100" stroke="#fbbf24" strokeWidth="3" opacity="0.8" filter="url(#trinity-glow)">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="1.33s" repeatCount="indefinite" />
            </line>

            {/* Center core with pulsing glow */}
            <circle
                cx="100"
                cy="100"
                r="18"
                fill="url(#center-glow)"
                opacity="0.6"
            >
                <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
            </circle>

            <circle
                cx="100"
                cy="100"
                r="12"
                fill="#fbbf24"
                filter="url(#trinity-glow)"
            >
                <animate attributeName="r" values="12;14;12" dur="2s" repeatCount="indefinite" />
            </circle>

            <circle
                cx="100"
                cy="100"
                r="8"
                fill="#ffffff"
                opacity="0.9"
            >
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Sparkle effects */}
            <circle cx="100" cy="50" r="2" fill="#ffffff" opacity="0.8">
                <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="60" cy="130" r="2" fill="#06b6d4" opacity="0.8">
                <animate attributeName="opacity" values="0;1;0" dur="3s" begin="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="140" cy="130" r="2" fill="#fbbf24" opacity="0.8">
                <animate attributeName="opacity" values="0;1;0" dur="3s" begin="2s" repeatCount="indefinite" />
            </circle>
        </svg>
    );
};
