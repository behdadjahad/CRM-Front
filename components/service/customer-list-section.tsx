import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { getAllCustomers } from "@/api/customer";

export interface CustomerListSection {
  list: Customer[];
  onCheckHandler: (data: number) => void;
  fetchNextPage: any;
  hasNextPage: any;
  isFetchingNextPage: any;
}
export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  idNumber: string;
  email: string;
  job: string;
}
export default function CustomerListSection({
  list,
  onCheckHandler,
  // fetchNextPage,
  // // hasNextPage,
  // // isFetchingNextPage,
}: CustomerListSection) {
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(list);
  const customerSearchFormik = useFormik({
    initialValues: {
      clientKeyWord: "",
    },
    onSubmit: async () => {},
  });
  const checkCustomerHandler = (customerId: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedCustomers((prevState) => [...prevState, customerId]);
      onCheckHandler(customerId);
    } else {
      setSelectedCustomers((prevState) =>
        prevState.filter((item) => item !== customerId)
      );
    }
  };
  const { mutate: filterCustomerHandler } = useMutation({
    mutationFn: (keyword: string) => {
      return getAllCustomers(1);
    },
    onSuccess: () => {},
  });
  const debouncedSearch = useCallback(
    debounce((keyword: string) => {
      if (keyword.trim()) {
        filterCustomerHandler(keyword);
      } else {
        setFilteredCustomers(list);
      }
    }, 500),
    []
  );
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
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    debouncedSearch(customerSearchFormik.values.clientKeyWord);
  }, [customerSearchFormik.values.clientKeyWord]);
 const LIMIT = 10;
  const {
    data: customersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["customersData"],
    queryFn: ({ pageParam = 1 }) => getAllCustomers(pageParam),
    getNextPageParam:  (lastPage, allPages) => {
        const nextPage =
          lastPage.length === LIMIT ? allPages.length + 1 : undefined;
        return nextPage;
      },
    initialPageParam: 1,
  });


  useEffect(() => {
    if (customersData) {
      console.log(customersData);
      const allCustomers = customersData?.pages?.flatMap((page: any) =>
        page.data.map((customer: any) => ({
          id: customer?.id,
          firstName: customer?.person?.firstName,
          idNumber: customer?.person?.idNumber,
          job: customer?.person?.personJobs?.[0]?.jobs?.name,
          lastName: customer?.person?.lastName,
          phone: customer?.communication?.mobile?.[0]?.communicationDetails,
          email: customer?.communication?.email?.[0]?.communicationDetails,
        }))
      );

      setFilteredCustomers(allCustomers);
    }
  }, [customersData]);
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
      
        {filteredCustomers?.map((customer: Customer, index: number) => {
          const isChecked = selectedCustomers.some(
            (item: number) => item === customer.id
          );
          const keyword = customerSearchFormik.values.clientKeyWord;

          return (
            <div
              key={customer.id}
              className="border border-gray-200 p-3 rounded-md cursor-pointer flex items-center justify-between"
              ref={index === filteredCustomers.length - 1 ? ref : undefined}
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  onCheckedChange={(checked) =>
                    checkCustomerHandler(customer.id, Boolean(checked))
                  }
                  checked={isChecked}
                />
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
                      {highlightMatch(customer.firstName, keyword)}{" "}
                      {highlightMatch(customer.lastName, keyword)}
                    </span>
                    <span className="text-sm text-foreground-mute">
                      {highlightMatch(customer.email, keyword)}
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
                <span>{highlightMatch(customer.phone, keyword)}</span>
              </div>
              <div className="flex items-center text-foreground-mute gap-2">
                <Image
                  src={"/icons/customerID.png"}
                  alt="edit"
                  width={18}
                  height={18}
                />
                <span>{highlightMatch(customer.idNumber, keyword)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
