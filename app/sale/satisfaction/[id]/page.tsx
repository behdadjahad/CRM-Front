import Overview, {
  OverviewInterface,
} from "@/components/satisfaction/overview";
import OverviewDetailContainer, { OverviewDetailInterface } from "@/components/satisfaction/overview-detail-container";
import Breadcrumb from "@/components/shared/breadcrumb";
import RatingChart from "@/components/shared/rating-chart";
import Title from "@/components/shared/title";
import Image from "next/image";

export default function Satisfaction() {
  const { score, totalVotes, overviewProps, overviewDetail } = getData();

  return (
    <main className="px-0">
      <div className="px-8">
        <Title label="رضایت مندی" />

        <Breadcrumb
          list={[
            {
              label: "داشبورد",
              link: "/",
            },
            {
              label: "گزارش فروش",
              link: "/sale",
            },
            {
              label: "رضایت مندی",
            },
          ]}
        />
      </div>

      <div className="p-6 grid grid-cols-4 grid-rows-2 gap-6">
        <div className="rounded-xl col-span-4 lg:col-span-1 p-6 bg-background-active items-center justify-center flex flex-col row-span-2 shadow-[0px_12px_24px_-4px_#919EAB1F]">
          <RatingChart value={score} color="#FFA500" height={200} />
          <span className="text-center relative -mt-2 text-sm">
            از مجموع {totalVotes} امتیاز
          </span>
        </div>

        <div className="rounded-xl col-span-4 lg:col-span-3 row-span-1 p-6 bg-background-active items-center justify-center flex flex-col shadow-[0px_12px_24px_-4px_#919EAB1F]">
          <Overview {...overviewProps} className="w-full" />
        </div>

        <div className="rounded-xl col-span-4 lg:col-span-3 row-span-1 p-6 bg-background-active items-center justify-center flex flex-col shadow-[0px_12px_24px_-4px_#919EAB1F]">
          <Overview {...overviewProps} className="w-full" />
        </div>
      </div>

      <div className="shadow-[0px_12px_24px_-4px_#919EAB1F] p-6">
        <OverviewDetailContainer {...overviewDetail} className="" />
      </div>

    </main>
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
        activeLabelClassName: "text-success-active",
        action: {
          icon: "/icons/like.png",
          activeIcon: "/icons/like.png"
        },
        detailList: [{ title: "رفتارمحترمانه" }, { title: "پیگیری کامل" }, { title: 'قیمت مناسب' }],
      },
      {
        label: "رضایت ندارم",
        activeLabelClassName: "text-negative",
        action: {
          icon: "/icons/dislike.png",
          activeIcon: "/icons/dislike.png"
        },
        detailList: [{ title: "رفتارنامحترمانه" }, { title: "پیگیری ناقص" }, { title: 'قیمت نامناسب' }],
      },
    ]
  }

  return {
    score: 30,
    totalVotes: 10,
    overviewProps,
    overviewDetail
  };
}
