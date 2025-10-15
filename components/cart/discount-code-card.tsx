import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { setError, setLoading } from '@/store/cart-slice';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Image from 'next/image';

interface DiscountCodeCardProps {
    cartId: number;
    chadcoCustomerId: number;
}

export default function DiscountCodeCard({ cartId, chadcoCustomerId }: DiscountCodeCardProps) {
    const discountCode = false;
    const discountAmount = 10000;
    const isLoading = false;
    const error = false;
    // const dispatch = useDispatch();
    // const { discountCode, discountAmount, isLoading, error } = useSelector((state: RootState) => state.cart);
    const [inputCode, setInputCode] = useState('');

    // const handleApplyDiscount = async () => {
    //     if (!inputCode.trim()) {
    //         dispatch(setError('لطفاً کد تخفیف را وارد کنید.'));
    //         return;
    //     }

    //     dispatch(setLoading(true));
    //     dispatch(setError(null));

    //     // Mock validation
    //     await new Promise(resolve => setTimeout(resolve, 1000));

    //     if (inputCode.toLowerCase() === 'promo10') {
    //         dispatch(applyDiscount({ code: inputCode, amount: 10000 }));
    //         dispatch(setError(null));
    //     } else {
    //         dispatch(setError('کد تخفیف نامعتبر است.'));
    //         dispatch(removeDiscount());
    //     }
    //     dispatch(setLoading(false));
    //     setInputCode('');
    // };

    // const handleRemoveDiscount = () => {
    //     dispatch(removeDiscount());
    //     dispatch(setError(null));
    // };

    return (
        <div className="p-4 bg-white rounded-xl shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex  bg-gray-50 p-4 gap-4 rounded-lg items-start flex-col w-full">
                <div className="flex items-center justify-center gap-2 pb-3 ">
                    <Image src="/icons/payment-icon.svg" alt="order-summary-card-icon" width={15} height={15} />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white ">کد تخفیف</h3>
                </div>

                {discountCode ? (
                    <div className="flex items-center justify-between pb-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-3 rounded-md">
                        <span>کد تخفیف "{discountCode}" اعمال شد ({discountAmount.toLocaleString('fa-IR')} تومان)</span>
                        <Button
                            variant="foreground"
                            size="sm"
                            // onClick={handleRemoveDiscount}
                            className=""
                        >
                            <XCircle className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex xl:flex-row flex-col justify-start items-start gap-2">
                        <input
                            type="text"
                            placeholder="وارد کردن کد تخفیف"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            className="flex-1 px-3 py-2 lg:text-xs text-sm xl:text-sm font-normal border border-gray-300 dark:border-gray-600 rounded-lg bg-white placeholder:text-subtitle/80 outline-none"
                            disabled={isLoading}
                        />
                        <Button className='lg:text-xs text-sm xl:text-sm' variant="info" disabled={isLoading}>
                            {isLoading ? 'در حال اعمال...' : 'اعمال کد'}
                        </Button>
                    </div>
                )}
                {error && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {error}
                    </p>
                )}
            </div>
        </div>
    );
}