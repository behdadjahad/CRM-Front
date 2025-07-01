"use client";

import { useFormik } from "formik";
import FilterContainer from "../section/filter-container";
import FormMaker from "../shared/form-maker";
import { headerProps } from "../shared/notification-drawer";
import { NotificationList } from "../shared/notification-list";

import NotificationHeader from "./notification-header";
import { useEffect, useState } from "react";

import { limitForDrawerNotifications, limitForNotifications, notificationStatus } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllNotifications, fetchDrawerNotifications } from "@/store/notification-slice";
import NotificationTabList from "./notification-tab-list";
import ReactPaginate from "react-paginate";
import { readAllNotification } from "@/api/notification";
import { useMutation } from "@tanstack/react-query";

export default function NotificationContainer() {
  const dispatch = useDispatch<any>();
  const filters = useSelector((state: any) => state.notification.filters);
  const [activeTab, setActiveTab] = useState(notificationStatus.all);
  useEffect(() => {
    const filter =
      activeTab === notificationStatus.all ? {} : { status: activeTab };
    dispatch(
      fetchAllNotifications({
        page: 1,
        limit: limitForNotifications,
        filters: { ...filters, filter },
      })
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
  const pages = useSelector((state: any) => state.notification.totalPages);

  const limit = useSelector((state: any) => state.notification.limit);
  const currentPage = useSelector(
    (state: any) => state.notification.currentPage
  );
  const handlePageChange = (selectedItem: any) => {
    const selectedPage = selectedItem.selected + 1;
    dispatch(
      fetchAllNotifications({
        page: selectedPage,
        limit: limit,
        filters: filters,
      })
    );
  };
  const { mutate: readNotifications } = useMutation({
    mutationFn: () => {
      return readAllNotification();
    },
    onSuccess: (result) => {
      dispatch(
        fetchAllNotifications({
          page: currentPage,
          limit: limit,
          filters: filters,
        })
      );
      fetchDrawerNotifications({
        page: 1,
        limit: limitForDrawerNotifications,
        filters: filters,
      });
    },
  });
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
        <NotificationHeader
          {...headerProps}
          onReadHandler={readNotifications}
        />
        <NotificationTabList
          tabList={tabList}
          onChangeTab={setActiveTab}
          activeTab={activeTab}
        />
        <NotificationList list={notifications} />
      </div>
      <div className="w-full mt-4 py-6">
        <ReactPaginate
          breakLabel="..."
          nextLabel="صفحه بعد"
          previousLabel="صفحه قبل"
          onPageChange={handlePageChange}
          pageRangeDisplayed={2}
          marginPagesDisplayed={3}
          forcePage={currentPage - 1}
          pageCount={pages}
          renderOnZeroPageCount={null}
          containerClassName="w-full relative flex justify-center items-center ltr"
          pageClassName="mx-3 rounded-md"
          pageLinkClassName="rounded-md text-sm hover:bg-gray-100  w-10 h-10 flex items-center justify-center"
          activeClassName="bg-gray-100 rounded-md"
          previousClassName="absolute right-8"
          previousLinkClassName="rounded-md text-sm"
          nextClassName="absolute left-8"
          nextLinkClassName="rounded-md text-sm"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      </div>
    </div>
  );
}
