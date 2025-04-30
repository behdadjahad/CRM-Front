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


import { Button } from "../ui/button";
import { useFormik } from "formik";
import Overview, { OverviewInterface } from "../satisfaction/overview";
import dynamic from "next/dynamic";

export default function Satisfaction({
  onCloseHandler,
  itemId,
}: {
  onCloseHandler: () => any;
  itemId: string;
}) {
  const [callDevices, setCallDevices] = useState<any[]>([]);
  const [satisfactionLabels, setSatisfactionLabels] = useState<any[]>([]);

  // const { score, totalVotes, overviewProps, scoreRange } = getData();
  // const score = 30;
  // const totalVotes = 10;
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

      const callDeviceOptions = callDeviceData.data.map((item: any) => ({
        id: item.id,
        label: item.name,
        image:item.iconFile
      }));
      setCallDevices(callDeviceOptions);
    }
  }, [callDeviceData]);
  useEffect(() => {
    if (SatisfactionLabelsData) {
      const satisfactionLabelsOptions = SatisfactionLabelsData.data.map(
        (item: any) => ({
          id: item.id,
          label: item.reasonName,
          type: item.satisfactionKind,
        })
      );
      setSatisfactionLabels(satisfactionLabelsOptions);
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
      className: "",
    },
    {
      label: "",
      value: 5,
      className: "",
    },
    {
      label: "",
      value: 6,
      className: "",
    },
    {
      label: "",
      value: 7,
      className: "",
    },
    {
      label: "خوب",
      value: 8,
      className: "",
    },
    {
      label: "عالی",
      value: 9,
      className: "",
    },
    {
      label: "",
      value: 10,
      className: "",
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
    const RatingChart = dynamic(() => import("../shared/rating-chart"), {
      ssr: false,
    });
  return (
    <div>
      <div className="w-full flex gap-6">
        <div className="rounded-xl  w-full p-3 bg-card items-center justify-center flex flex-col  shadow-[0px_12px_24px_-4px_#919EAB1F]">
          <RatingChart value={30} color="#FFA500" />
          <span className="text-center relative -mt-2 text-sm">
            از مجموع {10} امتیاز
          </span>
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

// function getData() {
//   const overviewProps: OverviewInterface = {
//     list: [
//       {
//         label: "ثبت رضایتمندی",
//         value: "1403/04/23",
//         icon: (
//           <Image
//             src={"/icons/calendar-tick.png"}
//             width={16}
//             height={16}
//             className="object-cover w-4 h-4"
//             alt="ثبت رضایتمندی"
//           />
//         ),
//       },
//       {
//         label: "پیگیری رضایتمندی",
//         value: "1403/04/29",
//         icon: (
//           <Image
//             src={"/icons/calendar-untick.png"}
//             width={16}
//             height={16}
//             className="object-cover w-4 h-4"
//             alt="پیگیری رضایتمندی"
//           />
//         ),
//       },
//     ],
//   };

//   const scoreRange = [
//     {
//       label: "ضعیف",
//       value: 1,
//       className: "text-negative border border-negative",
//     },
//     {
//       label: "",
//       value: 2,
//       className: "text-negative border border-negative",
//     },
//     {
//       label: "",
//       value: 3,
//       className: "text-negative border border-negative",
//     },
//     {
//       label: "متوسط",
//       value: 4,
//       className: "",
//     },
//     {
//       label: "",
//       value: 5,
//       className: "",
//     },
//     {
//       label: "",
//       value: 6,
//       className: "",
//     },
//     {
//       label: "",
//       value: 7,
//       className: "",
//     },
//     {
//       label: "خوب",
//       value: 8,
//       className: "",
//     },
//     {
//       label: "عالی",
//       value: 9,
//       className: "",
//     },
//     {
//       label: "",
//       value: 10,
//       className: "",
//     },
//   ];

//   return {
//     score: 30,
//     totalVotes: 10,
//     overviewProps,
//     scoreRange,
//   };
// }
