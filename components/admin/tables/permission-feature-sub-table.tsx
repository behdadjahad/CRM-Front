
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Fragment, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getSinglePageFeature } from "@/api/admin";
import { Button } from "@/components/ui/button";
export interface PermissionFeatureSubTableInterface {
  featureList: any[];
  pageId: number;
  onSendSelectedFeatures: (selectedFeatures: any) => void;
}
export default function PermissionFeatureSubTable({
  featureList,
  pageId,
  onSendSelectedFeatures,
}: PermissionFeatureSubTableInterface) {

  const limit = 5;
  const {
    data: allFeaturesData,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["allFeaturesData",pageId],
    queryFn: ({ pageParam = 1 }) => getSinglePageFeature(pageId),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        lastPage?.data?.length === limit ? allPages.length + 1 : undefined;
      return nextPage;
    },
    initialPageParam: 1,
  });
const [selectedFeatures, setSelectedFeatures] = useState<any[]>([]);

useEffect(() => {
  if (!featureList || !pageId) return;

  const initialFeatures = featureList.map((feature: any) => ({
    pageId: pageId,
    featureId: feature.data.id,
    name: feature.data.name,
    code: feature.data.code,
    urlPattern: feature.data.urlPattern,
    description: feature.data.description,
    show: feature.data.show ?? false,
    enabled: feature.data.enabled ?? false,
    showIsSubmitted: true,
    enabledIsSubmitted: true,
  }));

  setSelectedFeatures(initialFeatures);
}, [featureList, pageId]);

  const allFeatureList =
    (isSuccess &&
      allFeaturesData?.pages?.flatMap((page) =>
        page?.data?.map((item: any) => {
          const matchingFeature = featureList?.find((f) => f.id === item.id);

          return {
            id: item?.id,
            list: [
              { label: "نام", value: item.name },
              { label: "کد", value: item.code },
              { label: "الگو آدرس", value: item.urlPattern.join(", ") },
              { label: "توضیحات", value: item.description },
            ],
            data: {
              id: item.id,
              name: item.name,
              code: item.code,
              urlPattern: item.urlPattern,
              description: item.description,
              show: matchingFeature?.data.show ?? item.show,
              enabled: matchingFeature?.data.enabled ?? item.enabled,
            },
          };
        })
      )) ||
    [];

  function toggleHandler(actionType: string, data: any) {

    const existingItem = selectedFeatures.find(
      (item) => item.featureId === data.id
    );
    let updatedSelectedFeatures;
    if (existingItem) {
      updatedSelectedFeatures = selectedFeatures.map((item) =>
        item.featureId === data.id
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
      updatedSelectedFeatures = [
        ...selectedFeatures,
        {
          featureId: data.id,
          pageId: pageId,
          name: data.name,
          code: data.code,
          urlPattern: data.urlPattern,
          description: data.description,
          show: actionType === "show",
          enabled: actionType === "enabled",
          showIsSubmitted: false,
          enabledIsSubmitted: false,
        },
      ];
    }

    setSelectedFeatures(updatedSelectedFeatures);
    console.log("updatedSelectedFeatures", updatedSelectedFeatures);
    onSendSelectedFeatures(updatedSelectedFeatures);
  }
  // useEffect(() => {
  //   if (onSendSelectedFeatures) {
  //     onSendSelectedFeatures(selectedFeatures);
  //   }
  // }, [selectedFeatures, onSendSelectedFeatures]);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {allFeatureList?.[0]?.list.map((col: any, idx: number) => (
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
        </TableRow>
      </TableHeader>

      <TableBody>
        {allFeatureList?.map((feature, rowIndex) => (
          <Fragment key={feature.id}>
            <TableRow className="border border-gray-200 bg-card">
              {feature.list.map((cell: any, cellIndex: number) => (
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
                          selectedFeatures?.find(
                            (item) => item.featureId === feature.data.id
                          )?.show &&
                          selectedFeatures?.find(
                            (item) => item.featureId === feature.data.id
                          )?.showIsSubmitted,
                      },
                      {
                        "border-green-400 text-green-400":
                          selectedFeatures?.find(
                            (item) => item.featureId === feature.data.id
                          )?.show &&
                          selectedFeatures?.find(
                            (item) => item.featureId === feature.data.id
                          )?.showIsSubmitted === false,
                      }
                    )}
                    onClick={() => {
                      toggleHandler("show", feature.data);
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
                          selectedFeatures?.find(
                            (item) => item.featureId === feature.data.id
                          )?.enabled &&
                          selectedFeatures?.find(
                            (item) => item.featureId === feature.data.id
                          )?.enabledIsSubmitted,
                      },
                      {
                        "border-green-400 text-green-400":
                          selectedFeatures?.find(
                            (item) => item.featureId === feature.data.id
                          )?.enabled &&
                          selectedFeatures?.find(
                            (item) => item.featureId === feature.data.id
                          )?.enabledIsSubmitted === false,
                      }
                    )}
                    onClick={() => {
                      toggleHandler("enabled", feature.data);
                    }}
                  >
                    enable
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
