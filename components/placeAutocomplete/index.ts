/**
 * Place Autocomplete & Map Selection Components
 * 
 * این ماژول کامپوننت‌های جستجوی مکان و انتخاب از روی نقشه را ارائه می‌دهد.
 * 
 * @module placeAutocomplete
 * @author CRM-Front Development Team
 * @version 1.0.0
 * @since 2025-10-08
 * 
 * @description
 * این ماژول شامل کامپوننت‌های زیر است:
 * - PlaceAutocomplete: جستجوی مکان با autocomplete
 * - MapSelector: نقشه تعاملی با امکان انتخاب مکان
 * - PlaceAutocompleteWithMap: کامپوننت ترکیبی
 * - PlaceAutocompleteFormField: یکپارچه‌سازی با Form Maker
 * 
 * @example
 * // استفاده از PlaceAutocomplete
 * import PlaceAutocomplete from '@/components/placeAutocomplete/PlaceAutocomplete';
 * 
 * <PlaceAutocomplete
 *   onPlaceSelect={(place) => console.log(place)}
 *   countrycodes="ir"
 * />
 * 
 * @example
 * // استفاده از MapSelector (با dynamic import)
 * import dynamic from 'next/dynamic';
 * 
 * const MapSelector = dynamic(
 *   () => import('@/components/placeAutocomplete/MapSelector'),
 *   { ssr: false }
 * );
 * 
 * <MapSelector
 *   center={[35.6892, 51.3890]}
 *   zoom={13}
 *   onLocationSelect={(place) => console.log(place)}
 * />
 * 
 * @example
 * // استفاده از PlaceAutocompleteWithMap (با dynamic import)
 * import dynamic from 'next/dynamic';
 * 
 * const PlaceAutocompleteWithMap = dynamic(
 *   () => import('@/components/placeAutocomplete/PlaceAutocompleteWithMap'),
 *   { ssr: false }
 * );
 * 
 * <PlaceAutocompleteWithMap
 *   onPlaceSelect={(place) => console.log(place)}
 *   layout="vertical"
 *   countrycodes="ir"
 * />
 * 
 * @see {@link ../../../QUICK_START.md} برای شروع سریع
 * @see {@link ./README.md} برای مستندات کامل
 * @see {@link ./FORM_MAKER_INTEGRATION.md} برای یکپارچه‌سازی با Form Maker
 */

// اگر می‌خواهید از import مستقیم استفاده کنید (فقط PlaceAutocomplete - بدون نقشه)
export { default as PlaceAutocomplete } from './PlaceAutocomplete';
export { default as PlaceAutocompleteFormField } from './PlaceAutocompleteFormField';

// برای MapSelector و PlaceAutocompleteWithMap باید از dynamic import استفاده کنید:
// const MapSelector = dynamic(() => import('@/components/placeAutocomplete/MapSelector'), { ssr: false });
// const PlaceAutocompleteWithMap = dynamic(() => import('@/components/placeAutocomplete/PlaceAutocompleteWithMap'), { ssr: false });

// Type exports
export type {
    PlaceResult,
    PlaceAddress,
    PlaceAutocompleteProps,
    MapSelectorProps,
    PlaceAutocompleteWithMapProps,
    MarkerData,
} from '@/types/place';

