/**
 * Services Index
 * Centralized exports for all services
 */

// SSE Services
export { BaseSSEService } from './baseSSE';
export { CartSSEService } from './cartSSE';

// Types
export type {
    SSEConfig,
    SSEConnectionStatus,
    SSEEvent,
    SSEEventHandler,
    SSEConnectionHandler,
    SSEErrorHandler,
    SSEServiceInterface,
    UseSSEReturn
} from '@/types/sse';

export type {
    CartSSEConfig,
    CartSSEEvent,
    UseCartSSEReturn
} from '@/types/sse';
