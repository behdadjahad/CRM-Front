import { ChevronLeft, Link } from "lucide-react";

interface CartHeaderProps {
    showBackButton?: boolean;
    backUrl?: string;
    title?: string;
}

export default function CartHeader({
    showBackButton,
    backUrl,
    title,
}: CartHeaderProps) {
    return (
        <div className="flex bg-danger flex-col gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <Link href="/single-features" className="flex items-center text-black hover:underline">
                    <ChevronLeft className="w-5 h-5 ml-2 rtl:rotate-180" />
                    بازگشت به فیچرها
                </Link>

            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">سبد خرید</h1>
        </div>
    )
}