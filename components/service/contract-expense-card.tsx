import { formatPrice } from "@/lib/utils";
import Image from "next/image";

export interface ExpenseCardInterface {
  expenseInfo: {
    price: string;
    pricePostFix: string;
    convertedPrice: string;
    convertedPricePostFix: string;
  }[];
  title: string;
  icon: string;
}

export default function ContractExpenseCard({
  title,
  icon,
  expenseInfo = [],
}: ExpenseCardInterface) {
  return (
    <div className="flex flex-col p-4 border-t border-dashed border-boredr/20 gap-4 mt-2">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center rounded-full overflow-hidden bg-background">
          <Image
            src={icon}
            alt={title}
            width={1024}
            height={1024}
            className="w-3.5 h-3"
          />
        </div>
        <div className="text-primary text-sm">
          <span className="font-bold ">{title}</span>
          <span>(هزینه)</span>
        </div>
      </div>
      <div className="flex justify-between flex-col gap-2">
        {expenseInfo.map((item, index) => (
          <div
            key={`expense-info-${index}`}
            className="flex justify-between items-center gap-2"
          >
            <div className="flex justify-between items-center gap-1">
              <span className="text-xs font-bold">
                {formatPrice(item.price)}
              </span>
              <span className="text-xs font-bold">{item.pricePostFix}</span>
            </div>
            <div className="flex justify-between items-center gap-1">
              <span className="text-xs text-primary-active">
                {formatPrice(item.convertedPrice)}
              </span>
              <span className="text-xs text-primary-active">
                {item.convertedPricePostFix}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
