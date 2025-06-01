import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getAllCustomers } from "@/api/customer";
export default function 

  CustomerManager({ onCheckHandler }: { onCheckHandler: (customer: any, isChecked: boolean) => void }) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);
 
  const customerSearchFormik = useFormik({
    initialValues: {
      clientKeyWord: "",
    },
    onSubmit: async () => {},
  });

  const checkCustomerHandler = (customer: any, isChecked: boolean) => {
    if (isChecked) {
      setSelectedCustomers((prevState) => [...prevState, customer]);
    } else {
      setSelectedCustomers((prevState) =>
        prevState.filter((item) => item.id !== customer.id)
      );
    }
    onCheckHandler(customer,isChecked)
  };

  const { data: allCustomers } = useQuery({
    queryKey: ["allCustomers"],
    queryFn: () => getAllCustomers(),
  });

  useEffect(() => {
    if (allCustomers) {
      const customersData = allCustomers?.data?.map((customer: any) => ({
        id: customer?.id,
        firstName: customer?.person?.firstName,
        ssd: customer?.person?.idNumber,
        job: customer?.person?.personJobs?.[0]?.jobs?.name,
        lastName: customer?.person?.lastName,
        email: customer?.communication?.email?.[0]?.communicationDetails,
    
        phone:customer?.communication?.mobile?.[0]?.communicationDetails ,
      }));
      setCustomers(customersData);
      setFilteredCustomers(customersData);
    }
  }, [allCustomers]);
  useEffect(() => {
    const keyword = customerSearchFormik.values.clientKeyWord.toLowerCase();

    if (!keyword) {
      setFilteredCustomers(customers); // Reset when empty
      return;
    }

    const filtered = customers.filter((customer) =>
      [
        customer.firstName,
        customer.lastName,
        customer.email,
        customer.phone,
        customer.ssd,
      ].some((field) => field?.toLowerCase().includes(keyword))
    );

    setFilteredCustomers(filtered);
  }, [customerSearchFormik.values.clientKeyWord, customers]);
  const highlightMatch = (text: string, keyword: string) => {
    if (!keyword) return text;
    if (!text) return;
    const regex = new RegExp(`(${keyword})`, "gi"); // Case-insensitive match
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={index} className="text-yellow-600 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  return (
    <div className="p-4 flex flex-col gap-2">
      <FormMaker
        form={customerSearchFormik}
        fields={[
          {
            key: "clientKeyWord",
            component: "input",
            icon: "/icons/search-icon.png",
            type: "text",
            className: "w-full border border-gray-200 rounded-md h-12 p-0",
          },
        ]}
      />
      <div className="max-h-60 overflow-y-auto flex flex-col gap-2">
        {filteredCustomers.map((customer) => {
          const isChecked = selectedCustomers.some(
            (item) => item.id === customer.id
          );
          const keyword = customerSearchFormik.values.clientKeyWord;

          return (
            <div
              key={customer.id}
              className="border border-gray-200 p-3 rounded-md cursor-pointer flex items-center justify-between"
            >
              <Checkbox
                onCheckedChange={(checked) =>
                  checkCustomerHandler(customer, Boolean(checked))
                }
                checked={isChecked}
              />
              <div className="flex items-center gap-2">
                {" "}
                <Image
                  src={"/icons/customer.png"}
                  alt="edit"
                  width={18}
                  height={18}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-primary-bold">
                    {highlightMatch(customer.firstName, keyword)}{" "}
                    {highlightMatch(customer.lastName, keyword)}
                  </span>
                  <span className="text-sm text-foreground-mute">
                    {/* {highlightMatch(customer.email, keyword)} */}
                  </span>
                </div>
              </div>
              <div className="flex items-center text-foreground-mute gap-2">
                <Image
                  src={"/icons/customerMobile.png"}
                  alt="edit"
                  width={12}
                  height={12}
                />
                {/* <span>{highlightMatch(customer.phone, keyword)}</span> */}
              </div>
              <div className="flex items-center text-foreground-mute gap-2">
                <Image
                  src={"/icons/customerID.png"}
                  alt="edit"
                  width={18}
                  height={18}
                />
                <span>{highlightMatch(customer.ssd, keyword)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
