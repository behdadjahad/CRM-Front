"use client";

import { useEffect, useState } from "react";
import Overview, { OverviewInterface } from "../satisfaction/overview";
import OverviewDetailContainer, {
  OverviewDetailInterface,
} from "../satisfaction/overview-detail-container";
import SocialMedia from "../satisfaction/social-media";
import RatingChart from "../shared/rating-chart";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCallDevices,
  getSatisfactionLabels,
  submitSatisfaction,
} from "@/api/satisfaction";
import { Button } from "../ui/button";
export default function Satisfaction({
  onCloseHandler,
  itemId
}: {
    onCloseHandler: () => any;
    itemId: string;
  
}) {
  const [callDevices, setCallDevices] = useState<any[]>([]);
  const [satisfactionLabels, setSatisfactionLabels] = useState<any[]>([]);
  const [activeCallDevice, setActiveCallDevice] = useState<number>();
  const [activeSatisfactionLabels, setActiveSatisfactionLabels] = useState<
    any[]
  >([]);
  const { score, totalVotes, overviewProps, overviewDetail } = getData();
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
      console.log(callDeviceData);
      const callDeviceOptions = callDeviceData.data.map((item: any) => ({
        id: item.id,
        label: item.name,
      }));
      setCallDevices(callDeviceOptions);
    }
  }, [callDeviceData]);
  useEffect(() => {
    if (SatisfactionLabelsData) {
      console.log(SatisfactionLabelsData);
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
      // satisfactionReasonId: activeSatisfactionLabels,
      satisfactionReasonId: 301,
      callDeviceId: activeCallDevice,
      satisfactionScore:5
    };
  
    satisfactionSubmitHandler({ data, id:Number(itemId)  });
  }
  return (
    <div>
      <div className="w-full flex gap-6">
        <div className="rounded-xl  w-full p-3 bg-card items-center justify-center flex flex-col  shadow-[0px_12px_24px_-4px_#919EAB1F]">
          <RatingChart value={score} color="#FFA500" />
          <span className="text-center relative -mt-2 text-sm">
            از مجموع {totalVotes} امتیاز
          </span>
        </div>

        <Overview {...overviewProps} />
      </div>
      <SocialMedia
        {...overviewProps}
        className="col-span-4 lg:col-span-3 row-span-1"
        list={callDevices}
        onSendHandler={(item) => {
          setActiveCallDevice(item);
        }}
      />
      <OverviewDetailContainer
        {...overviewDetail}
        className="shadow-[0px_12px_24px_-4px_#919EAB1F]"
        labels={satisfactionLabels}
        onSelectedHandler={(activeItem) => {
          setActiveSatisfactionLabels(activeItem);
        }}
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

function getData() {
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

  const overviewDetail: OverviewDetailInterface = {
   

    scoreRange: [
      {
        label: "ضعیف",
        value: 1,
      },
      {
        label: "",
        value: 2,
      },
      {
        label: "",
        value: 3,
      },
      {
        label: "متوسط",
        value: 4,
      },
      {
        label: "",
        value: 5,
      },
      {
        label: "",
        value: 6,
      },
      {
        label: "خوب",
        value: 7,
      },
      {
        label: "",
        value: 8,
      },
      {
        label: "عالی",
        value: 9,
      },
      {
        label: "",
        value: 10,
      },
    ],
  };

  return {
    score: 30,
    totalVotes: 10,
    overviewProps,
    overviewDetail,
  };
}
