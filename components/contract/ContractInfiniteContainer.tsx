import { getContracts } from "@/api/contract";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ContractInfiniteCard from "./ContractInfiniteCard";
import { Draggable } from "@hello-pangea/dnd";
import { convertDate } from "@/lib/date";
import { contractType, formatPrice } from "@/lib/utils";
export interface ContractInfiniteContainerInterface {
  status: string;
}

export default function ContractInfiniteContainer({
  status,
}: ContractInfiniteContainerInterface) {
  const { ref, inView } = useInView();
  const LIMIT = 6;

  const {
    data: contractPipeData,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["contractPipeData", status],
    queryFn: ({ pageParam = 1 }) =>
      getContracts({
        page: pageParam,
        limit: LIMIT,
        filters: { contractState: [status] },
      }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        lastPage?.data?.length === LIMIT ? allPages.length + 1 : undefined;
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
    contractPipeData?.pages?.map(
      (page) =>
        page?.data?.map((item: any, i: number) => {
          const contract = {
            id: item.id,
            headerData: {
              contractType: item?.contractType?.name ?? "",
              customer:
                item?.mainCustomerSoldto?.person?.firstName &&
                item?.mainCustomerSoldto?.person?.lastName
                  ? item?.mainCustomerSoldto?.person?.firstName +
                    " " +
                    item?.mainCustomerSoldto?.person?.lastName
                  : "",
              contractDate:
                item?.contractDate && item?.dateType
                  ? convertDate(item?.contractDate, item?.dateType)
                  : "",
            },
            list: [
              {
                label: "تاریخ ثبت:",
                value: convertDate(item?.submitDateTime, item?.dateType),
              },
              { label: "شماره قرارداد:", value: item?.contractNo },
              {
                label: "ثبت کننده:",
                value: item?.userSubmitter?.fullName ?? "",
              },
              {
                label: "مسئول قرارداد:",
                value: item?.userResponsible?.fullName
                  ? item?.userResponsible?.fullName
                  : "",
              },
              {
                label: "موضوع قرارداد:",
                value: item?.contractType?.name ?? "",
              },
            ],

            footerData: [
              {
                label: "درآمد:",
                value: item.sellPrice ? formatPrice(item?.sellPrice) : 0,
              },
              {
                label: "هزینه:",
                value: item?.buyPrice ? formatPrice(item?.buyPrice) : 0,
              },
              {
                label: item?.sellPrice - item?.buyPrice >= 0 ? "سود:" : "زیان:",
                value: formatPrice(item?.sellPrice - item?.buyPrice),
              },
            ],
          };
          const card = (
            <ContractInfiniteCard
              key={contract.id}
              {...contract}
              ref={page.data.length === i + 1 ? ref : null}
            />
          );

          return (
            <Draggable
              draggableId={contract.id.toString()}
              index={i}
              key={contract.id}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  {card}
                </div>
              )}
            </Draggable>
          );
        })
      //     if (page.data.length === i + 1) {
      //       return (
      //         <ContractInfiniteCard ref={ref} key={contract.id} {...contract} />
      //       );
      //     }
      //     return <ContractInfiniteCard key={contract.id} {...contract} />;
      //   })
    );
  return (
    <div className="h-[600px] overflow-y-auto flex flex-col gap-4 px-2 py-3">
      {content}
      {isFetchingNextPage && <h3>Loading...</h3>}
    </div>
  );
}
