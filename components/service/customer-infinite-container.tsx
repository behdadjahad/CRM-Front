import { useEffect } from "react";

import { useInView } from "react-intersection-observer";

import { useInfiniteQuery } from "@tanstack/react-query";
import { limitForInfiniteCustomers } from "@/lib/utils";
import { getAllCustomers } from "@/api/customer";
import CustomerInfiniteCard from "./customer-infinite-card";

export default function CustomerInfiniteContainer({
  onCheckCustomerhandler,
  searchKeyWord,

}: {
  onCheckCustomerhandler?: any;
  searchKeyWord?: string;

}) {
  const { ref, inView } = useInView();
  const LIMIT = limitForInfiniteCustomers;

  const {
    data: customersData,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["customersData", searchKeyWord],
    queryFn: ({ pageParam = 1 }) =>
      getAllCustomers({
        page: pageParam,
        limit: limitForInfiniteCustomers,
        keyword: searchKeyWord,
    
      }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        lastPage.data.length === LIMIT ? allPages.length + 1 : undefined;
      return nextPage;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const content =
    isSuccess &&
    customersData?.pages?.map((page) =>
      page?.data?.map((item: any, i: number) => {
        const customer = {
          id: item?.id,
          firstName: item?.person?.firstName,
          idNumber: item?.person?.idNumber,
          job: item?.person?.personJobs?.[0]?.jobs?.name,
          lastName: item?.person?.lastName,
          phone: item?.Communication?.mobile?.[0]?.communicationDetails,
          email: item?.Communication?.email?.[0]?.communicationDetails,
        };
        if (page.data.length === i + 1) {
          return (
            <CustomerInfiniteCard
              ref={ref}
              key={customer.id}
              customer={customer}
              onCheckCustomerhandler={onCheckCustomerhandler}
              searchKeyWord={searchKeyWord ? searchKeyWord : ""}
      
            />
          );
        }
        return (
          <CustomerInfiniteCard
            key={customer.id}
            customer={customer}
            onCheckCustomerhandler={onCheckCustomerhandler}
            searchKeyWord={searchKeyWord ? searchKeyWord : ""}
         
          />
        );
      })
    );

  return (
    <div className="max-h-64 overflow-scroll flex flex-col gap-4">
      {content}
      {isFetchingNextPage && <h3>Loading...</h3>}
    </div>
  );
}
