import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">سبد خرید شما خالی است</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">برای ادامه، فیچرهای مورد نظر خود را اضافه کنید.</p>
            <Link href="/single-features" className="px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
                مشاهده فیچرها
            </Link>
        </div>
    );
}
