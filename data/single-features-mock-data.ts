import { Unit } from "@/types/packages";

// Extended Unit interface for single features
export interface SingleFeatureUnit extends Unit {
    category?: {
        id: number;
        name: string;
    };
    tag?: string;
}

