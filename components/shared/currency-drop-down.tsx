"use client";

import { getCurrencies } from "@/api/currency";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

import Image from "next/image";
import { useEffect, useState } from "react";
import { OptionType } from "./form-maker";

export interface CurrencyDropDownInterface {
  className?: string;
}

export default function CurrencyDropDown({
  className,
}: CurrencyDropDownInterface) {
    const [currencies, setCurrencies] = useState<OptionType[]>([]);
    const [activeCurrency, setActiveCurrency] = useState<OptionType>();
    const { data: currency } = useQuery({
        queryKey: ["Currency"],
        queryFn: () => getCurrencies(),
      });
      useEffect(() => {
        if (currency) {
          const currencyOptions = currency.data.map((item: any) => ({
            value: item.id.toString(),
            label: item.name,
          }));
          setCurrencies(currencyOptions);
        
        }
      }, [currency]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "bg-badge p-2 rounded-lg flex flex-row items-center gap-3 outline-none h-10",
          className
        )}
      >
        <div className="flex flex-row items-center gap-2 text-badge-foreground">
          <Image
            src={"/icons/edit-primary.png"}
            width={16}
            height={16}
            className="object-cover w-4 h-4"
            alt="edit-currency"
          />

          <span className="text-sm">{activeCurrency ? activeCurrency.label:"تومان"}</span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
      {currencies.map((item) => (
          <div
            key={item.value}
            className="text-sm cursor-pointer hover:bg-foreground-mute w-full p-2 text-center rounded-sm hover:text-card"
            onClick={() => {
              
                setActiveCurrency(item);
            }}
          >
            {item.label}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
