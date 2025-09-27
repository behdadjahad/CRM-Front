// types/api.ts

// Generic API Response Wrapper
export interface ApiResponse<T> {
    status: string;
    message: string;
    httpStatus: number;
    redirectURL: string | null;
    ui: {
        type: string | null;
        color: string | null;
    };
    data: T;
}

// Common API Error Response
export interface ApiErrorResponse {
    status: "error";
    message: string;
    httpStatus: number;
    redirectURL: string | null;
    ui: {
        type: string | null;
        color: string | null;
    };
    data: null;
}

// Success Response Type
export type ApiSuccessResponse<T> = ApiResponse<T>;

// Generic API Response (can be success or error)
export type ApiResponseType<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Pagination Types
export interface Pagination {
    limit: number;
    offset: number;
    total: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: Pagination;
}

// Common Query Parameters
export interface QueryParams {
    limit?: number;
    offset?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// Common Filter Types
export interface DateRange {
    startDate: string;
    endDate: string;
}

export interface StatusFilter {
    status?: string | string[];
}

export interface IdFilter {
    id?: number | number[];
}
