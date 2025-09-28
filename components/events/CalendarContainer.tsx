import React, { useEffect, useState } from "react";

import dayjs from "dayjs";
import jalaliday from "jalaliday";
import "dayjs/locale/fa"; // Persian locale
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import moment from "moment-hijri";
import Image from "next/image";
import {
  convertDateWithTimeZone,
  convertToGregorianYMD,
  generateVisibleRange,
  generateWeekVisibleRange,
  getCalendarInfo,
  getMonthInfo,
  getTimeOfDate,
  getToday,
  getTodayInGregorianYMD,
  getWeekdayLabel,
  revertDateWithTimeZone,
} from "@/lib/calendar";
import MonthlyCalendar from "./MonthlyCalendar";
import WeeklyCalendar from "./WeeklyCalendar";
import DailyCalendar from "./DailyCalendar";

import CalendarHeader from "./CalendarHeader";

import { CalendarRangeTimeType } from "./calendar/calendar-time-filtering";

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(jalaliday);
dayjs.locale("fa"); // Set

dayjs.extend(timezone);
import jalaali from "jalaali-js";

import LeadContactTypeContainer, {
  LeadContactTypeContainerInterface,
} from "./lead/LeadContactTypeContainer";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getCalendarData } from "@/api/calendar";
import { getLaedfollowUpTypes } from "@/api/follow-up";
import { deleteEvent, getSingleEvent } from "@/api/event";
import CalendarDetailSideBar from "./CalendarDetailSidebar";


import GridDailyCalendar from "./GridDailyCalendar";
import { GridWeeklyCalendar } from "./GridWeeklyCalendar";

