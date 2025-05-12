"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import OverviewDetailContainer from "../satisfaction/overview-detail-container";
import SocialMedia from "../satisfaction/social-media";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCallDevices,
  getSatisfactionLabels,
  submitSatisfaction,
} from "@/api/satisfaction";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import { Button } from "../ui/button";
import { useFormik } from "formik";
import Overview, { OverviewInterface } from "../satisfaction/overview";

export default function Satisfaction({
  onCloseHandler,
  itemId,
  score,
  totalVotes,
}: {
  onCloseHandler: () => any;
  itemId: string;
  score: number;
  totalVotes: number;
}) {
  const [callDevices, setCallDevices] = useState<any[]>([]);
  const [satisfactionLabels, setSatisfactionLabels] = useState<any[]>([]);

  const { data: callDeviceData } = useQuery({
    queryKey: ["callDeviceData"],
    queryFn: async () => await getCallDevices(),
  });
  const { data: SatisfactionLabelsData } = useQuery({
    queryKey: ["SatisfactionLabelsData"],
    queryFn: async () => await getSatisfactionLabels(),
  });
  useEffect(() => {
    if (callDeviceData) {
      // const callDeviceOptions = callDeviceData.data.map((item: any) => ({
      //   id: item.id,
      //   label: item.name,
      //   image: item.iconFile,
      // }));
      // setCallDevices(callDeviceOptions);
    }
  }, [callDeviceData]);
  useEffect(() => {
    if (SatisfactionLabelsData) {
      // const satisfactionLabelsOptions = SatisfactionLabelsData.data.map(
      //   (item: any) => ({
      //     id: item.id,
      //     label: item.reasonName,
      //     type: item.satisfactionKind,
      //   })
      // );
      // setSatisfactionLabels(satisfactionLabelsOptions);
    }
  }, [SatisfactionLabelsData]);

  const { mutate: satisfactionSubmitHandler } = useMutation({
    mutationFn: ({ data, id }: { data: any; id: number }) => {
      return submitSatisfaction(data, id);
    },
    onSuccess: () => {},
  });
  function submit() {
    const data = {
      satisfactionReasonId: formik.values.satisfactionLableId,
      callDeviceId: formik.values.callDeviceId,
      satisfactionScore: formik.values.score,
      description: formik.values.explanation,
    };

    satisfactionSubmitHandler({ data, id: Number(itemId) });
  }
  const formik = useFormik({
    initialValues: {
      explanation: "",
      score: 0,
      satisfactionLableId: undefined,
      callDeviceId: undefined,
    },
    onSubmit: async () => {},
  });
  const scoreRange = [
    {
      label: "ضعیف",
      value: 1,
      className: "text-negative border border-negative",
    },
    {
      label: "",
      value: 2,
      className: "text-negative border border-negative",
    },
    {
      label: "",
      value: 3,
      className: "text-negative border border-negative",
    },
    {
      label: "متوسط",
      value: 4,
      className: "text-info border border-info",
    },
    {
      label: "",
      value: 5,
      className: "text-info border border-info",
    },
    {
      label: "",
      value: 6,
      className: "text-info border border-info",
    },
    {
      label: "",
      value: 7,
      className: "text-info border border-info",
    },
    {
      label: "خوب",
      value: 8,
      className: "text-success-active border border-success-active",
    },
    {
      label: "",
      value: 9,
      className: "text-success-active border border-success-active",
    },
    {
      label: "",
      value: 10,
      className: "text-success-active border border-success-active",
    },
  ];
  const overviewProps: OverviewInterface = {
    list: [
      {
        label: "ثبت رضایتمندی",
        value: "1403/04/23",
        icon: (
          <Image
            src={"/icons/calendar-tick.png"}
            width={16}
            height={16}
            className="object-cover w-4 h-4"
            alt="ثبت رضایتمندی"
          />
        ),
      },
      {
        label: "پیگیری رضایتمندی",
        value: "1403/04/29",
        icon: (
          <Image
            src={"/icons/calendar-untick.png"}
            width={16}
            height={16}
            className="object-cover w-4 h-4"
            alt="پیگیری رضایتمندی"
          />
        ),
      },
    ],
  };
  // const RatingChart = dynamic(() => import("../shared/rating-chart"), {
  //   ssr: false,
  // });
  return (
    <div
      onClick={(e) => {
        e.stopPropagation(); // ✅ Stops bubbling
      }}
    >
      <div className="w-full flex gap-6">
        <div className="rounded-xl  w-full p-3 bg-card items-center justify-center flex flex-col  shadow-[0px_12px_24px_-4px_#919EAB1F]">
          {/* <RatingChart value={score} color="#FFA500" />
          <span className="text-center relative -mt-2 text-sm">
            از مجموع {totalVotes} امتیاز
          </span> */}
          <div className="w-36 h-36">
            <CircularProgressbarWithChildren
              value={score}
              styles={buildStyles({
                pathColor: "#FFA500",
                trailColor: "#E9EAEB",
              })}
            >
              <div className="text-center  text-sm flex flex-col gap-2">
                <span>میانگین امتیاز</span>
                <span className="font-bold text-info">
                  {totalVotes} / {(score * totalVotes) / 100}
                </span>
              </div>
              {/* <FaStar style={{ fontSize: "32px", color: "#00bcd4" }} /> */}
            </CircularProgressbarWithChildren>
          </div>
        </div>

        <Overview {...overviewProps} />
      </div>
      <SocialMedia
        // {...overviewProps}
        className="col-span-4 lg:col-span-3 row-span-1"
        list={callDevices}
        form={formik}
      />
      <OverviewDetailContainer
        scoreRange={scoreRange}
        className="shadow-[0px_12px_24px_-4px_#919EAB1F]"
        labels={satisfactionLabels}
        form={formik}
      />
      <div className="flex flex-row gap-4 items-center justify-end">
        <Button
          variant={"info"}
          onClick={() => {
            onCloseHandler();
            submit();
          }}
        >
          ثبت بازخورد
        </Button>
      </div>
    </div>
  );
}
