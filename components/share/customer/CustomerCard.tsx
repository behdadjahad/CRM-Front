import { CustomerDataInterface } from "@/components/service/customer-infinite-card";
import Image from "next/image";


export default function CustomerCard({firstName,lastName,email,idNumber,phone}: CustomerDataInterface) {
  return (
    <div
      className="border p-3 rounded-md cursor-pointer flex flex-col md:flex-row items-first md:items-center gap-4 justify-between"
 
    >
      <div className="flex items-center gap-2">
    
        <div className="flex items-center gap-2">
          {" "}
          <div className="rounded-full flex items-center justify-center bg-[#F5F5F5] border border-gray-200 w-10 h-10">
            <Image
              src={"/icons/customer.png"}
              alt="edit"
              width={18}
              height={18}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-primary-bold">
              <>
               {firstName + " " + lastName} 
      
              </>
            </span>

            <span className="text-sm text-foreground-mute">
   
              {email}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center text-foreground-mute gap-2">
        <Image
          src={"/icons/customerMobile.png"}
          alt="edit"
          width={12}
          height={12}
        />
        <span>
          {phone} 
       
        </span>
      </div>
      <div className="flex items-center text-foreground-mute gap-2">
        <Image
          src={"/icons/customerID.png"}
          alt="edit"
          width={18}
          height={18}
        />
        <span>{idNumber}</span>
      </div>
    </div>
  );
}