export interface CalendarContainerInterface {
  data: {
    title: string;
    start: string;
  }[];
  onFilter: (data: any) => void;
}
export default function CalendarContainer({
  data,
  onFilter,
}: CalendarContainerInterface) {
  console.log(data);
  const [viewDetail, setViewDetail] = useState<boolean>(false);
  const [followUpTypeList, setFollowUpTypeList] = useState<any[]>([]);
  const [activeLeadContactType, setActiveLeadContactType] = useState<{
    label: string;
    value: string;
    id?: number;
  }>(followUpTypeList?.[0]);

  const today = getTodayInGregorianYMD();
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<number>();
  const [isSingleEventData, setIsSingleEventData] = useState<boolean>(false);

  const [currentDate, setCurrentDate] = useState(today);
  const [calendarRangeType, setCalendarRangeType] =
    useState<CalendarRangeTimeType>("monthly");
  const [calendarType, setCalendarType] = useState<
    "jalali" | "hijri" | "gregory"
  >("jalali");
  const [singleDateEvents, setSingleDateEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const { calendarData } = generateCalendarData(
    calendarRangeType,
    calendarType
  );
  const { data: leadFollowUpTypeData } = useQuery({
    queryKey: ["leadFollowUpTypeData"],
    queryFn: async () => await getLaedfollowUpTypes(),
  });
  const { LeadContactTypeList } = getData();
  useEffect(() => {
    if (leadFollowUpTypeData) {
      const updatedList = LeadContactTypeList.map((item: any) => {
        const match = leadFollowUpTypeData?.data?.find(
          (d: any) => d.type === item.value
        );
        return {
          ...item,
          id: match ? match.id : null, // add id if match found
        };
      });

      setFollowUpTypeList(updatedList);
    }
  }, [leadFollowUpTypeData]);

  // Go to previous day/week/month
  const goToNext = () => {
    setCurrentDate((prevDate) => {
      // prevDate is string like "2025-08-18"
      switch (calendarRangeType) {
        case "daily":
          return dayjs(prevDate, "YYYY-MM-DD")
            .add(1, "day")
            .format("YYYY-MM-DD");

        case "weekly":
          return dayjs(prevDate, "YYYY-MM-DD")
            .add(1, "week")
            .format("YYYY-MM-DD");

        case "monthly": {
          if (calendarType === "jalali") {
            const {
              year: targetYear,
              month: targetMonth,
              day: targetday,
            } = convertDateWithTimeZone(prevDate, calendarType);
            const isLeapYear = jalaali.jalCal(targetYear).leap === 0;
            const nextTarget =
              targetMonth === 12
                ? { year: targetYear + 1, month: 1, day: targetday }
                : {
                    year: targetYear,
                    month: targetMonth + 1,
                    day:
                      targetMonth === 11 && !isLeapYear && targetday === 30
                        ? targetday - 1
                        : targetday,
                  };
            const nextTargetDate = revertDateWithTimeZone(
              nextTarget,
              calendarType
            );
            return nextTargetDate;

            // const d = dayjs(prevDate, "YYYY-MM-DD").calendar("jalali");
            // const dayOfMonth = d.date();

            // // anchor on prevDate instead of dayjs()
            // const target = d.clone().add(1, "month").date(1);

            // const lastDay = target.daysInMonth();
            // console.log(lastDay);

            // console.log(targetYear, targetMonth, targetday);
            // console.log(dayOfMonth);
            // const isLeapYear =
            //   jalaali.jalCal(targetYear).leap === 0 || targetMonth === 12;
            // console.log(isLeapYear);
            // console.log(isLeapYear);
            // return target
            //   .date(
            //     Math.min(
            //       isLeapYear ? dayOfMonth + 1 : dayOfMonth,
            //       isLeapYear ? lastDay + 1 : lastDay
            //     )
            //   )
            //   .calendar("gregory")
            //   .format("YYYY-MM-DD");
          }

          if (calendarType === "hijri") {
            const m = moment(prevDate, "YYYY-MM-DD");
            const dayOfMonth = m.iDate();

            // also anchor on prevDate
            const target = m.clone().add(1, "iMonth").iDate(1);
            const lastDay = target.clone().endOf("iMonth").iDate();

            return target
              .iDate(Math.min(dayOfMonth, lastDay))
              .format("YYYY-MM-DD");
          }

          // Gregorian
          return dayjs(prevDate, "YYYY-MM-DD")
            .add(1, "month")
            .format("YYYY-MM-DD");
        }
        default:
          return prevDate;
      }
    });
  };
  // const goToNext = () => {
  //   setCurrentDate((prevDate) => {

  //     switch (calendarRangeType) {
  //       case "daily":
  //         return dayjs(prevDate).add(1, "day").toDate();
  //       case "weekly":
  //         return dayjs(prevDate).add(1, "week").toDate();
  //       case "monthly": {
  //         const { year, month } = getMonthInfo(prevDate, calendarType);

  //         if (calendarType === "jalali") {
  //           const d = dayjs(prevDate).calendar("jalali");
  //           const dayOfMonth = d.date();
  //           const target = dayjs()
  //             .calendar("jalali")
  //             .year(year)
  //             .month(month + 1)
  //             .date(1);
  //           const lastDay = target.daysInMonth();
  //           return target
  //             .date(Math.min(dayOfMonth, lastDay))
  //             .calendar("gregory")
  //             .toDate();
  //         }

  //         if (calendarType === "hijri") {
  //           const m = moment(prevDate);
  //           const dayOfMonth = m.iDate();
  //           const target = moment()
  //             .iYear(year)
  //             .iMonth(month + 1)
  //             .iDate(1);
  //           const lastDay = target.endOf("iMonth").iDate();
  //           return target.iDate(Math.min(dayOfMonth, lastDay)).toDate();
  //         }

  //         // Gregorian
  //         return dayjs(prevDate).add(1, "month").toDate();
  //       }
  //       default:
  //         return prevDate;
  //     }
  //   });
  // };
console.log(calendarRangeType)
  const goToPrev = () => {
    setCurrentDate((prevDateStr) => {
      const FMT = "YYYY-MM-DD";

      switch (calendarRangeType) {
        case "daily":
          return dayjs(prevDateStr, FMT).subtract(1, "day").format(FMT);

        case "weekly":
          return dayjs(prevDateStr, FMT).subtract(1, "week").format(FMT);

        case "monthly": {
          // --- Jalali ---
          // if (calendarType === "jalali") {
          //   const dJ = dayjs(prevDateStr, FMT).calendar("jalali");
          //   const dayOfMonth = dJ.date();

          //   // anchor to prevDate (NOT dayjs())
          //   const targetJ = dJ
          //     .calendar("jalali")
          //     .date(1) // go to first of current Jalali month
          //     .month(dJ.month() - 1); // previous Jalali month

          //   const lastDay = targetJ.daysInMonth();

          //   return targetJ
          //     .date(Math.min(dayOfMonth, lastDay))
          //     .calendar("gregory")
          //     .format(FMT);
          // }
          if (calendarType === "jalali") {
            const {
              year: targetYear,
              month: targetMonth,
              day: targetday,
            } = convertDateWithTimeZone(prevDateStr, calendarType);
            const isLeapYear = jalaali.jalCal(targetYear - 1).leap === 0;
            const prevTarget =
              targetMonth === 1
                ? {
                    year: targetYear - 1,
                    month: 12,
                    day:
                      !isLeapYear && targetday === 30
                        ? targetday - 1
                        : targetday,
                  }
                : { year: targetYear, month: targetMonth - 1, day: targetday };
            const prevTargetDate = revertDateWithTimeZone(
              prevTarget,
              calendarType
            );
            return prevTargetDate;
            // const dJ = dayjs(prevDateStr, FMT).calendar("jalali");
            // console.log(dJ);
            // const dayOfMonth = dJ.date();
            // console.log(dayOfMonth);
            // const targetJ = dJ
            //   .calendar("jalali")
            //   .date(1) // go to first of current Jalali month
            //   .subtract(1, "month"); // safe way to go to previous Jalali month

            // const lastDay = targetJ.daysInMonth();
            // //check if the jalali year is leap year
            // const {
            //   year: targetYear,
            //   month: targetMonth,
            //   day: targetday,
            // } = convertDateWithTimeZone(prevDateStr, calendarType);

            // const isLeapYear =
            //   jalaali.jalCal(targetYear - 1).leap === 0 && targetMonth === 1;

            // return targetJ
            //   .date(
            //     Math.min(
            //       isLeapYear ? dayOfMonth - 1 : dayOfMonth,
            //       isLeapYear ? lastDay + 1 : lastDay
            //     )
            //   )
            //   .calendar("gregory")
            //   .format(FMT);
          }
          // --- Hijri ---
          if (calendarType === "hijri") {
            const m = moment(prevDateStr, FMT);
            const dayOfMonth = m.iDate();

            // anchor to prevDate (NOT moment())
            const target = m.clone().iDate(1).subtract(1, "iMonth");
            const lastDay = target.clone().endOf("iMonth").iDate();

            return target.iDate(Math.min(dayOfMonth, lastDay)).format(FMT);
          }

          // --- Gregorian ---
          return dayjs(prevDateStr, FMT).subtract(1, "month").format(FMT);
        }

        default:
          return prevDateStr;
      }
    });
  };

  // const goToPrev = () => {
  //   setCurrentDate((prevDate) => {
  //     switch (calendarRangeType) {
  //       case "daily":
  //         return dayjs(prevDate).subtract(1, "day").toDate();
  //       case "weekly":
  //         return dayjs(prevDate).subtract(1, "week").toDate();
  //       case "monthly": {
  //         const { year, month } = getMonthInfo(prevDate, calendarType);

  //         if (calendarType === "jalali") {
  //           const d = dayjs(prevDate).calendar("jalali");
  //           const dayOfMonth = d.date();
  //           const target = dayjs()
  //             .calendar("jalali")
  //             .year(year)
  //             .month(month - 1)
  //             .date(1);
  //           const lastDay = target.daysInMonth();
  //           return target
  //             .date(Math.min(dayOfMonth, lastDay))
  //             .calendar("gregory")
  //             .toDate();
  //         }

  //         if (calendarType === "hijri") {
  //           const m = moment(prevDate);
  //           const dayOfMonth = m.iDate();
  //           const target = moment()
  //             .iYear(year)
  //             .iMonth(month - 1)
  //             .iDate(1);
  //           const lastDay = target.endOf("iMonth").iDate();
  //           return target.iDate(Math.min(dayOfMonth, lastDay)).toDate();
  //         }

  //         // Gregorian
  //         return dayjs(prevDate).subtract(1, "month").toDate();
  //       }
  //       default:
  //         return prevDate;
  //     }
  //   });
  // };

  const goToToday = () => {
    setCurrentDate(today);
  };
  const { mutate: getCalendarFilteredData } = useMutation({
    mutationFn: (data: any) => {
      return getCalendarData(data);
    },
    onSuccess: (data) => {
      if (data && data?.data) {
        const eventsOptions = data?.data?.map((item: any) => ({
          title: item?.subject,
          start: item?.occurenceDate,
        }));
        setFilteredEvents(eventsOptions);
      }
    },
  });
  const { mutate: getSingleDateHandler } = useMutation({
    mutationFn: (data: any) => {
      return getCalendarData(data);
    },
    onSuccess: (data) => {
      if (data && data?.data) {
        const eventsOptions = data?.data?.map((item: any) => ({
          title: item?.subject,
          start: item?.occurenceDate,
        }));
        setSingleDateEvents(eventsOptions);
      }
    },
  });

  const { mutate: getSingleEventHandler } = useMutation({
    mutationFn: (id: number) => {
      return getSingleEvent(id);
    },
    onSuccess: (data) => {
      if (data && data?.data) {
        const eventsOptions = [
          {
            id: data?.data?.id,
            title: data?.data?.subject,
            start: data?.data?.eventAt,
          },
        ];

        setSingleDateEvents(eventsOptions);
      }
    },
  });
  const { mutate: deleteEventHandler } = useMutation({
    mutationFn: (id: number) => {
      return deleteEvent(id);
    },
    onSuccess: (data) => {},
  });

  function getDateDataHandler(date: string) {
    const data = {
      startDateRange: date + "T00:00:00Z",
      endDateRange: date + "T23:59:59Z",
    };
    getSingleDateHandler(data);
  }

  function getFollowupTypeEvents(id?: number) {
    const data = {
      followUpTypeId: id,
    };

    getCalendarFilteredData(data);
  }
  // const calendarDetailData = {
  //   title: "تاریخچه رویدادها",
  //   actions: (
  //     <>
  //       <Button
  //         className="border-none p-0 text-[#212B36]"
  //         onClick={() => {
  //           setViewEditForm(true);
  //         }}
  //       >
  //         <Image
  //           src="/icons/edit-primary.png"
  //           alt=""
  //           width={1024}
  //           height={1024}
  //           className="w-4 h-4"
  //           onClick={() => {}}
  //         />
  //       </Button>

  //       <DeleteConfirmation onDelete={() => {}} />
  //     </>
  //   ),

  //   // list: singleDateEvents,
  //   list: singleDateEvents.map((item) => {
  //     const date = convertDateWithTimeZone(item.start, calendarType); // pass event date to your util
  //     const weekLabel = getWeekdayLabel(new Date(item?.start), calendarType);
  //     return {
  //       time: getTimeOfDate(item.start), // e.g., "10:30 AM"
  //       weekLabel: weekLabel, // e.g., "Mon"
  //       title: item?.title || "",
  //       monthName: date.monthName, // e.g., "Aug"
  //       day: date.day,
  //       timeLabel: "ساعت",
  //       // e.g., "26"
  //     };
  //   }),
  // };
  function returnDetailEventData(eventData: any) {
    console.log(eventData);
    const eventOptions = eventData?.map((event: any) => ({
      id: event?.id,
      title: event?.title,
      start: event?.start,
    }));
    setSingleDateEvents(eventOptions);
  }
  return (
    <div className="bg-card border border-[#DEEBFB] rounded-xl custom-shadow p-6 w-full">
      <div className="border border-[#E9EAEB] rounded-lg flex flex-col  w-full">
        <CalendarHeader
          onActiveCalendarType={(value) => setCalendarType(value)}
          calendarType={calendarType}
          {...calendarData}
          onPrev={goToPrev}
          onNext={goToNext}
          onToday={goToToday}
          onActiveTime={(value) => setCalendarRangeType(value)}
          calendarRangeType={calendarRangeType}
        />
        <div className="bg-[#FCFCFD] p-3">
          <LeadContactTypeContainer
            list={followUpTypeList}
            onActiveItem={(label: string, value: string, id?: number) => {
              setActiveLeadContactType({ label, value, id });
              onFilter({ followUpTypeId: id });
              getFollowupTypeEvents(id);
            }}
            activeItem={activeLeadContactType}
          />
        </div>

        <div className={`w-full ${viewDetail ? "grid grid-cols-4" : ""}`}>
          <div className="col-span-3">
            {calendarRangeType === "monthly" ? (
              <MonthlyCalendar
                currentDate={currentDate}
                visibleRange={calendarData.visibleRange}
                calendarType={calendarType}
                events={data}
                onSelectDate={(date: string) => {
                  getDateDataHandler(date);
                  setSelectedDate(date);
                  setCurrentDate(date);
                  setViewDetail(true);
                  setIsSingleEventData(false);
                }}
                onSelectEvent={(id: number) => {
                  setSelectedEvent(id);
                  getSingleEventHandler(id);
                  setViewDetail(true);
                  setIsSingleEventData(true);
                }}
              />
            ) : calendarRangeType === "weekly" ? (
              // <WeeklyCalendar
              //   currentDate={currentDate}
              //   visibleRange={calendarData.visibleRange}
              //   calendarType={calendarType}
              //   events={data}
              //   onSelectDate={(date: string) => {
              //     getDateDataHandler(date);
              //     setSelectedDate(date);
              //     setCurrentDate(date);
              //     setViewDetail(true);
              //     setIsSingleEventData(false);
              //   }}
              //   onSelectEvent={(id: number) => {
              //     setSelectedEvent(id);
              //     getSingleEventHandler(id);
              //     setViewDetail(true);
              //     setIsSingleEventData(true);
              //   }}
              // />
              <GridWeeklyCalendar
                events={data}
                followUpTypeList={followUpTypeList}
                visibleRange={calendarData.visibleRange}
                calendarType={calendarType}
                currentDate={currentDate}
                onGetDayData={(eventData: any) => {
                  setViewDetail(true);
                  setIsSingleEventData(false);
                  returnDetailEventData(eventData);
                }}
                onGetFollowUpTypeData={(eventData: any) => {
                  setViewDetail(true);
                  setIsSingleEventData(false);
                  returnDetailEventData(eventData);
                  console.log(eventData, 593);
                }}
              />
            ) : calendarRangeType === "daily" ? (
              // <DailyCalendar
              //   currentDate={currentDate}
              //   events={data}
              //   onSelectEvent={(id: number) => {
              //     setSelectedEvent(id);
              //     getSingleEventHandler(id);
              //     setViewDetail(true);
              //     setIsSingleEventData(true);
              //   }}
              //     />
              <GridDailyCalendar
                currentDate={currentDate}
                events={data}
                followUpTypeList={followUpTypeList}
                onGetFollowUpTypeData={(eventData: any) => {
                  setViewDetail(true);
                  setIsSingleEventData(false);
                  returnDetailEventData(eventData);
                  console.log(eventData, 593);
                }}
                onGetHourData={(eventData: any) => {
                  setViewDetail(true);
                  setIsSingleEventData(false);
                  returnDetailEventData(eventData);
                }}
              />
            ) : (
              <></>
            )}
          </div>
          {viewDetail && (
            <div className="col-span-1 bg-card p-6">
              {/* <EventDetailContainer
                eventList={singleDateEvents}
                calendarType={calendarType}
                multiEvent={multiEvent}
                onDeleteHandler={(id) => {
                  deleteEventHandler(id);
                }}
              /> */}
              <CalendarDetailSideBar
                eventList={singleDateEvents}
                calendarType={calendarType}
                isSingleEventData={isSingleEventData}
                onDeleteEvent={(id) => {
                  deleteEventHandler(id);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function generateCalendarData(
    calendarRangeType: string,
    calendarType: "jalali" | "hijri" | "gregory"
  ) {
    let calendarData;
    const date = convertDateWithTimeZone(currentDate, calendarType);

    switch (calendarRangeType) {
      case "monthly":
        const calendarInfo = getCalendarInfo(currentDate, calendarType);

        calendarData = {
          date: date,
          visibleRange: generateVisibleRange(currentDate, calendarType),
          selectedDaysRange: [
            {
              // day: date.day,
              monthName: date.monthName,
              year: date.year,
            },
          ],

          fullRange: [
            {
              day: calendarInfo.startDay,
              monthName: calendarInfo.monthName,
              year: calendarInfo.year,
            },
            {
              day: calendarInfo.endDay,
              monthName: calendarInfo.monthName,
              year: calendarInfo.year,
            },
          ],
        };
        return { calendarData };
      case "weekly":
        const weeklyVisibleRange = generateWeekVisibleRange(
          currentDate,
          calendarType
        );

        const selectedDateRange = {
          start: convertDateWithTimeZone(
            convertToGregorianYMD(weeklyVisibleRange.start),
            calendarType
          ),
          end: convertDateWithTimeZone(
            convertToGregorianYMD(weeklyVisibleRange.end),
            calendarType
          ),
        };

        calendarData = {
          date: date,
          visibleRange: weeklyVisibleRange,
          selectedDaysRange: [
            {
              day: selectedDateRange.start.day,
              monthName: selectedDateRange.start.monthName,
              year: selectedDateRange.start.year,
            },
            {
              day: selectedDateRange.end.day,
              monthName: selectedDateRange.end.monthName,
              year: selectedDateRange.end.year,
            },
          ],

          fullRange: [
            {
              day: selectedDateRange.start.day,
              monthName: selectedDateRange.start.monthName,
              year: selectedDateRange.start.year,
            },
            {
              day: selectedDateRange.end.day,
              monthName: selectedDateRange.end.monthName,
              year: selectedDateRange.end.year,
            },
          ],
        };
        return { calendarData };

      case "daily":
        calendarData = {
          date: date,
          selectedDaysRange: [
            {
              day: date.day,
              monthName: date.monthName,
              year: date.year,
            },
          ],
          visibleRange: {
            start: new Date(currentDate),
            end: new Date(currentDate),
          },

          fullRange: [
            {
              day: date.day,
              monthName: date.monthName,
              year: date.year,
            },
          ],
        };
        return { calendarData };
      default:
        calendarData = {
          date: date,
          visibleRange: generateVisibleRange(currentDate, calendarType),
          selectedDaysRange: [
            {
              day: date.day,
              monthName: date.monthName,
              year: date.year,
            },
          ],
          fullRange: [
            {
              day: date.day,
              monthName: date.monthName,
              year: date.year,
            },
          ],
        };
        return { calendarData };
    }
  }
  function getData() {
    const LeadContactTypeList: LeadContactTypeContainerInterface["list"] = [
      {
        label: "همه",
        value: "All",
        icon: "",
        activeClassName: "",
        className: "border-l rounded-none",
      },
      {
        label: "تماس",
        value: "CALL",
        icon: "/icons/colored-phone-icon.png",
        activeClassName: "border border-[#EF26B2]",
        className: "text-[#C11574] bg-[#FDF2FA]",
        orderClassName:
          "flex items-center justify-center w-4 h-4 rounded-full bg-[#C11574] bg-opacity-20",
      },
      {
        label: "پیامک",
        value: "SMS",
        icon: "/icons/colored-sms-icon.png",
        activeClassName: "border border-[#039855]",
        className: "text-[#087443] bg-[#EDFCF2]",
        orderClassName:
          "flex w-4 h-4 items-center justify-center rounded-full rounded-full bg-[#087443] bg-opacity-20",
      },
      {
        label: "ایمیل",
        value: "EMAIL",
        icon: "/icons/colored-email-icon.png",
        activeClassName: "border border-[#1C68DA]",
        className: "text-[#175CD3] bg-[#EFF8FF]",
        orderClassName:
          "flex w-4 h-4 items-center justify-center rounded-full bg-[#175CD3] bg-opacity-20",
      },
      {
        label: "جلسه",
        value: "MEET",
        icon: "/icons/colored-meeting-icon.png",
        activeClassName: "border border-[#7500FE]",
        className: "text-[#6941C6] bg-[#F9F5FF]",
        orderClassName:
          "flex items-center justify-center w-4 h-4 rounded-full bg-[#6941C6] bg-opacity-20",
      },
      {
        label: "VOIP",
        value: "VOIP",
        icon: "/icons/colored-voip-icon.png",
        activeClassName: "border border-[#D92D20]",
        className: "text-[#B93815] bg-[#FEF6EE]",
        orderClassName:
          "flex items-center justify-center w-4 h-4 rounded-full bg-[#B93815] bg-opacity-20",
      },
    ];

    return { LeadContactTypeList };
  }
}
