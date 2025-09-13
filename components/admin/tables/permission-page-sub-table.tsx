import { getPage } from "@/api/admin";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useEffect, useMemo, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import PermissionFeatureSubTableRefactore from "./permission-feature-sub-table";
import PermissionFeatureSubTable from "./permission-feature-sub-table";

interface PagePermissionSubTableInterface {
  pageList: any[];
  onDataGenerated: (data: any) => void;
}

export default function PermissionPageSubTable({
  pageList,
  onDataGenerated,
}: PagePermissionSubTableInterface) {
  console.log(pageList);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const limit = 5;
  const {
    data: allPagesData,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["allPagesData"],
    queryFn: ({ pageParam = 1 }) => getPage(),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        lastPage?.data?.length === limit ? allPages.length + 1 : undefined;
      return nextPage;
    },
    initialPageParam: 1,
  });
  const [selectedPages, setSelectedPages] = useState<any[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<any[]>([]);
const [selectedFeaturesByPage, setSelectedFeaturesByPage] = useState<Record<number, any[]>>({});
  useEffect(() => {
    if (!pageList) return;

    // Initialize Pages
    const initialPages = pageList.map((page) => ({
      pageId: page?.id,
      title: page?.data?.title,
      code: page?.data?.code,
      url: page?.data?.url,
      show: page?.data?.show ?? false,
      enabled: page?.data?.enabled ?? false,
      showIsSubmitted: true,
      enabledIsSubmitted: true,
    }));

    setSelectedPages(initialPages);

    // Initialize Features
    const initialFeatures = pageList.flatMap((page) => {
      const features = page?.data?.features || [];
      return features.map((feature: any) => ({
        pageId: page.id,
        featureId: feature.id,
        name: feature.name,
        code: feature.code,
        urlPattern: feature.urlPattern,
        description: feature.description,
        show: feature.show ?? false,
        enabled: feature.enabled ?? false,
        showIsSubmitted: true,
        enabledIsSubmitted: true,
      }));
    });

    setSelectedFeatures(initialFeatures);
  }, [pageList]);

  useEffect(() => {
    if (!pageList) return;

    const initialPages = pageList.map((page) => ({
      pageId: page?.id,
      title: page?.data?.title,
      code: page?.data?.code,
      url: page?.data?.url,
      show: page?.data?.show ?? false,
      enabled: page?.data?.enabled ?? false,
      showIsSubmitted: true,
      enabledIsSubmitted: true,
    }));

    setSelectedPages(initialPages);
  }, [pageList]);

  function generateSelectedData(
    selectedFeatures: any[],
    selectedPages: any[]
    // 👈 callback to parent
  ) {
    const result = {
      pages: selectedPages.map((page) => {
        const featuresForPage = selectedFeatures.filter(
          (feature) => feature.pageId === page.pageId
        );

        return {
          pageId: page?.pageId,
          title: page?.title,
          code: page?.code,
          url: page?.url,
          show: page?.show,
          enabled: page?.enabled,
          features:
            featuresForPage?.map((feature) => ({
              featureId: feature?.featureId,
              name: feature?.name,
              code: feature?.code,
              description: feature?.description,
              urlPattern: feature?.urlPattern,
              show: feature.show,
              enabled: feature.enabled,
            })) || [],
        };
      }),
    };

    onDataGenerated(result);
  }

  const allPageList =
    (isSuccess &&
      allPagesData?.pages?.flatMap((page) =>
        page?.data?.map((item: any) => {
          const matchingPage = pageList?.find((p) => p.id === item.id);
          return {
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
              show: matchingPage?.show ?? item.show,
              enabled: matchingPage?.enabled ?? item.enabled,
            },
          };
        })
      )) ||
    [];
  function toggleHandler(actionType: string, data: any) {
    const existingItem = selectedPages?.find((item) => item.pageId === data.id);
    let updatedSelectedPages;
    if (existingItem) {
      updatedSelectedPages = selectedPages?.map((item) =>
        item.pageId === data.id
          ? {
              ...item,
              [actionType]: !item[actionType],
              showIsSubmitted:
                actionType === "show" ? false : item.showIsSubmitted,
              enabledIsSubmitted:
                actionType === "enabled" ? false : item.enabledIsSubmitted,
            }
          : item
      );
    } else {
      updatedSelectedPages = [
        ...selectedPages,
        {
          pageId: data.id,
          title: data?.title,
          code: data?.code,
          url: data?.url,
          show: actionType === "show",
          enabled: actionType === "enabled",
          showIsSubmitted: false,
          enabledIsSubmitted: false,
        },
      ];
    }

    setSelectedPages(updatedSelectedPages);
    generateSelectedData(selectedFeatures, updatedSelectedPages);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {allPageList?.[0]?.list.map((col: any, idx: number) => (
            <TableHead
              key={idx}
              className="text-center text-xs bg-card border font-bold"
            >
              {col.label}
            </TableHead>
          ))}
          <TableHead className="text-center text-xs bg-card border font-bold">
            وضعیت
          </TableHead>
          <TableHead className="text-center text-xs bg-card border font-bold">
            لیست ویژگی ها
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {allPageList?.map((page, rowIndex) => (
          <Fragment key={page.id}>
            <TableRow className="border border-gray-200 bg-card">
              {page.list.map((cell: any, cellIndex: number) => (
                <TableCell
                  key={cellIndex}
                  className="text-center text-xs border"
                >
                  {cell.value}
                </TableCell>
              ))}
              <TableCell className="text-center text-xs border">
                <div className="flex items-center justify-center gap-2">
                  {" "}
                  <Button
                    variant={"transparent"}
                    className={cn(
                      "text-sm font-semibold border h-9 rounded-md flex items-center justify-center text-subtitle/80 py-4 px-8 bg-gray-50",
                      {
                        "border-aqua-mute text-aqua-active":
                          selectedPages?.find(
                            (item) => item.pageId === page.data.id
                          )?.show &&
                          selectedPages?.find(
                            (item) => item.pageId === page.data.id
                          )?.showIsSubmitted,
                      },
                      {
                        "border-green-400 text-green-400":
                          selectedPages?.find(
                            (item) => item.pageId === page.data.id
                          )?.show &&
                          selectedPages?.find(
                            (item) => item.pageId === page.data.id
                          )?.showIsSubmitted === false,
                      }
                    )}
                    onClick={() => {
                      toggleHandler("show", page.data);
                    }}
                  >
                    show
                  </Button>
                  <Button
                    variant={"transparent"}
                    className={cn(
                      "text-sm font-semibold border h-9 rounded-md flex items-center justify-center text-subtitle/80 py-4 px-8 bg-gray-50",
                      {
                        "border-aqua-mute text-aqua-active":
                          selectedPages?.find(
                            (item) => item.pageId === page.data.id
                          )?.enabled &&
                          selectedPages?.find(
                            (item) => item.pageId === page.data.id
                          )?.enabledIsSubmitted,
                      },
                      {
                        "border-green-400 text-green-400":
                          selectedPages?.find(
                            (item) => item.pageId === page.data.id
                          )?.enabled &&
                          selectedPages?.find(
                            (item) => item.pageId === page.data.id
                          )?.enabledIsSubmitted === false,
                      }
                    )}
                    onClick={() => {
                      toggleHandler("enabled", page.data);
                    }}
                  >
                    enable
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-center border">
                <Button
                  className="border-none p-0"
                  onClick={() => {
                    toggleRow(rowIndex);
                  }}
                >
                  {expandedRows.includes(rowIndex) ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
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
                    <div className="flex items-center justify-between">
                      <div>لیست ویژگی ها </div>
                    </div>

                    <PermissionFeatureSubTable
                      featureList={
                        pageList?.find((item) => item.id === page.id)
                          ?.featureList
                      }
                      pageId={page.id}
                      onSendSelectedFeatures={(selectedFeatures) => {
                        generateSelectedData(selectedFeatures, selectedPages);
                        setSelectedFeatures(selectedFeatures);
                      }}
                   
                    />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
