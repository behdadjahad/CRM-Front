export const SSE_CONFIG = {
    // API Base URL for SSE connections - matching your test page
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1',

    // SSE Connection Settings - matching your test page behavior
    RECONNECT_DELAY: parseInt(process.env.NEXT_PUBLIC_SSE_RECONNECT_DELAY || '1000'),
    MAX_RETRIES: parseInt(process.env.NEXT_PUBLIC_SSE_MAX_RETRIES || '5'),
    HEARTBEAT_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_SSE_HEARTBEAT_TIMEOUT || '30000'),

    // Feature Flags
    SSE_ENABLED: process.env.NEXT_PUBLIC_SSE_ENABLED !== 'false',

    // Cart SSE specific settings - matching your test page API
    CART_SSE: {
        ENDPOINT: '/cart/updates',
        AUTO_RECONNECT: true,
        RETRY_EXPONENTIAL_BACKOFF: true,
    },
};

export const getSSEUrl = (endpoint: string, params: Record<string, string | number> = {}) => {
    const url = new URL(`${SSE_CONFIG.API_BASE_URL}${endpoint}`);

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
    });

    return url.toString();
};

export const getCartSSEUrl = (chadcoCustomerId: number) => {
    return getSSEUrl(SSE_CONFIG.CART_SSE.ENDPOINT, { chadcoCustomerId });
};
