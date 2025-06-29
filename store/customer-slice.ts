import { fetchService } from "@/boot/fetch-service";
import { convertDate } from "@/lib/date";
import {
  dateType,
  formatPrice,
  limitForCustomers,
  totalVotes,
} from "@/lib/utils";
import { Communicater } from "@/types/globals";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export interface CustomerState {
  items: any[];
  currentPage: number;
  totalPages: number;
  filters: any;
  checkedItems: any[];
  total: number;
  allItems: any[];
  dateTimeRange: {
    start: string;
    end: string;
  };
}

const initialState: CustomerState = {
  items: [],
  currentPage: 1,
  totalPages: 0,
  filters: {},
  checkedItems: [],
  total: 0,
  allItems: [],
  dateTimeRange: {
    start: "",
    end: "",
  },
};

const customerSlice = createSlice({
  name: "customer",
  initialState: initialState,
  reducers: {
    setCheckedItems(state, action) {
      state.checkedItems = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllCustomers.fulfilled, (state, action) => {
      state.allItems = action?.payload?.data?.map(
        (item: any, index: number) => ({
          id: item?.id,
          ردیف: index + 1,
          "نام ونام خانوادگی":
            item?.person?.firstName + " " + item?.person?.lastName,
          کدملی: item?.person?.idNumber,
          ایمیل: item?.Communication?.email?.find(
            (item: any) => item?.communicater === Communicater.home
          )?.communicationDetails,
          "شماره تماس": item?.Communication?.mobile?.[0]?.communicationDetails,
          شغل: item?.person?.personJobs?.[0]?.jobs?.name,
          "موضوع قرارداد": item?.lastContract?.contractType,
          "رتبه مشتری": item?.rank,
          قرارداد: convertDate(item?.lastContract?.submitDate, dateType),
          "مبلغ آخرین قرارداد": `${
            item?.lastContract?.price && formatPrice(item?.lastContract?.price)
          }`,
          [item?.profit < 0 ? "ضرر و زیان" : "سود"]: formatPrice(
            Math.abs(item?.profit)
          ),
          "تعداد مشتری": item?.totalPeopleInContracts,
          "تاریخ آخرین پیگیری": "",
          "نوع آخرین پیگیری": "",
          "وضعیت آخرین پیگیری": "",
          "پیگیری بعدی": "",
          "امتیاز مشتری": item?.avgSatisfactionScore / totalVotes,
        })
      );
    });
    builder.addCase(fetchCustomers.fulfilled, (state, action) => {
      state.items = action?.payload?.data?.map((item: any, index: number) => ({
        id: item?.id,
        info: {
          "نام ونام خانوادگی":
            item?.person?.firstName + " " + item?.person?.lastName,
          کدملی: item?.person?.idNumber,
          ایمیل: item?.Communication?.email?.find(
            (item: any) => item?.communicater === Communicater.home
          )?.communicationDetails,
          "شماره تماس": item?.Communication?.mobile?.[0]?.communicationDetails,
          شغل: item?.person?.personJobs?.[0]?.jobs?.name,
          "موضوع قرارداد": item?.lastContract?.contractType,
          "رتبه مشتری": item?.rank,
          قرارداد: convertDate(item?.lastContract?.submitDate, dateType),
          "مبلغ آخرین قرارداد": `${
            item?.lastContract?.price && formatPrice(item?.lastContract?.price)
          }`,
        },
        subInfo: {
          [item?.profit < 0 ? "ضرر و زیان" : "سود"]: formatPrice(
            Math.abs(item?.profit)
          ),
          "تعداد مشتری": item?.totalPeopleInContracts,
          "تاریخ آخرین پیگیری": "",
          "نوع آخرین پیگیری": "",
          "وضعیت آخرین پیگیری": "",
          "پیگیری بعدی": "",
          "امتیاز مشتری": item?.avgSatisfactionScore / totalVotes,
        },
        exportData: {
          id: item?.id,
          ردیف: index + 1,
          "نام ونام خانوادگی":
            item?.person?.firstName + " " + item?.person?.lastName,
          کدملی: item?.person?.idNumber,
          ایمیل: item?.Communication?.email?.find(
            (item: any) => item?.communicater === Communicater.home
          )?.communicationDetails,
          "شماره تماس": item?.Communication?.mobile?.[0]?.communicationDetails,
          شغل: item?.person?.personJobs?.[0]?.jobs?.name,
          "موضوع قرارداد": item?.lastContract?.contractType,
          "رتبه مشتری": item?.rank,
          قرارداد: convertDate(item?.lastContract?.submitDate, dateType),
          "مبلغ آخرین قرارداد": `${
            item?.lastContract?.price && formatPrice(item?.lastContract?.price)
          }`,
          [item?.profit < 0 ? "ضرر و زیان" : "سود"]: formatPrice(
            Math.abs(item?.profit)
          ),
          "تعداد مشتری": item?.totalPeopleInContracts,
          "تاریخ آخرین پیگیری": "",
          "نوع آخرین پیگیری": "",
          "وضعیت آخرین پیگیری": "",
          "پیگیری بعدی": "",
          "امتیاز مشتری": item?.avgSatisfactionScore / totalVotes,
        },
      }));
      const totalItems = action?.payload?.pagination?.total;
      state.totalPages = Math.ceil(totalItems / limitForCustomers);
      state.total = action?.payload?.pagination?.total;
      state.currentPage = action.meta.arg.page;
      const filters = action.meta.arg.filters;
      state.filters = filters;
      state.dateTimeRange.start =action?.payload?.meta?.startRangeTime;
      state.dateTimeRange.end =action?.payload?.meta?.endRangeTime;
    });
  },
});
export const fetchCustomers = createAsyncThunk<any, any>(
  "customer/fetchCustomers",
  async ({ page, limit, filters }) => {
    try {
      const result = await fetchService(
        `customer/rank?page=${page}&limit=${limit}`,
        {
          method: "POST",
          body: filters,
        }
      );

      return result;
    } catch {
      return {};
    }
  }
);
export const fetchAllCustomers = createAsyncThunk<any, any>(
  "customer/fetchAllCustomers",
  async ({ page, limit, filters }) => {
    try {
      const result = await fetchService(
        `customer/rank?page=${page}&limit=${limit}`,
        {
          method: "POST",
          body: filters,
        }
      );

      return result;
    } catch {
      return {};
    }
  }
);

export default customerSlice.reducer;
export const { setCheckedItems } = customerSlice.actions;
