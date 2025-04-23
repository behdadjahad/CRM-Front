import { cn } from "@/lib/utils";

import { Checkbox } from "../ui/checkbox";

export default function CustomerCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-md w-full p-4", className)}>
      <div className="grid grid-cols-2 md:grid-cols-3  lg:grid-cols-4 p-4 gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            onCheckedChange={() => {}}
            //checked={}
          />

          <div>فرهاد امینی </div>
        </div>
        <div>نقره ای</div>
        <div>Frahad2018@gmail.com</div>
        <div>09177895236</div>
      </div>
    </div>
  );
}
