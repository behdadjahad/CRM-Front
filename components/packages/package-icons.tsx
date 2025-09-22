import React from 'react';

interface PackageIconProps {
    type?: 'طلایی' | 'نقره ای' | 'برنزی' | 'آبی' | 'سفید'; // Kept for backward compatibility
    color: 'طلایی' | 'نقره ای' | 'برنزی' | 'آبی' | 'سفید';
    className?: string;
}

// Helper function for color values
export const getColorValue = (color: PackageIconProps['color']): string => {
    switch (color) {
        case 'طلایی':
            return '#F8AC3F'; // amber-500
        case 'نقره ای':
            return '#B6BCC2'; // gray-400
        case 'برنزی':
            return '#BF8970'; // amber-600
        case 'آبی':
            return '#2949A4'; // blue-500
        case 'سفید':
            return '#6B7280'; // gray-500
        default:
            return '#2949A4'; // original blue
    }
};

// Diamond SVG Icon - Exact design with dynamic colors
const DiamondIcon: React.FC<{ className?: string; color?: string }> = ({ className, color = "#2949A4" }) => {
    // Generate unique IDs for gradients to avoid conflicts
    const uniqueId = Math.random().toString(36).substr(2, 9);
    const gradientId1 = `paint0_linear_${uniqueId}`;
    const gradientId2 = `paint1_linear_${uniqueId}`;
    const gradientId3 = `paint2_linear_${uniqueId}`;
    const gradientId4 = `paint3_radial_${uniqueId}`;
    const clipId = `clip0_${uniqueId}`;

    return (
        <svg
            width="41"
            height="40"
            viewBox="0 0 41 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <g clipPath={`url(#${clipId})`}>
                <rect x="0.5" width="40" height="40" rx="8" fill="#F8F9FB" />
                <circle
                    cx="11.4463"
                    cy="18.8757"
                    r="22.7451"
                    transform="rotate(-0.403168 11.4463 18.8757)"
                    fill={`url(#${gradientId1})`}
                    stroke={`url(#${gradientId2})`}
                    strokeWidth="0.0829262"
                />
                <circle
                    cx="21.5537"
                    cy="30.4616"
                    r="22.7451"
                    transform="rotate(-0.403168 21.5537 30.4616)"
                    fill={`url(#${gradientId3})`}
                    stroke={`url(#${gradientId4})`}
                    strokeWidth="0.0829262"
                />
                <path
                    d="M11.7639 17.2622H28.4635M15.4619 11.6726L20.1137 17.2622L24.7733 11.6765M28.2742 16.8197L25.0343 11.9598C24.9527 11.8375 24.912 11.7763 24.8581 11.732C24.8104 11.6928 24.7554 11.6634 24.6963 11.6454C24.6296 11.6252 24.556 11.6252 24.409 11.6252H15.8184C15.6714 11.6252 15.5979 11.6252 15.5311 11.6454C15.472 11.6634 15.417 11.6928 15.3693 11.732C15.3154 11.7763 15.2747 11.8375 15.1931 11.9598L11.9532 16.8197C11.847 16.979 11.7939 17.0587 11.7748 17.1443C11.758 17.22 11.7602 17.2987 11.7812 17.3733C11.805 17.4578 11.8624 17.5344 11.9773 17.6876L19.5124 27.7344C19.7164 28.0064 19.8184 28.1424 19.9434 28.191C20.0529 28.2336 20.1745 28.2336 20.284 28.191C20.409 28.1424 20.511 28.0064 20.715 27.7344L28.2501 17.6876C28.365 17.5344 28.4224 17.4578 28.4462 17.3733C28.4672 17.2987 28.4694 17.22 28.4526 17.1443C28.4335 17.0587 28.3804 16.979 28.2742 16.8197Z"
                    stroke={color}
                    strokeWidth="1.90569"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>

                <linearGradient
                    id={gradientId1}
                    x1="11.4463"
                    y1="-3.9109"
                    x2="11.4463"
                    y2="41.6622"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor={color} stopOpacity="0.56" />
                    <stop offset="1" stopColor="white" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient
                    id={gradientId2}
                    x1="35.3129"
                    y1="16.6102"
                    x2="-17.4781"
                    y2="28.3064"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor={color} />
                    <stop offset="1" stopColor={color} stopOpacity="0" />
                </linearGradient>
                <linearGradient
                    id={gradientId3}
                    x1="21.5537"
                    y1="7.67504"
                    x2="21.5537"
                    y2="53.2481"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor={color} stopOpacity="0.5" />
                    <stop offset="1" stopColor={color} stopOpacity="0" />
                </linearGradient>
                <radialGradient
                    id={gradientId4}
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(21.5537 30.4616) rotate(89.968) scale(47.2064)"
                >
                    <stop offset="0.046875" stopColor="#919EAB" stopOpacity="0" />
                    <stop offset="1" stopColor="#919EAB" />
                </radialGradient>
                <clipPath id={clipId}>
                    <rect x="0.5" width="40" height="40" rx="8" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
};


const PackageIcon: React.FC<PackageIconProps> = ({ type, color, className = "w-12 h-12" }) => {
    // All package types use the diamond icon with dynamic colors
    return <DiamondIcon className={className} color={getColorValue(color)} />;
};

export default PackageIcon;
