import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPage } from "@/api/admin";
import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import FeatureSelectionTable from "./feature-selection-table";
import { cn } from "@/lib/utils";
import { features } from "process";
import { NoData } from "../no-data";
interface PageSelectionInfinitieTableInterface {
  onSendPageData: { (pages: any): void };
}
export default function PageSelectionInfinitieTable({
  onSendPageData,
}: PageSelectionInfinitieTableInterface) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [pageStatus, setPageStatus] = useState<{
    [key: number]: { show: boolean; enabled: boolean };
  }>({});
  const [featureStatus, setFeatureStatus] = useState<{
    [pageId: number]: {
      [featureId: number]: { show: boolean; enabled: boolean };
    };
  }>({});
  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const limit = 5;
  const {
    data: pageSelectionData,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["pageSelectionData"],
    queryFn: ({ pageParam = 1 }) => getPage(),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        lastPage?.data?.length === limit ? allPages.length + 1 : undefined;
      return nextPage;
    },
    initialPageParam: 1,
  });

  const pageList =
    (isSuccess &&
      pageSelectionData?.pages?.flatMap((page) =>
        page?.data?.map((item: any) => ({
          id: item?.id,
          list: [
            { label: "عنوان", value: item?.title },
            { label: "کد", value: item?.code },
            { label: "آدرس", value: item?.url },
          ],
          data: {
            id: item?.id,
            title: item?.title,
            code: item?.code,
            url: item?.url,
          },
          features: item?.features?.map((feature: any) => ({
            id: feature.id,
            list: [
              { label: "نام", value: feature.name },
              { label: "کد", value: feature.code },
              { label: "الگو آدرس", value: feature.urlPattern.join(", ") },
              { label: "توضیحات", value: feature.description },
            ],
            data: {
              id: feature.id,
              name: feature.name,
              code: feature.code,
              urlPattern: feature.urlPattern,
              description: feature.description,
            },
          })),
        }))
      )) ||
    [];

  const toggleShow = (id: number) => {
    setPageStatus((prev) => {
      const updated = {
        ...prev,
        [id]: {
          ...prev[id],
          show: !prev[id]?.show,
        },
      };

      const activePages = pageList.filter(
        (page) => updated[page.id]?.show || updated[page.id]?.enabled
      );

      generatePagesObject(activePages, featureStatus,updated);
      return updated;
    });
  };

  const toggleEnabled = (id: number) => {
    setPageStatus((prev) => {
      const updated = {
        ...prev,
        [id]: {
          ...prev[id],
          enabled: !prev[id]?.enabled,
        },
      };

      const activePages = pageList.filter(
        (page) => updated[page.id]?.show || updated[page.id]?.enabled
      );

generatePagesObject(activePages, featureStatus, updated);
      return updated;
    });
  };
  const generatePagesObject = (
    activePages: any[],
    featureState: typeof featureStatus,
    pageState: typeof pageStatus
  ) => {
    const pages = activePages.map((page) => {
      const pageInfo = pageState[page.id] || {}; // ✅ now using correct state
      const featureStates = featureState[page.id] || {};

      return {
        pageId: page.data.id,
        title: page.data.title,
        code: page.data.code,
        url: page.data.url,
        show: pageInfo.show || false,
        enabled: pageInfo.enabled || false,
        features: page.features.map((feature: any) => {
          const state = featureStates[feature.data.id] || {};
          return {
            featureId: feature.data.id,
            name: feature.data.name,
            code: feature.data.code,
            description: feature.data.description,
            urlPattern: feature.data.urlPattern,
            show: state.show || false,
            enabled: state.enabled || false,
          };
        }),
      };
    });

    onSendPageData({ pages });
  };

const handleToggleFeature = (
  pageId: number,
  featureId: number,
  field: "show" | "enabled"
) => {
  setFeatureStatus((prev) => {
    const current = prev[pageId]?.[featureId] || {
      show: false,
      enabled: false,
    };

    const updated = {
      ...prev,
      [pageId]: {
        ...prev[pageId],
        [featureId]: {
          ...current,
          [field]: !current[field],
        },
      },
    };

    const activePages = pageList.filter(
      (page) =>
        pageStatus[page.id]?.show ||
        pageStatus[page.id]?.enabled ||
        Object.values(updated[page.id] || {}).some(
          (f) => f.show || f.enabled
        )
    );

    // ✅ Correct argument order
    generatePagesObject(activePages, updated, pageStatus);

    return updated;
  });
};

  return (
    <div className="flex flex-col gap-4">
      <h2>تعیین وضعیت صفحه ها</h2>
    <Table>
      <TableHeader>
        <TableRow>
          {pageList?.[0]?.list?.map((col: any, idx: number) => (
            <TableHead
              key={idx}
              className="text-center text-xs bg-card border font-bold"
            >
              {col.label}
            </TableHead>
          ))}
          <TableHead className="text-center text-xs bg-card border font-bold">
            عملیات
          </TableHead>
          <TableHead className="text-center text-xs bg-card border font-bold">
            ویژگی ها
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pageList?.map((page: any, rowIndex) => (
          <Fragment key={page.id}>
            <TableRow className="border border-gray-200 bg-card" key={page.id}>
              {page?.list?.map((cell: any, cellIndex: number) => (
                <TableCell
                  key={cellIndex}
                  className="text-center text-xs border"
                >
                  {cell.value}
                </TableCell>
              ))}
              <TableCell className="text-center text-xs border">
                <div className="flex flex-row gap-2 items-center justify-center">
                  {" "}
                  <Button
                    variant={"transparent"}
                    className={cn(
                      "cursor-pointer text-sm font-semibold border h-9 rounded-md flex items-center justify-center text-subtitle/80 py-4 px-8 bg-gray-50",
                      {
                        "border-aqua-mute text-aqua-active":
                          pageStatus?.[page?.id]?.show,
                      }
                    )}
                    onClick={() => toggleShow(page.data.id)}
                  >
                    show
                  </Button>
                  <Button
                    variant={"transparent"}
                    className={cn(
                      "cursor-pointer text-sm font-semibold border h-9 rounded-md flex items-center justify-center text-subtitle/80 py-4 px-8 bg-gray-50",
                      {
                        "border-aqua-mute text-aqua-active":
                          pageStatus[page.id]?.enabled,
                      }
                    )}
                    onClick={() => toggleEnabled(page.data.id)}
                  >
                    enable
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-center border">
                <Button
                  className="border-none p-0"
                  onClick={() => toggleRow(rowIndex)}
                >
                  {expandedRows.includes(rowIndex) ? (
                    <FaChevronUp />
                  ) : (
                    <div className="flex items-center gap-2">
                      انتخاب <FaChevronDown />
                    </div>
                  )}
                </Button>
              </TableCell>
            </TableRow>
            {expandedRows.includes(rowIndex) && (
              <TableRow className="bg-gray-100">
                <TableCell
                  colSpan={page.list.length + 2}
                  className="text-sm text-gray-700 p-4"
                >
                  <div className="flex flex-col gap-2">
                    <div>لیست ویژگی ها</div>
                    {page?.features?.length > 0 ? (
                      <FeatureSelectionTable
                        featureList={page?.features}
                        onToggleFeature={(featureId, field) =>
                          handleToggleFeature(page.id, featureId, field)
                        }
                        featureStatus={featureStatus[page.id]}
                      />
                    ) : (
                      <NoData />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
      </TableBody>
      </Table>
      </div>
  );
}
