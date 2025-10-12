import { getContracts } from "@/api/contract";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ContractInfiniteCard from "./ContractInfiniteCard";
import { Draggable } from "@hello-pangea/dnd";
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
            list: [{ label: "شماره قرارداد:", value: item?.contractNo }],
          };
          const card = (
            <ContractInfiniteCard
              key={contract.id}
              {...contract}
              ref={page.data.length === i + 1 ? ref : null}
            />
          );

          return (
            <Draggable draggableId={contract.id.toString()} index={i} key={contract.id}>
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
