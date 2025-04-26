"use client";

import Overview, { OverviewInterface } from "../satisfaction/overview";
import OverviewDetailContainer, {
  OverviewDetailInterface,
} from "../satisfaction/overview-detail-container";
import SocialMedia from "../satisfaction/social-media";
import RatingChart from "../shared/rating-chart";
import Image from "next/image";
export default function Satisfaction({}: {}) {
  const { score, totalVotes, overviewProps, overviewDetail } = getData();

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
      />
      <OverviewDetailContainer
        {...overviewDetail}
        className="shadow-[0px_12px_24px_-4px_#919EAB1F]"
      />
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
    list: [
      {
        label: "رضایت دارم",
        isPositive: true,
        detailList: [
          { title: "رفتار محترمانه" },
          { title: "پیگیری کامل" },
          { title: "قیمت مناسب" },
          { title: "رضایت" },
        ],
      },
      {
        label: "رضایت ندارم",
        isPositive: false,
        detailList: [
          { title: "رفتار نامحترمانه" },
          { title: "پیگیری ناقص" },
          { title: "قیمت نامناسب" },
          { title: "ناراضی" },
        ],
      },
    ],
    scoreRange:[
        {
            label:"ضعیف",
            value:1
        },
        {
            label:"",
            value:2
        },
        {
            label:"",
            value:3
        },
        {
            label:"متوسط",
            value:4
        },
        {
            label:"",
            value:5
        },
        {
            label:"",
            value:6
        },
        {
            label:"خوب",
            value:7
        },
        {
            label:"",
            value:8
        },
        {
            label:"عالی",
            value:9
        },
        {
            label:"",
            value:10
        },

    ]
  };

  return {
    score: 30,
    totalVotes: 10,
    overviewProps,
    overviewDetail,
  };
}
