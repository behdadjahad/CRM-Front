"use client";

import { useFormik } from "formik";
import FilterContainer from "../section/filter-container";
import FormMaker from "../shared/form-maker";
import { headerProps } from "../shared/notification-drawer";
import { NotificationList } from "../shared/notification-list";
import { NotificationCardInterface } from "./notification-card";
import NotificationHeader from "./notification-header";
import { useEffect, useState } from "react";

import { limitForNotifications, notificationStatus } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllNotifications } from "@/store/notification-slice";
import NotificationTabList from "./notification-tab-list";

const notificationList: NotificationCardInterface[] = [
  {
    id: 1,
    heading: "ویژگی جدید اضافه شد",
    user: {
      name: "",
      image: "",
      isOnline: false,
    },
    content:
      "خوشحالیم که نسخه به‌روزشده و بهتر تجربه ساخت قالب رو به شما معرفی کنیم.",
    button: {
      className: "",
      title: "الان امتحان کن",
      variant: "info",
    },
    icon: "",
    review: "",
    time: "2 دقیقه پیش",
    className: "",
    hasResponse: true,
  },
  {
    id: 2,
    heading: "",
    user: {
      name: "",
      image: "",
      isOnline: true,
    },
    content: "قرارداد جدید از شرکت سیمرغ پرواز ثبت شد و در حال بررسی است.",
    button: {
      className: "",
      title: "الان امتحان کن",
      variant: "info",
    },
    icon: "",
    review: "",
    time: "9 اردیبهشت",
    className: "",
    hasResponse: false,
  },
];

export default function NotificationContainer() {
  const dispatch = useDispatch<any>();
  const [activeTab, setActiveTab] = useState(notificationStatus.all);
  useEffect(() => {
    const filters =
      activeTab === notificationStatus.all ? {} : { status: activeTab };
    dispatch(
      fetchAllNotifications({ page: 1, limit: limitForNotifications, filters })
    );
  }, [activeTab]);

  const notifications = useSelector((state: any) => state.notification.items);
  const notificationSearchFormik = useFormik({
    initialValues: {
      notificationKeyWord: "",
    },
    onSubmit: async () => {},
  });
  const tabList = useSelector((state: any) => state.notification.tabList);
  return (
    <div className="w-full flex flex-col gap-2 bg-card rounded-md">
      <div className="w-full flex flex-row px-2 py-4 justify-between">
        {" "}
        <FilterContainer
          onFilterHandler={() => {}}
          rangeItems={[]}
          filterItems={[]}
          sortList={[]}
          onSortHandler={(item: string) => {
            console.log(item);
          }}
          onCancleHandler={() => {}}
        />
        {/*  */}
        <div>
          <FormMaker
            form={notificationSearchFormik}
            fields={[
              {
                key: "notificationKeyWord",
                component: "input",
                placeholder: "جستجو",
                icon: "/icons/search-icon.png",
                iconClassName: "w-4 h-4 right-3 top-3",
                labelClassName: "h-8 p-0",
                type: "text",
                className: "border rounded-md p-0 w-56",
              },
            ]}
          />
        </div>
      </div>
      <div className="rounded-lg shadow">
        <NotificationHeader {...headerProps} />
        <NotificationTabList tabList={tabList} onChangeTab={setActiveTab} activeTab={activeTab} />
        <NotificationList list={notifications} />
      </div>
    </div>
  );
}
